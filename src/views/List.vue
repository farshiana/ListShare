<template>
  <v-container class="d-flex justify-center">
  <v-card
    width="100%"
    max-width="600px"
    :loading="listsStore.loadingLists[id]"
    :title="list && list.name"
  >
    <template #append>
      <v-btn color="primary" variant="text" icon="mdi-share-variant" @click="shareList"/>
    </template>
    <v-card-text>
      <v-container v-if="list && list.items" class="px-0">
          <v-row
            v-for="(item, index) in list.items"
            :key="`row-${index}`"
            class="align-center"
          >
            <div>
              <v-checkbox-btn color="primary" v-model="item.archived" @change="updateList" />
            </div>
            <v-col v-if="isGroceriesList" cols="3">
              <v-text-field
                v-model="item.quantity"
                label="Quantity"
                persistent-placeholder
                placeholder="10g"
                color="primary"
                variant="underlined"
                hide-details="auto"
                :disabled="item.archived"
                @change="updateList"
              >
            </v-text-field>
            </v-col>
            <v-col>
            <v-text-field
              v-model="item.name"
              :label="isGroceriesList ? 'Item' : 'Todo'"
              persistent-placeholder
              :placeholder="isGroceriesList ? 'cheese' : 'buy train tickets'"
              color="primary"
              variant="underlined"
              hide-details="auto"
              :disabled="item.archived"
              @change="updateList"
            />
          </v-col>
          <v-col cols="1">
            <v-btn variant="text" color="grey" size="small" icon="mdi-minus-circle" @click="removeItem(index)" />
        </v-col>
        </v-row>
      </v-container>
      <v-form ref="form" @submit.prevent="addItem" :disabled="listsStore.loadingLists[id]">
        <v-container class="px-0">
          <v-row class="align-center">
            <div :style="{ width: '40px' }"></div>
            <v-col v-if="isGroceriesList" cols="3">
              <v-text-field
                v-model="item.quantity"
                label="I need..."
                persistent-placeholder
                placeholder="10g"
                color="primary"
                variant="underlined"
                clearable
                autofocus
              />
            </v-col>
          <v-col>
          <v-text-field
            v-model="item.name"
            :label="isGroceriesList ? 'of...' : 'I need to...'"
            persistent-placeholder
            :placeholder="isGroceriesList ? 'cheese' : 'buy train tickets'"
            color="primary"
            variant="underlined"
            clearable
            :rules="rules"
            required
          />
          </v-col>
          <v-col cols="1">
            <v-btn type="submit" variant="text" color="primary" size="small" icon="mdi-plus-circle" />
        </v-col>
        </v-row>
      </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn icon="mdi-delete" color="grey" @click="showDialog = true" />
    </v-card-actions>
    <v-dialog
        v-model="showDialog"
        width="auto"
      >
        <v-card>
          <v-card-title>
            Delete {{list && list.name}}?
          </v-card-title>
          <v-card-text>This action is not reversible.</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="grey" @click="showDialog = false">Cancel</v-btn>
            <v-btn color="error" @click="removeList">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-card>
</v-container>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useListsStore } from '@/store'
import { storeToRefs } from 'pinia'

const rules = [value => value ? true : 'Field is required']
const initialState = { name: '', quantity: '', archived: false };
const item = reactive({ ...initialState })
const form = ref(null)
const showDialog = ref(false)

const route = useRoute()
const router = useRouter()
const { id } = route.params;

const listsStore = useListsStore()
const { getListById } = storeToRefs(listsStore)
const list = computed(() => getListById.value(id))
const isGroceriesList = computed(() => list.value && list.value.type === 'groceries')

const shareList = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    listsStore.updateSnackbarMessage('Link copied!');
  } catch(error) {
    listsStore.updateSnackbarMessage('Cannot copy');
  }
}

const removeList = () => {
  listsStore.removeList(id);
  router.push({ name: 'lists' })
}

const updateList = () => listsStore.updateList(id, list.value);

const removeItem = (index) => {
  list.value.items.splice(index, 1);
  updateList();
}

const addItem = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return;

  list.value.items.push({ ...item });
  await updateList();
  form.value.reset();
}

watch(listsStore.loadingLists, () => {
  if (!list.value && !listsStore.loadingLists[id]) {
    router.push({ name: 'lists' })
  }
});
</script>
