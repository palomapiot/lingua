import { defineComponent, inject, ref, computed, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import DatasetService from '@/dataset/dataset.service';

export default defineComponent({
  compatConfig: { MODE: 3 },
  setup() {
    const router = useRouter();
    const datasetService = inject<DatasetService<string>>('datasetService');

    // Overview
    const datasets = ref([]);

    // Modal
    const isModalOpen = ref(false);

    // Modal data
    const datasetHuggingFaceEmpty = ref(false);
    const datasetNameEmpty = ref(false);
    const datasetAuthorsEmpty = ref(false);
    const datasetEmpty = ref(false);
    let selectedDataset = "";

    onBeforeMount(async () => {
      datasetService.getDatasetsOverview()
        .then(data => {
          datasets.value = data.data;
        });
      /*datasets.value = [
        { id: 1, name: 'Offensive 2017', authors: '' },
        { id: 2, name: 'HASOC 2019', authors: '' },
        { id: 3, name: 'MetaHate 2024', authors: '' },
        { id: 4, name: 'HATEVAL 2022', authors: '' },
        { id: 5, name: 'Davidson 2017', authors: '' },
        { id: 6, name: 'Call me sexist but', authors: '' },
      ];*/
    });

    // Dataset detail
    const openDataset = (id) => {
      router.push(`/dataset/${id}`);
    };
    
    // Modal
    const openModal = () => {
      isModalOpen.value = true;
    };

    const closeModal = () => {
      console.log('form ok, closing modal');
      datasetNameEmpty.value = false;
      datasetAuthorsEmpty.value = false;
      datasetEmpty.value = false;
      document.getElementById('datasetName').value = '';
      document.getElementById('datasetAuthors').value = '';
      document.getElementById('datasetInput').value = '';
      selectedDataset = "";
      isModalOpen.value = false;
    };

    const pickFile = (e) => {
      console.log(e.target.files);
      selectedDataset = e.target.files;
    };

    const uploadDataset = async () => {
      datasetHuggingFaceEmpty.value = false;
      datasetNameEmpty.value = false;
      datasetAuthorsEmpty.value = false;
      datasetEmpty.value = false;

      var datasetHuggingFace = document.getElementById('datasetHuggingFace').value;
      if (datasetHuggingFace == "") {
        datasetHuggingFaceEmpty.value = true;
      }

      if (datasetHuggingFace != "") {
        // TODO: GET HUGGING FACE DATASET -- not implemented
        let huggingFaceDataset = await datasetService.createHuggingFaceDataset(datasetHuggingFace, "");
        console.log(huggingFaceDataset);
        //datasets.value = datasetService.getDatasetsOverview();
        closeModal();
      } else {
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
          
        if (datasetHuggingFace != "" || (datasetName != "" && datasetAuthors != "" && selectedDataset != "")) {
          await datasetService.createDataset(datasetName, datasetAuthors, selectedDataset[0]);
          datasets.value = datasetService.getDatasetsOverview();
          closeModal();
        }
      }
    };

    return {
      datasets,
      openDataset,
      datasetHuggingFaceEmpty: computed(() => datasetHuggingFaceEmpty.value),
      datasetNameEmpty: computed(() => datasetNameEmpty.value),
      datasetAuthorsEmpty: computed(() => datasetAuthorsEmpty.value),
      datasetEmpty: computed(() => datasetEmpty.value),
      isModalOpen: computed(() => isModalOpen.value),
      openModal,
      closeModal,
      pickFile,
      uploadDataset,
      t$: useI18n().t,
    };
  },
});
