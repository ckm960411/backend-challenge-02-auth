import { map } from 'lodash';
import { ProductCategoryEnum } from 'src/entities/enum/product-category.enum';
import { ProductOption } from 'src/entities/product-option.entity';
import { Product } from 'src/entities/product.entity';
import { Review } from 'src/entities/review.entity';
import { UserProduct } from 'src/entities/user-product.entity';
import { Wish } from 'src/entities/wish.entity';
import { ReviewResponse } from 'src/review/dto/response/get-review.response';
import { WithRelations } from 'src/utils/types/utility/WithRelations.utility';
import { Column } from 'typeorm';

export class BaseProductResponse {
  @Column()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  generation: string;

  @Column()
  releasedDate: string;

  @Column()
  price: number;

  @Column()
  thickness: string;

  @Column()
  weight: string;

  @Column()
  width: string;

  @Column()
  height: string;

  @Column()
  colors: { name: string; code: string }[];

  @Column()
  photos: string[];

  @Column()
  tags: string[];

  @Column()
  isPurchased: boolean;

  @Column()
  userProductId: number | null;

  @Column()
  isInWish: boolean;

  @Column()
  wishId: number | null;

  @Column()
  reviews: ReviewResponse[];

  @Column()
  specs: { type: string; value: string }[];

  constructor(
    product: WithRelations<
      Product,
      | 'productCategory'
      | 'productColors'
      | 'productTags'
      | 'productPhotos'
      | 'reviews'
    >,
    select?: {
      myOption?: WithRelations<ProductOption, 'productOptionDetails'>;
      reviews?: Review[];
      userProduct?: UserProduct;
      wish?: Wish;
    },
  ) {
    this.id = product.id;
    this.name = product.name;
    this.category = product.productCategory.name;
    this.generation = product.generation;
    this.releasedDate = product.releasedDate;
    this.price = product.price;
    this.thickness = product.thickness;
    this.weight = product.weight;
    this.width = product.width;
    this.height = product.height;
    this.colors = map(product.productColors, (color) => ({
      name: color.name,
      code: color.code,
    }));
    this.isPurchased = !!select?.userProduct;
    this.userProductId = select?.userProduct?.id ?? null;
    this.isInWish = !!select?.wish;
    this.wishId = select?.wish?.id ?? null;
    this.reviews = map(product.reviews, (review) => new ReviewResponse(review));
    this.specs = map(product.productSpecs, (spec) => ({
      type: spec.type,
      value: spec.value,
    }));
    this.photos = map(product.productPhotos, (photo) => photo.url);
  }
}

export class MacProductResponse extends BaseProductResponse {
  @Column()
  displaySize: string | null;

  @Column()
  displayHorizontalPixel: string | null;

  @Column()
  displayVerticalPixel: string | null;

  @Column()
  displayBrightness: string | null;

  @Column()
  options: MacOptionResposne[];

  @Column()
  myOption: MacOptionResposne | null;

  constructor(
    product: WithRelations<
      Product,
      | 'productCategory'
      | 'productColors'
      | 'productTags'
      | 'productSpecs'
      | 'productPhotos'
    >,
    productOptions: WithRelations<ProductOption, 'productOptionDetails'>[],
    select?: {
      myOption?: WithRelations<ProductOption, 'productOptionDetails'>;
      reviews?: Review[];
      userProduct?: UserProduct;
      wish?: Wish;
    },
  ) {
    super(product, select);
    product.productSpecs.forEach(({ type, value }) => {
      if (
        [
          'displaySize',
          'displayHorizontalPixel',
          'displayVerticalPixel',
          'displayBrightness',
        ].includes(type)
      ) {
        this[type] = value;
      }
    });
    this.options = map(productOptions, (option) => this.getOptionObj(option));
    this.myOption = select?.myOption
      ? this.getOptionObj(select.myOption)
      : null;
  }

  private getOptionObj(
    productOption: WithRelations<ProductOption, 'productOptionDetails'>,
  ) {
    const detailObj = productOption.productOptionDetails.reduce(
      (obj, detail) => {
        if (
          ['cpu', 'gpu', 'ram', 'storage', 'processor'].includes(detail.type)
        ) {
          obj[detail.type] = detail.value;
        }
        return obj;
      },
      {} as Pick<
        MacOptionResposne,
        'cpu' | 'gpu' | 'ram' | 'storage' | 'processor'
      >,
    );
    return {
      id: productOption.id,
      additionalPrice: productOption.additionalPrice,
      ...detailObj,
      optionSpecs: map(productOption.productOptionDetails, (detail) => ({
        type: detail.type,
        value: detail.value,
      })),
    };
  }
}

export class IPadProductResponse extends BaseProductResponse {
  @Column()
  processor: string | null;

  @Column()
  network: string | null;

  @Column()
  displaySize: string | null;

  @Column()
  displayHorizontalPixel: string | null;

  @Column()
  displayVerticalPixel: string | null;

  @Column()
  displayBrightness: string | null;

  @Column()
  options: IPadOptionResposne[];

