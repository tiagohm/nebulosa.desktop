import '@/assets/main.css'

import { mountApp } from '../app'
import Home from './Home.vue'

mountApp(Home, { toast: true, pinia: true })
