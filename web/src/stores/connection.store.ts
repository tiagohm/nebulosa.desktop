import { type Connection, DEFAULT_CONNECTION } from '@/pages/types'
import { connect, disconnect } from '@/shared/api'
import { getItemOrDefault, saveItem } from '@/shared/storage'
import { defineStore } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'

const connectionComparator = (a: Connection, b: Connection) => (b.connectedAt ?? 0) - (a.connectedAt ?? 0)

export const useConnectionStore = defineStore('connection', () => {
	const connections = ref<Connection[]>(getItemOrDefault('connections', () => [structuredClone(DEFAULT_CONNECTION)]).sort(connectionComparator))
	const current = ref(connections.value[0])
	const connected = ref(false)
	const connecting = ref(false)
	const showDialog = ref(false)
	const edited = ref<Connection>()

	const toast = useToast()

	// Show dialog to add new connection
	function add() {
		edited.value = { ...DEFAULT_CONNECTION, id: 0 }
		showDialog.value = true
	}

	// Show dialog to edit the connection
	function edit(connection: Connection, event?: MouseEvent) {
		event?.stopImmediatePropagation()
		edited.value = { ...connection }
		showDialog.value = true
	}

	// Add or update the edited connection and save it
	function save() {
		const connection = edited.value!

		if (connection.id === 0) {
			connection.id = Date.now()
			connections.value = [connection, ...connections.value]
			current.value = connection
		} else {
			const index = connections.value.findIndex((e) => e.id === connection.id)

			if (index >= 0) {
				connections.value[0] = connection

				if (current.value.id === connection.id) {
					current.value = connection
				}
			}
		}

		saveItem('connections', connections.value)

		showDialog.value = false
	}

	// Delete the connection
	function remove(connection: Connection, event?: MouseEvent) {
		event?.stopImmediatePropagation()

		if (connections.value.length === 1) {
			connections.value[0] = structuredClone(DEFAULT_CONNECTION)
		} else {
			const index = connections.value.indexOf(connection)

			if (index >= 0) {
				connections.value.splice(index, 1)
			}
		}

		saveItem('connections', connections.value)
	}

	// Connect or disconnect the active connection
	async function connectOrDisconnect() {
		if (connected.value) {
			if (current.value.status) {
				disconnect(current.value.status.id)
				connected.value = false
			}
		} else {
			try {
				connecting.value = true

				const status = await connect(current.value)

				if (status) {
					connected.value = true
					current.value.connectedAt = Date.now()
					current.value.status = status
					saveItem('connections', connections.value)
				}
			} catch {
				toast.add({ severity: 'error', summary: 'ERROR', detail: 'Failed to connect.', life: 2500 })
			} finally {
				connecting.value = false
			}
		}
	}

	return {
		connections,
		current,
		connected,
		connecting,
		showDialog,
		edited,
		add,
		edit,
		save,
		remove,
		connectOrDisconnect,
	}
})
