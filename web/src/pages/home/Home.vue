<script setup
        lang="ts">
        import ConnectButton from '@/components/ConnectButton.vue'
        import FloatInputNumber from '@/components/FloatInputNumber.vue'
        import FloatInputText from '@/components/FloatInputText.vue'
        import TextButton from '@/components/TextButton.vue'
        import { type Connection, DEFAULT_CONNECTION } from '@/pages/types'
        import { getItemOrDefault } from '@/shared/storage'
        import { ref } from 'vue'

        const connections = ref<Connection[]>(getItemOrDefault('connections', () => [structuredClone(DEFAULT_CONNECTION)]))
        const activeConnection = ref(connections.value[0])
        const connected = ref(false)

        const showEditConnectionDialog = ref(false)
        const editedConnection = ref<Connection>()

        function newConnection() {
            editedConnection.value = structuredClone(DEFAULT_CONNECTION)
            showEditConnectionDialog.value = true
        }

        function editConnection(connection: Connection) {
            editedConnection.value = structuredClone(connection)
            showEditConnectionDialog.value = true
        }

        function connectOrDisconnect() {
            connected.value = !connected.value
        }
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
                    optionLabel="name"
                    size="small"
                    class="w-full" />
        </div>
        <div class="col-span-2 flex justify-center items-center">
            <ConnectButton :connected="connected"
                           @click="connectOrDisconnect()" />
        </div>
    </div>

    <Dialog v-model:visible="showEditConnectionDialog"
            modal
            header="Connection"
            :style="{ width: '25rem' }">
        <div class="grid grid-cols-2 gap-3 mt-2">
            <div class="col-span-full">
                <FloatInputText label="Name"
                                v-model="editedConnection!.name" />
            </div>
            <div class="col-span-1">
                <FloatInputText label="Host"
                                v-model="editedConnection!.host" />
            </div>
            <div class="col-span-1">
                <FloatInputNumber label="Port"
                                  :min="80"
                                  :max="65535"
                                  v-model="editedConnection!.port" />
            </div>
            <div class="col-span-full flex justify-end gap-2">
                <TextButton label="Cancel"
                            icon="close"
                            severity="danger"
                            @click="showEditConnectionDialog = false" />
                <TextButton label="Save"
                            icon="content-save"
                            @click="showEditConnectionDialog = false" />
            </div>
        </div>
    </Dialog>
</template>

<style scoped></style>
