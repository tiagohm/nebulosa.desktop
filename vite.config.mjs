import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { readdirSync, statSync } from 'fs';
import { readFileSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { URL, fileURLToPath } from 'node:url';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

const __dirname = join(dirname(fileURLToPath(import.meta.url)), 'web', 'src', 'pages')

const flattenHtml = {
	name: 'flatten-html',
	closeBundle() {
		const srcDir = 'dist/web'

		const move = (dir) => {
			for (const file of readdirSync(dir)) {
				const path = join(dir, file)

				if (statSync(path).isDirectory()) {
					move(path)
					rmdirSync(path)
				} else if (file.endsWith('.html')) {
					const name = basename(dirname(path))
					const filepath = join('dist', `${name}.html`)
					// renameSync(path, filepath)

					// Read and adjust paths in the HTML
					let content = readFileSync(path, 'utf-8')

					content = content.replace(/(src|href)="([^"]+)"/g, (match, attr, url) => {
						if (!(url.startsWith('http') || url.startsWith('/'))) {
							return `${attr}="./${basename(url)}"`
						}

						return match
					})

					writeFileSync(filepath, content)
					unlinkSync(path)
				}
			}
		}

		move(srcDir)
		rmdirSync(srcDir)
	},
}

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), vueJsx(), Components({ resolvers: [PrimeVueResolver()] }), tailwindcss(), vueDevTools(), flattenHtml],
	base: './',
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./web/src', import.meta.url)),
		},
	},
	build: {
		outDir: 'dist',
		emptyOutDir: true,
		rollupOptions: {
			input: {
				home: resolve(__dirname, 'home/index.html'),
			},
			output: {
				entryFileNames: '[name].[hash].js',
				chunkFileNames: '[name].[hash].js',
				assetFileNames: '[name].[hash][extname]',
			},
		},
	},
})
