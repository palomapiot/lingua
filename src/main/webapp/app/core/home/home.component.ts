import { type ComputedRef, defineComponent, inject, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type LoginService from '@/account/login.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  setup() {
    const loginService = inject<LoginService>('loginService');

    const authenticated = inject<ComputedRef<boolean>>('authenticated');
    const username = inject<ComputedRef<string>>('currentUsername');

    const datasets = [
      { id: 1, name: 'Offensive 2017', authors: '' },
      { id: 2, name: 'HASOC 2019', authors: '' },
      { id: 3, name: 'MetaHate 2024', authors: '' },
      { id: 4, name: 'HATEVAL 2022', authors: '' },
      { id: 5, name: 'Davidson 2017', authors: '' },
      { id: 6, name: 'Call me sexist but', authors: '' },
    ]
    const isModalOpen = ref(false);
    const datasetNameEmpty = ref(false);
    const datasetAuthorsEmpty = ref(false);
    const datasetEmpty = ref(false);
    let selectedDataset = "";

    const openModal = () => {
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const openLogin = () => {
      loginService.openLogin();
    };

    const sendFile = (e) => {
      console.log(e.target.files);
      selectedDataset = e.target.files;
    };

    const uploadDataset = () => {
      datasetNameEmpty.value = false;
      datasetAuthorsEmpty.value = false;
      datasetEmpty.value = false;

      var datasetName = document.getElementById('datasetName').value;
      if (datasetName == "") {
        datasetNameEmpty.value = true;
      }
      var datasetAuthors = document.getElementById('datasetAuthors').value;
      if (datasetAuthors == "") {
        datasetAuthorsEmpty.value = true;
      }
      if (selectedDataset == "") {
        datasetEmpty.value = true;
      }
  
      console.log("Dataset Name:", datasetName);
      console.log("Dataset Authors:", datasetAuthors);
      console.log(selectedDataset);
        
      if (datasetName != "" && datasetAuthors != "" && selectedDataset != "") {
        console.log('form ok, closing modal')
        document.getElementById('datasetName').value = '';
        document.getElementById('datasetAuthors').value = '';
        document.getElementById('datasetInput').value = '';
        selectedDataset = "";
        isModalOpen.value = false;
      }

    };

    return {
      authenticated,
      username,
      datasets,
      datasetNameEmpty: computed(() => datasetNameEmpty.value),
      datasetAuthorsEmpty: computed(() => datasetAuthorsEmpty.value),
      datasetEmpty: computed(() => datasetEmpty.value),
      isModalOpen: computed(() => isModalOpen.value),
      openModal,
      closeModal,
      openLogin,
      sendFile,
      uploadDataset,
      t$: useI18n().t,
    };
  },
});
