// // import path from 'path';
// // import { defineConfig, loadEnv } from 'vite';
// // import react from '@vitejs/plugin-react';

// // export default defineConfig(({ mode }) => {
// //     const env = loadEnv(mode, '.', '');
// //     return {
// //       server: {
// //         port: 3000,
// //         host: '0.0.0.0',
// //       },
// //       plugins: [react()],
// //       define: {
// //         'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
// //         'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
// //       },
// //       resolve: {
// //         alias: {
// //           '@': path.resolve(__dirname, '.'),
// //         }
// //       }
// //     };
// // });


// // vite.config.ts
// import { defineConfig, loadEnv } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// export default defineConfig(({ mode }) => {
//   // Load .env, .env.local, etc. — Vite automatically looks for these
//   const env = loadEnv(mode, process.cwd(), '');

//   return {
//     server: {
//       port: 3000,
//       host: true, // This is better than '0.0.0.0' → enables LAN access too
//       open: true, // Optional: auto-open browser on start
//     },

//     plugins: [react()],

//     // Inject your Gemini API key at build/dev time
//     define: {
//       // This is the exact string your code uses → process.env.API_KEY
//       'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
//     },

//     resolve: {
//       alias: {
//         '@': path.resolve(__dirname, './src'), // Much better: points to /src
//       },
//     },

//     // Optional: improve dev experience
//     clearScreen: false,
//     envPrefix: ['VITE_', 'GEMINI_'], // Allows GEMeworthy_ vars without exposing all
//   };
// });

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // Load all env vars

  return {
    server: {
      port: 3000,
      host: true,
    },
    plugins: [react()],
    define: {
      'process.env.GEMINI_API_KEY_1': JSON.stringify(env.GEMINI_API_KEY_1),
      'process.env.GEMINI_API_KEY_2': JSON.stringify(env.GEMINI_API_KEY_2),
      'process.env.GEMINI_API_KEY_3': JSON.stringify(env.GEMINI_API_KEY_3),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    envPrefix: ['VITE_', 'GEMINI_'], // Allow GEMINI_ prefix
  };
});