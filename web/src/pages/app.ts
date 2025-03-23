import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import { type Component, createApp } from 'vue'
import { AppTheme } from './app.theme'

export function mountApp(component: Component, rootContainer: string | Element = '#app') {
	const app = createApp(component)

	app.use(PrimeVue, {
		ripple: false,
		theme: {
			preset: AppTheme,
			options: {
				darkModeSelector: '.dark-mode',
				inputVariant: 'filled',
				cssLayer: {
					name: 'primevue',
					order: 'theme, base, primevue, utilities',
				},
			},
		},
	})

	app.directive('tooltip', Tooltip)

	app.mount(rootContainer)

	return app
}
