/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  base: './', // ใช้ Relative Path เพื่อให้เรียกไฟล์จากโฟลเดอร์ไหนก็ได้
  build: {
    outDir: 'docs', // เปลี่ยนจาก dist เป็น docs
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
