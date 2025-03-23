import { map } from 'lodash';
import { ProductCategoryEnum } from 'src/entities/enum/product-category.enum';
import { ProductOption } from 'src/entities/product-option.entity';
import { Product } from 'src/entities/product.entity';
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

  constructor(
    product: WithRelations<
      Product,
      'productCategory' | 'productColors' | 'productTags' | 'productPhotos'
    >,
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
  ) {
    super(product);
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
    this.options = map(productOptions, (option) => {
      const detailObj = option.productOptionDetails.reduce(
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
        id: option.id,
        additionalPrice: option.additionalPrice,
        ...detailObj,
      };
    });
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
  ) {
    super(product);
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
    this.options = map(productOptions, (option) => {
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
        ...detailObj,
      };
    });
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
  ) {
    super(product);
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
    this.options = map(productOptions, (option) => {
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
        ...detailObj,
      };
    });
  }
}

export class GetProductsResponse {
  static of(
    product: WithRelations<
      Product,
      | 'productCategory'
      | 'productColors'
      | 'productTags'
      | 'productSpecs'
      | 'productPhotos'
    >,
    productOptions?: WithRelations<ProductOption, 'productOptionDetails'>[],
  ) {
    switch (product.productCategory.name) {
      case ProductCategoryEnum.MAC:
        return new MacProductResponse(product, productOptions);
      case ProductCategoryEnum.IPAD:
        return new IPadProductResponse(product, productOptions);
      case ProductCategoryEnum.IPHONE:
        return new IPhoneProductResponse(product, productOptions);
      default:
        return new BaseProductResponse(product);
    }
  }
}

export class MacOptionResposne {
  id: number;
  additionalPrice: number;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  processor: string;
}

export class IPadOptionResposne {
  id: number;
  additionalPrice: number;
  storage: string;
}

export class IPhoneOptionResposne {
  id: number;
  additionalPrice: number;
  storage: string;
}
