<script setup lang="ts">
import { chain } from 'lodash';
import { Company, Order } from '~/cls/order.class';
import { XLSXParser } from '~/cls/xlsx.class';
import { Type1Parser, Type2Parser, Type3Parser, Type4Parser, Type5Parser, Type6Parser } from '~/cls/parser.class';
import { useDropZone } from '@vueuse/core';
import dayjs from 'dayjs';

const { writefile, createSheet } = new XLSXParser();

const datas = ref<Order[]>([]);
const onChangeFile = async (files: File[] | null) => {
  let orders: Order[] = [];
  for (const file of files ?? []) {
    console.log(file);
    if (file.name.startsWith(Company.type1)) {
      const parser = new Type1Parser();
      const rows = await parser.readFile(file);
      orders = orders.concat(rows.map(d => parser.parse(d)));
    } else if (file.name.startsWith(Company.type2)) {
      const parser = new Type2Parser();
      const rows = await parser.readFile(file);
      orders = orders.concat(rows.map(d => parser.parse(d)));
    } else if (file.name.startsWith(Company.type3)) {
      const parser = new Type3Parser();
      const rows = await parser.readFile(file);
      orders = orders.concat(rows.map(d => parser.parse(d)));
    } else if (file.name.startsWith(Company.type4)) {
      const parser = new Type4Parser();
      const rows = await parser.readFile(file);
      orders = orders.concat(rows.map(d => parser.parse(d)));
    } else if (file.name.startsWith(Company.type5)) {
      const parser = new Type5Parser();
      const rows = await parser.readFile(file);
      orders = orders.concat(rows.map(d => parser.parse(d)));
    } else if (file.name.startsWith(Company.type6)) {
      const parser = new Type6Parser();
      const rows = await parser.readFile(file);
      orders = orders.concat(rows.map(d => parser.parse(d)));
    } else {
      alert('파일명이 잘못되었습니다.');
      throw new Error();
    }
  }

  const productData = chain(orders)
    .map(v => v.items)
    .flatten()
    .groupBy(v => [v.name, v.color, v.size].join('/'))
    .map(v => {
      return {
        제품명: v[0].name,
        사이즈: v[0].size,
        색상: v[0].color,
        수량: v.reduce((acc, v) => acc + v.quantity, 0),
      };
    })
    .sortBy(v => v.수량)
    .reverse()
    .value();
  
  const orderData = chain(orders)
    .map(v => {
      const products = v.items;
      return {
        주문자: v.username,
        연락처: v.phone,
        주소: v.address,
        우편번호: v.postcode,
        상품수량: products.reduce((acc, v) => acc + v.quantity, 0),
        상품목록: products.map(v => `${v.name} ${v.color} ${v.size} ${v.quantity}개`).join('\n'),
        배송비: v.address.startsWith('제주') ? 6000 : 3000,
      }
    })
    .value();

  writefile([
    ['제품목록', createSheet(productData)],
    ['주문목록', createSheet(orderData)]
  ], `${dayjs().format('YYYY-MM-DD HH:mm')}.xlsx`);
};

const parent = ref<HTMLDivElement>();
const { isOverDropZone } = useDropZone(parent, files => {
  const filterFiles = files?.filter(
    v => v.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  onChangeFile(filterFiles ?? null);
});
</script>

<template>
  <div ref="parent" id="drop-zone" :class="{ active: isOverDropZone }">
    <div>파일을 여기에 드래그하세요.</div>
  </div>
</template>

<style scoped>
#drop-zone {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  font-size: 1.5em;
  margin: 20px auto;
  width: 80%;
  height: 80vh;
}
#drop-zone.active {
  border-color: #6c757d;
  background-color: #6c757d;
}
#file-input {
  display: none;
}
</style>
