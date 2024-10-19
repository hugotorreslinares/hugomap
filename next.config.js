   // next.config.js
   const withImages = require('next-optimized-images');
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   });

   module.exports = withBundleAnalyzer(
     withImages({
       // Configuraciones adicionales
       images: {
         disableStaticImages: true,
       },
       webpack(config) {
         // Configuraciones de Webpack
         return config;
       },
     })
   );