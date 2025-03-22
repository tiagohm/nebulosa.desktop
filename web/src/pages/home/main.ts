import '@/assets/main.css'

import Aura from '@primeuix/themes/aura'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import Home from './Home.vue'

const app = createApp(Home)

app.use(createPinia())
app.use(PrimeVue, {
	theme: {
		preset: Aura,
		options: {
			darkModeSelector: '.dark-mode',
			cssLayer: {
				name: 'primevue',
				order: 'theme, base, primevue, utilities',
			},
		},
	},
})

app.mount('#app')
