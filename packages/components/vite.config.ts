import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'GenFHI-ts',
      fileName: 'genfhi-ts',
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },

})
