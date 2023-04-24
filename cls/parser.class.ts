import { Order, Product } from './order.class';
import { XLSXParser } from './xlsx.class';
import { groupBy, isEmpty } from 'lodash';

const fileController = new XLSXParser();

export interface Parser {
  readFile(file: File): Promise<any[]>;
  parse(obj: any[]): Order;
  parseProduct(obj: any[]): Product[];
}

// Path: cls\parser\type1.parser.ts
// Compare this snippet from cls\parser\type1.parser.ts:

/**
 * 르얼반 주문서 파서
 * 주문서의 형식이 고정되어 있어서, 엑셀파일을 읽어서 Order 객체로 변환하는 작업만 수행한다.
 * 주문서의 형식이 변경되면, 이 클래스를 수정해야 한다.
 */
export class Type1Parser implements Parser {
  async readFile(file: File): Promise<any[]> {
    const content = await fileController.readfile(file);
    return Object.entries(groupBy(content, (v: any) => v['주소'])).map(([_, values]) => values);
  }

  parseProduct(datas: any[]): Product[] {
    const products: Product[] = [];

    for (const data of datas) {
      const options = [data['옵션1'], data['옵션2'], data['옵션3'], data['옵션4']]
        .filter(v => !isEmpty(v))
        .map(option => option.split(':')[1]?.trim());

      products.push({
        name: data['상품명'].replace('1+1', '').trim(),
        size: options[1]?.toUpperCase() ?? 'FREE',
        color: options[0],
        quantity: +data['주문수량'],
      });

      if (options.length > 2) {
        products.push({
          name: data['상품명'].replace('1+1', '').trim(),
          size: options[3]?.toUpperCase() ?? 'FREE',
          color: options[2],
          quantity: +data['주문수량'],
        });
      }
    }

    return products;
  }

  parse(datas: any[]): Order {
    const [obj] = datas;
    const order = new Order();
    order.username = obj['주문자명'];
    order.phone = obj['주문자휴대폰'];
    order.postcode = obj['우편번호'];
    order.address = obj['주소'];
    order.note = obj['배송시요청사항'];
    order.items = this.parseProduct(datas)

    return order;
  }
}

/**
 * 메이재이 주문서 파서
 * 주문서의 형식이 고정되어 있어서, 엑셀파일을 읽어서 Order 객체로 변환하는 작업만 수행한다.
 * 주문서의 형식이 변경되면, 이 클래스를 수정해야 한다.
 */
export class Type2Parser implements Parser {
  async readFile(file: File): Promise<any[]> {
    const content = await fileController.readfile(file);
    return Object.entries(groupBy(content, (v: any) => v['수령인 주소(전체)'])).map(([_, values]) => values);
  }

  parse(datas: any[]): Order {
    const [obj] = datas;
    const order = new Order();
    order.username = obj['수령인'];
    order.phone = obj['수령인 휴대전화'];
    order.postcode = obj['수령인 우편번호'];
    order.address = obj['수령인 주소(전체)'];
    order.note = obj['배송메시지'];
    order.items = this.parseProduct(datas);

    return order;
  }

  parseProduct(datas: any[]): Product[] {
    const products: Product[] = [];

    for (const data of datas) {
      const regex = /^(.+?)\((.+)\)$/;
      const [, productname, optionText] = regex.exec(data['주문상품명(옵션포함)'])!;
      const options = optionText
        .split(',')
        .map((v: string) => v.trim())
        .map((v: string) => v.split('=')[1]);

      products.push({
        name: productname.replace('1+1', '').trim(),
        size: options[1]?.toUpperCase() ?? 'FREE',
        color: options[0],
        quantity: +data['수량'],
      });

      if (options.length >= 3) {
        products.push({
          name: productname.replace('1+1', '').trim(),
          size: options[3]?.toUpperCase() ?? 'FREE',
          color: options[2],
          quantity: +data['수량'],
        });
      }
    }
    return products;
  }
}

/**
 * 치즈상점 주문서 파서
 * 주문서의 형식이 고정되어 있어서, 엑셀파일을 읽어서 Order 객체로 변환하는 작업만 수행한다.
 * 주문서의 형식이 변경되면, 이 클래스를 수정해야 한다.
 */
export class Type3Parser implements Parser {
  async readFile(file: File): Promise<any[]> {
    const rows = await fileController.readfile(file);
    const content = rows.filter((v: any, index: number) => index >= 2);
    return Object.entries(groupBy(content, (v: any) => v['주소'])).map(([_, values]) => values);
  }

  parse(datas: any[]): Order {
    const [obj] = datas;
    const order = new Order();
    order.username = obj['수화인'];
    order.phone = obj['연락처'];
    order.postcode = obj['수령인 우편번호'];
    order.address = obj['주소'];
    order.items = this.parseProduct(datas);

    return order;
  }

