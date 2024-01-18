<template>
  <v-app>
      <v-main>
        <v-tabs
          v-model="tab"
          bg-color="primary"
        >
          <v-tab value="newList" to="/lists"><v-icon icon="mdi-plus-circle" class="mr-1" />New</v-tab>
          <v-tab
            v-for="id in listsIds"
            :key="id"
            :value="id"
            :to="`/lists/${id}`"
          >
            {{ getListById(id).name }}
          </v-tab>
        </v-tabs>
        <v-container v-if="listsStore.errorMessages.length">
          <v-alert
            v-for="(errorMessage, index) in listsStore.errorMessages"
            type="error"
            title="An error occurred"
            :key="`error-${index}`"
            :text="errorMessage"
            icon="mdi-alert-circle"
            closable
            :class="index === 0 ? '' : 'mt-2'"
            @click:close="listsStore.removeErrorMessage(index)"
          />
        </v-container>
        <RouterView :key="route.fullPath" />
        <v-snackbar v-model="showSnackbar">{{ listsStore.snackbarMessage }}</v-snackbar>
      </v-main>
  </v-app>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useListsStore } from '@/store'
import { storeToRefs } from 'pinia'

const tab = ref('')
const listsStore = useListsStore()
const { getListById, listsIds } = storeToRefs(listsStore)

const showSnackbar = computed(() => !!listsStore.snackbarMessage)

const route = useRoute()
const router = useRouter()
router.isReady().then(() => {
  listsStore.fetchLists(route.params.id);
});
</script>
