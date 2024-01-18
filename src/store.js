import { defineStore } from 'pinia'
import { ref, onValue, set, push, child } from "firebase/database";
import { db } from './firebase'

export const useListsStore = defineStore('lists', {
  state: () => ({
    lists: {},
    loadingLists: {},
    errorMessages: [],
    snackbarMessage: '',
  }),
  actions: {
    getStoredIds() {
      try {
        const storedIds = localStorage.getItem('ids');
        return storedIds ? JSON.parse(storedIds) : [];
      } catch (error) {
        console.error(error)
        this.errorMessages.push('Error getting owned lists')
      }
    },
    updateStoredIds() {
      try {
        localStorage.setItem('ids', JSON.stringify(this.listsIds));
      } catch (error) {
        console.error(error)
        this.errorMessages.push('Error updating owned lists')
      }
    },
    async fetchLists(currentId) {
      const ids = this.getStoredIds();
      if (currentId && !ids.includes(currentId)) {
        // Add new id from URL
        ids.push(currentId);
      }

      ids.forEach((id) => {
        this.lists[id] = { name: '', items: [] }
        this.fetchList(id);
      });
    },
    async fetchList(id) {
      this.loadingLists[id] = true;
      const listRef = ref(db, `lists/${id}`);
      onValue(listRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          if (!data.items) {
            // Because Firebase removes a property when it's empty
            data.items = [];
          }
          this.lists[id] = data;
        } else if (this.lists[id]) {
          delete this.lists[id];
          this.errorMessages.push(`Could not find list #${id}`)
        }
        this.updateStoredIds();
        this.loadingLists[id] = false;
      }, error => {
        console.error(error)
        this.errorMessages.push(`Error fetching list #${id}`)
        this.loadingLists[id] = false;
      });
    },
    updateSnackbarMessage(snackbarMessage) {
      this.snackbarMessage = snackbarMessage;
    },
    async addList(list) {
      const listId = push(child(ref(db), 'lists')).key;
      await this.updateList(listId, { ...list, items: [] });
      return listId
    },
    updateList(listId, list) {
      set(ref(db, `lists/${listId}`), list)
      .then(() => {
          this.lists[listId] = list;
          this.updateStoredIds();
      })
      .catch((error) => {
        console.error(error)
        this.errorMessages.push(`Error updating list #${listId}`)
      });
    },
    removeList(listId) {
      delete this.lists[listId];
      set(ref(db, `lists/${listId}`), null)
      .then(() => {
        this.updateStoredIds();
      })
      .catch((error) => {
        console.error(error)
        this.errorMessages.push(`Error deleting list #${listId}`)
      });
    },
    addErrorMessage(errorMessage) {
      this.errorMessages.push(errorMessage);
    },
    removeErrorMessage(index) {
      this.errorMessages.splice(index, 1);
    }
  },
  getters: {
    listsIds: state => Object.keys(state.lists),
    getListById: state => id => state.lists[id],
  },
})
