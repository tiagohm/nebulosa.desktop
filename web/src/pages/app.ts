import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import { type Component, createApp } from 'vue'
import { AppTheme } from './app.theme'

export interface MountAppOptions {
	rootContainer?: string | Element
	toast?: boolean
}

export function mountApp(component: Component, options?: MountAppOptions) {
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

	if (options?.toast) app.use(ToastService)

	app.directive('tooltip', Tooltip)

	app.mount(options?.rootContainer || '#app')

	return app
}
