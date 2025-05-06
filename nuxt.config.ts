// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  runtimeConfig: {
    realEstateApiKey: process.env.REAL_ESTATE_API_KEY,
    realEstateUserId: process.env.REAL_ESTATE_USER_ID || 'UniqueUserIdentifier', // Add this
    public: {
      MAPBOX_API_TOKEN: process.env.MAPBOX_API_TOKEN,
      ZILLOW_API_KEY: process.env.ZILLOW_API_KEY,
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
    }
  }
})
