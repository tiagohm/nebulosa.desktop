import type { Connect } from '../shared/api'

export interface Connection extends Connect {
    id: number
	name: string
}

export const DEFAULT_CONNECTION: Connection = {
    id: 0,
	name: 'Local',
	host: 'localhost',
	port: 7624,
	type: 'INDI',
}
