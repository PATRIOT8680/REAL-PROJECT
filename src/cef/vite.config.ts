import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
  assetsInclude: ['**/*.json'],
  root: './',
	build: {
		outDir: '../../client_packages/cef/',
		rollupOptions: {
			output: {
				manualChunks: undefined,
				inlineDynamicImports: true,
			}
		}
	},
})