  parseProduct(obj: any[]): Product[] {
    const products: Product[] = [];

    for (const data of obj) {
      const [, productname, optionText] = /^(.*?):(.*?)$/.exec(data['상품명'])!;
      const [colorText, sizeText] = optionText.split(' / ').map(str => str.trim());

      const name = productname.replace(/색상$/, '').trim();
      const color = colorText;
      const size = sizeText.split(':')[1].trim();

      products.push({
        name,
        size,
        color,
        quantity: +data['수량'],
      });
    }

    return products;
  }
}

/**
 * 더주니 주문서 파서
 * 주문서의 형식이 고정되어 있어서, 엑셀파일을 읽어서 Order 객체로 변환하는 작업만 수행한다.
 * 주문서의 형식이 변경되면, 이 클래스를 수정해야 한다.
 */
export class Type4Parser implements Parser {
  async readFile(file: File): Promise<any[]> {
    const content = await fileController.readfile(file);
    return Object.entries(groupBy(content, (v: any) => v['주소'])).map(([_, values]) => values);
  }

  parse(datas: any[]): Order {
    const [obj] = datas;
    const order = new Order();
    order.username = obj['주문자명'];
    order.phone = obj['주문자휴대폰'];
    order.postcode = obj['우편번호'];
    order.address = obj['주소'];
    order.items = this.parseProduct(datas);

    return order;
  }

  parseProduct(datas: any[]): Product[] {
    const products: Product[] = [];

    for (const data of datas) {
      const info: string = data['상품정보(상세)'];
      const [productname, ...options] = info.split('/').map(v => v.trim());

      for (const option of options) {
        const colors = option.match(/색상=([^\s]+)/g)!.map(v => v.split('=')[1]);
        const sizes = option.match(/사이즈=([^\s]+)/g)!.map(v => v.split('=')[1]);
        const count = +option.match(/\(\d개\)$/)![0].match(/\d/)![0];

        for (const colorIndex in colors) {
          products.push({
            name: productname,
            size: sizes[colorIndex] ?? sizes[0],
            color: colors[colorIndex],
            quantity: count,
          });
        }
      }
    }
    return products;
  }
}

/**
 * 수와후 주문서 파서
 * 주문서의 형식이 고정되어 있어서, 엑셀파일을 읽어서 Order 객체로 변환하는 작업만 수행한다.
 * 주문서의 형식이 변경되면, 이 클래스를 수정해야 한다.
 */
export class Type5Parser implements Parser {
  async readFile(file: File): Promise<any[]> {
    const content = await fileController.readfile(file, 1);
    console.log(content);
    return Object.entries(groupBy(content, (v: any) => v['주소'])).map(([_, values]) => values);
  }

  parse(datas: any[]): Order {
    const [obj] = datas;
    const order = new Order();
    order.username = obj['주문자 성함'];
    order.phone = obj['주문자 번호'];
    order.postcode = obj['우편번호'];
    order.address = obj['주소'];
    order.note = obj['배송메세지'];
    order.items = this.parseProduct(datas);

    return order;
  }

  parseProduct(obj: any[]): Product[] {
    const products: Product[] = [];

    for (const data of obj) {
      const info: string = data['상품명'];
      const productname = info.substring(0, info.indexOf('('));
      const [color, size] = info.substring(info.indexOf('(') + 1, info.length - 1).split('/');
      products.push({
        name: productname,
        size: size.trim().toUpperCase(),
        color: color.trim(),
        quantity: +data['수량'],
      });
    }

    return products;
  }
}

/**
 * 한나룸 주문서 파서
 * 주문서의 형식이 고정되어 있어서, 엑셀파일을 읽어서 Order 객체로 변환하는 작업만 수행한다.
 * 주문서의 형식이 변경되면, 이 클래스를 수정해야 한다.
 */
export class Type6Parser implements Parser {
  async readFile(file: File): Promise<any[]> {
    const content = await fileController.readfile(file, 0);
    return Object.entries(groupBy(content, (v: any) => v['주소'])).map(([_, values]) => values);
  }

  parse(datas: any[]): Order {
    const [obj] = datas;
    const order = new Order();
    order.username = obj['주문자명'];
    order.phone = obj['주문자휴대폰'];
    order.postcode = obj['우편번호'];
    order.address = obj['주소'];
    order.items = this.parseProduct(datas);

    return order;
  }

  parseProduct(datas: any[]): Product[] {
    const products: Product[] = [];

    for (const data of datas) {
      const options = [data['옵션1'], data['옵션2'], data['옵션3'], data['옵션4']]
        .filter(v => !isEmpty(v))
        .map(option => option.split(':')[1]?.trim());

      products.push({
        name: data['상품명'].replace('1+1', '').trim(),
        size: options[1]?.toUpperCase() ?? 'FREE',
        color: options[0],
        quantity: +data['주문수량'],
      });

      if (options.length > 2) {
        products.push({
          name: data['상품명'].replace('1+1', '').trim(),
          size: options[3]?.toUpperCase() ?? 'FREE',
          color: options[2],
          quantity: +data['주문수량'],
        });
      }
    }

    return products;
  }
}
