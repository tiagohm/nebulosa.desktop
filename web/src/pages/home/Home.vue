<script setup
        lang="ts">
        import ConnectButton from '@/components/ConnectButton.vue'
        import FloatInputNumber from '@/components/FloatInputNumber.vue'
        import FloatInputText from '@/components/FloatInputText.vue'
        import IconButton from '@/components/IconButton.vue'
        import TextButton from '@/components/TextButton.vue'
        import { type Connection, DEFAULT_CONNECTION } from '@/pages/types'
        import * as api from '@/shared/api'
        import { getItemOrDefault, saveItem } from '@/shared/storage'
        import { formatDate } from '@/shared/utils'
        import { useToast } from 'primevue/usetoast'
        import { onMounted, ref } from 'vue'

        const connectionComparator = (a: Connection, b: Connection) => (b.connectedAt ?? 0) - (a.connectedAt ?? 0)

        const toast = useToast()

        // Connection
        const connections = ref<Connection[]>(getItemOrDefault('connections', () => [structuredClone(DEFAULT_CONNECTION)]).sort(connectionComparator))
        const activeConnection = ref(connections.value[0])
        const connected = ref(false)
        const connecting = ref(false)
        const showConnectionDialog = ref(false)
        const editedConnection = ref<Connection>()

        function newConnection() {
            editedConnection.value = { ...DEFAULT_CONNECTION, id: 0 }
            showConnectionDialog.value = true
        }

        function editConnection(connection: Connection, event: MouseEvent) {
            event.stopImmediatePropagation()
            editedConnection.value = { ...connection }
            showConnectionDialog.value = true
        }

        function saveConnection() {
            const connection = editedConnection.value!

            if (connection.id === 0) {
                connection.id = Date.now()
                connections.value = [connection, ...connections.value]
                activeConnection.value = connection
            } else {
                const index = connections.value.findIndex(e => e.id === connection.id)

                if (index >= 0) {
                    connections.value[0] = connection

                    if (activeConnection.value.id === connection.id) {
                        activeConnection.value = connection
                    }
                }
            }

            saveItem('connections', connections.value)

            showConnectionDialog.value = false
        }

        function removeConnection(connection: Connection, event: MouseEvent) {
            event.stopImmediatePropagation()

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

        async function connectOrDisconnect() {
            if (connected.value) {
                if (activeConnection.value.status) {
                    api.disconnect(activeConnection.value.status.id)
                    connected.value = false
                }
            } else {
                try {
                    connecting.value = true

                    const status = await api.connect(activeConnection.value)

                    if (status) {
                        connected.value = true
                        activeConnection.value.connectedAt = Date.now()
                        activeConnection.value.status = status
                        saveItem('connections', connections.value)
                    }
                } catch {
                    toast.add({ severity: 'error', summary: 'ERROR', detail: 'Failed to connect!', life: 2500 })
                } finally {
                    connecting.value = false
                }
            }
        }

        onMounted(async () => {
            const statuses = await api.connections()

            if (statuses) {
                for (const status of statuses) {
                    for (const connection of connections.value) {
                        if (status.id === connection.status?.id || ((status.host === connection.host || status.ip === connection.host) && status.port === connection.port && status.type === connection.type)) {
                            connection.connectedAt ??= Date.now()
                            connection.status = status
                            activeConnection.value = connection
                            connected.value = true
                            break
                        }
                    }

                    if (connected.value) break
                }
            }
        })
</script>

<template>
    <div class="grid grid-cols-12 p-2 gap-3">
        <div class="col-span-2 flex justify-center items-center">
            <Button :text="true"
                    :rounded="true"
                    size="small"
                    severity="success"
                    v-tooltip.bottom="'New'"
                    @click="newConnection()">
                <i class="mdi mdi-plus" />
            </Button>
        </div>
        <div class="col-span-8">
            <Select v-model="activeConnection"
                    :options="connections"
                    size="small"
                    :disabled="connected || connecting"
                    class="w-full">
                <template #value="item">
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col justify-center">
                            <span>{{ item.value?.name }}</span>
                            <span class="text-xs">{{ item.value?.host }}:{{ item.value?.port }}</span>
                        </div>
                        <Tag severity="info"
                             :value="item?.value.type" />
                    </div>
                </template>
                <template #option="item">
                    <div class="w-full flex flex-row items-center justify-between gap-2">
                        <div class="flex flex-col justify-center">
                            <span class="font-bold">{{ item.option.name }}</span>
                            <span class="text-sm">{{ item.option.host }}:{{ item.option.port }}</span>
                            <span class="flex items-center gap-2">
                                <Tag severity="info"
                                     :value="item.option.type"
                                     class="max-w-fit" />
                                <span class="text-sm"> <i class="mdi mdi-clock" /> {{ formatDate(item.option.connectedAt, 'never') }}</span>
                            </span>
                        </div>
                        <div class="flex flex-col justify-center">
                            <IconButton icon="pencil"
                                        severity="info"
                                        v-tooltip.bottom="'Edit'"
                                        @click="editConnection(item.option, $event)" />
                            <IconButton icon="delete"
                                        severity="danger"
                                        v-tooltip.bottom="'Remove'"
                                        @click="removeConnection(item.option, $event)" />
                        </div>
                    </div>
                </template>
            </Select>
        </div>
        <div class="col-span-2 flex justify-center items-center">
            <ConnectButton :connected="connected"
                           :disabled="connecting"
                           @click="connectOrDisconnect()" />
        </div>
    </div>

    <Toast position="bottom-center" />

    <Dialog modal
            v-model:visible="showConnectionDialog"
            header="Connection"
            :style="{ width: '18rem', maxWidth: '95vw' }">
        <div class="grid grid-cols-12 gap-3 mt-2">
            <div class="col-span-full">
                <FloatInputText label="Name"
                                maxlength="32"
                                v-model="editedConnection!.name" />
            </div>
            <div class="col-span-7">
                <FloatInputText label="Host"
                                maxlength="48"
                                v-model="editedConnection!.host" />
            </div>
            <div class="col-span-5">
                <FloatInputNumber label="Port"
                                  :min="80"
                                  :max="65535"
                                  v-model="editedConnection!.port" />
            </div>
            <div class="col-span-full flex justify-end gap-2">
                <TextButton label="Cancel"
                            icon="close"
                            severity="danger"
                            @click="showConnectionDialog = false" />
                <TextButton label="Save"
                            icon="content-save"
                            :disabled="!editedConnection?.host || !editedConnection?.name"
                            @click="saveConnection()" />
            </div>
        </div>
    </Dialog>
</template>

<style scoped></style>
