export type ConnectionType = 'INDI'

export interface Connect {
	host: string
	port: number
	type: ConnectionType
}

export interface ConnectionStatus extends Connect {
	id: string
	ip?: string
}

export function connect(req: Connect) {
	return POST<ConnectionStatus>('connections', req)
}

const DEFAULT_HEADERS = new Headers({ 'Content-Type': 'application/json' })

const DEFAULT_URL = 'http://localhost:7000'

async function GET<T>(path: string) {
	const url = localStorage.getItem('api.url') || DEFAULT_URL
	const response = await fetch(`${url}/${path}`, { method: 'GET', redirect: 'follow' })
	const text = await response.text()
	return text ? (JSON.parse(text) as T) : undefined
}

export async function POST<T>(path: string, body?: unknown) {
	const url = localStorage.getItem('api.url') || DEFAULT_URL
	const raw = body === undefined || body === null ? undefined : JSON.stringify(body)
	const response = await fetch(`${url}/${path}`, { method: 'POST', body: raw, headers: DEFAULT_HEADERS, redirect: 'follow' })
	const text = await response.text()
	return text ? (JSON.parse(text) as T) : undefined
}

async function PUT<T>(path: string, body?: unknown) {
	const url = localStorage.getItem('api.url') || DEFAULT_URL
	const raw = body === undefined || body === null ? undefined : JSON.stringify(body)
	const response = await fetch(`${url}/${path}`, { method: 'PUT', body: raw, headers: DEFAULT_HEADERS, redirect: 'follow' })
	const text = await response.text()
	return text ? (JSON.parse(text) as T) : undefined
}

function DELETE(path: string) {
	const url = localStorage.getItem('api.url') || DEFAULT_URL
	return fetch(`${url}/${path}`, { method: 'DELETE', redirect: 'follow' })
}
