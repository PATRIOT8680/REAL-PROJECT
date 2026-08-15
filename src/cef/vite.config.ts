import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
<<<<<<< HEAD
  server: {
    host: '127.0.0.1',
    port: 3200,
    strictPort: true,
  },
  assetsInclude: ['**/*.json'],
  root: './',
  optimizeDeps: {
    include: ['react-window'],
  },
=======
  assetsInclude: ['**/*.json'],
  root: './',
>>>>>>> 89e8cc87b8029b6838e014390449022afd77597c
  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern' // Используем modern API вместо legacy
      }
    }
  },
	build: {
		outDir: '../../client_packages/cef/',
    target: 'esnext',
		rollupOptions: {
			output: {
				manualChunks: undefined,
				inlineDynamicImports: true,
			}
		}
	},
})
