// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  // modules: [
  //   'nuxt-electron',
  // ],
  app: {
    baseURL:'//',
    head: {
      htmlAttrs: {
        lang: 'ko',
      },
      title: '주문서 변환기',
    },
  },
  router: {
    options: {
      hashMode: true,
    }
  }
});
