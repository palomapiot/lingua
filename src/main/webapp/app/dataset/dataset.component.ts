import { defineComponent, ref, inject, computed } from 'vue';
import type DatasetService from '@/dataset/dataset.service';
import { useI18n } from 'vue-i18n';
import { onBeforeMount } from 'vue';

type Dataset = {
    id: string;
    name: string;
    authors: string;
    header: {}[];
    annotation_header: {}[];
    content: {}[];
};
// Header types: id, label, text, metadata
// Header annotation types: freetext, options (list with values)

export default defineComponent({
  compatConfig: { MODE: 3 },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const datasetService = inject<DatasetService>('datasetService');

    var dataset: Dataset = {
        id: '',
        name: '',
        authors: '',
        header: [],
        annotation_header: [],
        content: []
    };

    const annotations = [];

    const selectedRows = ref([]);
    const isCheckboxSelected = ref(false);
    const isModalOpen = ref(false);

    const generateCSV = () => {
        console.log('ID:', props.id);
        const labels: string[] = ['NO HATE', 'HATE'];
        const texts: string[] = ['Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua', /* Add more random texts as needed */];
        const numSamples: number = 26;
  
        const pairs = [];

        for (let i: number = 0; i < numSamples; i++) {
            const randomLabel = labels[Math.floor(Math.random() * labels.length)];
            const randomText = texts[Math.floor(Math.random() * texts.length)];
            pairs.push({ id: i, label: randomLabel, text: randomText });
        }
  
        dataset.id = '3';
        dataset.name = 'MetaHate 2024'
        dataset.authors = 'Piot et al. 2024'
        dataset.content = pairs;
        dataset.header = ['id', 'label', 'text'];
    };

    onBeforeMount(() => {
        generateCSV();
    });

    const openModal = () => {
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const exportDataset = () => {
      console.log("Selected Rows:", selectedRows.value);

      const result = Object.entries(selectedRows.value)
        .filter(([key, value]) => value === true)
        .map(([key, _]) => Number(key));

      if (result.length > 0) {
        const selectedDataset = dataset.content.filter(item => result.includes(item.id));
        console.log(selectedDataset);

        // Build and download dataset
        const tsvHeader = dataset.header.slice(1).join("\t") + "\n";
        const tsvRows = selectedDataset.map(item => `${item.id}\t${item.label}\t${item.text}`).join("\n");
        const tsvContent = tsvHeader + tsvRows;
        const blob = new Blob([tsvContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "data.tsv";
        a.click();
      }
    };

    const selectAllRows = (e) => {
        //  TODO: if there is a query, select all will only select the rows that fulfill the query requirements
        const isChecked = e.target.checked;
        if (isChecked) {
          dataset.content.forEach(function (row) {
            selectedRows.value[row.id] = true;
          });
        } else {
          dataset.content.forEach(function (row) {
            selectedRows.value[row.id] = false;
          });
        }
    };

    // Pagination logic
    const itemsPerPage = 5;
    const currentPage = ref(1);

    const paginatedData = computed(() => {
        const startIndex = (currentPage.value - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return dataset.content.slice(startIndex, endIndex);
    });

    const totalPages = computed(() => Math.ceil(dataset.content.length / itemsPerPage));

    const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }};

    const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }};

    const gotoPage = (pageNumber: any) => {
        currentPage.value = pageNumber;
    };

    return {
      dataset,
      selectedRows,
      exportDataset,
      selectAllRows,
      isCheckboxSelected,
      paginatedData,
      totalPages,
      prevPage,
      nextPage,
      gotoPage,
      currentPage,
      isModalOpen,
      openModal,
      closeModal,
      annotations,
      t$: useI18n().t,
    };
  },
});