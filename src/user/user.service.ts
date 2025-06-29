import { map, omit, sumBy, uniq } from 'lodash';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { SigninMethod } from 'src/auth/types/enum/signin-method.enum';
import { UserProductService } from 'src/user-product/user-product.service';
import { UserProductStatus } from 'src/entities/enum/user-product-status.enum';
import { differenceInMonths } from 'date-fns';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userProductService: UserProductService,
  ) {}

  /**
   * User 조회 by Email
   */
  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * User 조회 by ID
   */
  async findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * User 생성
   */
  async createUser({
    name,
    email,
    password,
    provider,
    providerId,
  }: {
    name: string;
    email: string;
    password: string;
    provider?: SigninMethod;
    providerId?: string;
  }): Promise<Omit<User, 'password'>> {
    const user = await this.findByEmail(email);

    if (user) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const newUser: User = await this.userRepository.save({
      name,
      email,
      password,
      provider,
      providerId,
    });

    return omit(newUser, ['password']);
  }

  /**
   * 비밀번호 업데이트
   */
  async updatePassword(userId: number, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, { password: hashedPassword });
  }

  async getMyTier(userId: number) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const userProducts =
      await this.userProductService.findAllUserProducts(userId);

    // 얼마나 낳은 기기를 구매했는지
    // 현재보유 3점, 과거보유1점
    const productCountPoint =
      sumBy(userProducts, (userProduct) => {
        if (userProduct.status === UserProductStatus.SOLD) {
          return 1 * (userProduct.repurchasedCount || 1);
        }
        return 3 * (userProduct.repurchasedCount || 1);
      }) ?? 0;

    // 얼마나 많은 돈을 썼는지
    // 100만원당 1점
    const productPricePoint =
      Math.ceil(
        sumBy(userProducts, (userProduct) => {
          const product = userProduct.product as any;
          return (
            userProduct.purchasePrice ??
            product.price + (product?.myOption?.additionalPrice ?? 0)
          );
        }) / 1000000,
      ) ?? 0;

    // 얼마나 오래 사용했는지
    // 10년당 1점
    const purchasedMonthCount = sumBy(userProducts, (userProduct) => {
      return differenceInMonths(new Date(), new Date(userProduct.purchasedAt));
    });
    const purchasedYearCount = Math.ceil(purchasedMonthCount / 12);
    const purchasedYearPoint = Math.ceil(purchasedYearCount / 10) ?? 0;

    // 얼마나 많은 카테고리를 꾸리고 있는지
    const currentUserProducts = userProducts.filter(
      (userProduct) => userProduct.status !== UserProductStatus.SOLD,
    );
    const categoryCount = uniq(
      map(currentUserProducts, ({ product }) => (product as any).category),
    ).length;
    const categoryPoint = categoryCount ** 2;

    const totalPoint =
      productCountPoint +
      productPricePoint +
      purchasedYearPoint +
      categoryPoint;

    return {
      productCountPoint,
      productPricePoint,
      purchasedYearPoint,
      categoryPoint,
      totalPoint,
      tier: this.getTier(totalPoint),
    };
  }

  private getTier(totalPoint: number) {
    if (totalPoint <= 15) return 'BRONZE';
    if (totalPoint <= 30) return 'SILVER';
    if (totalPoint <= 45) return 'GOLD';
    if (totalPoint <= 60) return 'PLATINUM';
    return 'GRANDMASTER';
  }
}