  @Column()
  myOption: IPadOptionResposne | null;

  constructor(
    product: WithRelations<
      Product,
      | 'productCategory'
      | 'productColors'
      | 'productTags'
      | 'productSpecs'
      | 'productPhotos'
    >,
    productOptions: WithRelations<ProductOption, 'productOptionDetails'>[],
    select?: {
      myOption?: WithRelations<ProductOption, 'productOptionDetails'>;
      reviews?: Review[];
      userProduct?: UserProduct;
      wish?: Wish;
    },
  ) {
    super(product, select);
    product.productSpecs.forEach(({ type, value }) => {
      if (
        [
          'processor',
          'network',
          'displaySize',
          'displayHorizontalPixel',
          'displayVerticalPixel',
          'displayBrightness',
        ].includes(type)
      ) {
        this[type] = value;
      }
    });
    this.options = map(productOptions, (option) => this.getOptionObj(option));
    this.myOption = select?.myOption
      ? this.getOptionObj(select.myOption)
      : null;
  }

  private getOptionObj(
    option: WithRelations<ProductOption, 'productOptionDetails'>,
  ) {
    const detailObj = option.productOptionDetails.reduce(
      (obj, detail) => {
        if (['storage'].includes(detail.type)) {
          obj[detail.type] = detail.value;
        }
        return obj;
      },
      {} as Pick<IPadOptionResposne, 'storage'>,
    );
    return {
      id: option.id,
      additionalPrice: option.additionalPrice,
      optionSpecs: map(option.productOptionDetails, (detail) => ({
        type: detail.type,
        value: detail.value,
      })),
      ...detailObj,
    };
  }
}

export class IPhoneProductResponse extends BaseProductResponse {
  @Column()
  processor: string | null;

  @Column()
  displaySize: string | null;

  @Column()
  displayHorizontalPixel: string | null;

  @Column()
  displayVerticalPixel: string | null;

  @Column()
  displayBrightness: string | null;

  @Column()
  options: IPadOptionResposne[];

  @Column()
  myOption: IPhoneOptionResposne | null;

  constructor(
    product: WithRelations<
      Product,
      | 'productCategory'
      | 'productColors'
      | 'productTags'
      | 'productSpecs'
      | 'productPhotos'
    >,
    productOptions: WithRelations<ProductOption, 'productOptionDetails'>[],
    select?: {
      myOption?: WithRelations<ProductOption, 'productOptionDetails'>;
      reviews?: Review[];
      userProduct?: UserProduct;
      wish?: Wish;
    },
  ) {
    super(product, select);
    product.productSpecs.forEach(({ type, value }) => {
      if (
        [
          'processor',
          'displaySize',
          'displayHorizontalPixel',
          'displayVerticalPixel',
          'displayBrightness',
        ].includes(type)
      ) {
        this[type] = value;
      }
    });
    this.options = map(productOptions, (option) => this.getOptionObj(option));
    this.myOption = select?.myOption
      ? this.getOptionObj(select.myOption)
      : null;
  }

  private getOptionObj(
    option: WithRelations<ProductOption, 'productOptionDetails'>,
  ) {
    const detailObj = option.productOptionDetails.reduce(
      (obj, detail) => {
        if (['storage'].includes(detail.type)) {
          obj[detail.type] = detail.value;
        }
        return obj;
      },
      {} as Pick<IPhoneOptionResposne, 'storage'>,
    );
    return {
      id: option.id,
      additionalPrice: option.additionalPrice,
      optionSpecs: map(option.productOptionDetails, (detail) => ({
        type: detail.type,
        value: detail.value,
      })),
      ...detailObj,
    };
  }
}

export class GetOneProductResponse {
  static of(
    product: WithRelations<
      Product,
      | 'productCategory'
      | 'productColors'
      | 'productTags'
      | 'productSpecs'
      | 'productPhotos'
      | 'reviews'
    >,
    productOptions: WithRelations<ProductOption, 'productOptionDetails'>[] = [],
    select?: {
      myOption?: WithRelations<ProductOption, 'productOptionDetails'>;
      reviews?: Review[];
      userProduct?: UserProduct;
      wish?: Wish;
    },
  ) {
    switch (product.productCategory.name) {
      case ProductCategoryEnum.MAC:
        return new MacProductResponse(product, productOptions, select);
      case ProductCategoryEnum.IPAD:
        return new IPadProductResponse(product, productOptions, select);
      case ProductCategoryEnum.IPHONE:
        return new IPhoneProductResponse(product, productOptions, select);
      default:
        return new BaseProductResponse(product, select);
    }
  }
}

export interface MacOptionResposne {
  id: number;
  additionalPrice: number;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  processor: string;
  optionSpecs: { type: string; value: string }[];
}

export interface IPadOptionResposne {
  id: number;
  additionalPrice: number;
  storage: string;
  optionSpecs: { type: string; value: string }[];
}

export interface IPhoneOptionResposne {
  id: number;
  additionalPrice: number;
  storage: string;
  optionSpecs: { type: string; value: string }[];
}
