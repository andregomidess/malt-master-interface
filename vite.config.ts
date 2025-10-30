import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { nodePolyfills as node } from 'vite-plugin-node-polyfills'


export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-macros'],
      },
    }),
    node({
      include: ['buffer'],
    }),
  ],
  build: {
    commonjsOptions: { transformMixedEsModules: true },
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.web.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },
})
