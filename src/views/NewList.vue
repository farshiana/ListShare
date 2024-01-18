<template>
  <v-container class="d-flex justify-center">
    <v-card
    width="100%"
    max-width="400px"
    title="New List"
  >
    <v-card-text>
      <v-form ref="form" @submit.prevent="addList">
        <v-container class="px-0">
          <v-btn-toggle v-model="type" mandatory :rules="rules">
            <v-btn value="groceries">
              Groceries
            </v-btn>
            <v-btn value="todo">
              Todo
            </v-btn>
          </v-btn-toggle>
          <v-text-field
            v-model="name"
            persistent-placeholder
            placeholder="Name..."
            color="primary"
            variant="underlined"
            clearable
            autofocus
            :rules="rules"
            required
          />
          <div class="d-flex justify-end">
            <v-btn color="primary" text="Add" @click="addList" />
          </div>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useListsStore } from '@/store'

const form = ref(null)
const router = useRouter()
const name = ref('')
const type = ref('groceries')

const rules = [value => value ? true : 'Field is required']

const listsStore = useListsStore()

const addList = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return;

  const id = await listsStore.addList({ name: name.value, type: type.value })
  router.push({ name: 'list', params: { id } })
}
</script>
