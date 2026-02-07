import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import packageJson from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(
      (packageJson as { version: string }).version
    ),
  },
  server: {
    // 전체 IP에서 접속 가능하도록 설정
    host: '0.0.0.0',
    port: 3000, // 개발 서버 포트
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
