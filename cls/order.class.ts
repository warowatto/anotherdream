// 주문자명, 주문자 연력처, 주문자 주소, 상품목록이 들어갈 클래스
export class Order {
  username: string;
  phone: string;
  postcode: string;
  address: string;
  note: string;
  items: Product[];

  constructor (params?: Partial<Order>) {
    if (params) {
      Object.assign(this, params);
    }
  }
}

export class Product {
  name: string;
  color: string;
  size: string;
  quantity: number;

  constructor (params?: Partial<Product>) {
    if (params) {
      Object.assign(this, params);
    }
  }
}

export enum Company {
  type1 = '르얼반',
  type2 = '메이재이',
  type3 = '치즈상점',
  type4 = '더주니',
  type5 = '수와후',
  type6 = '한나룸'
}