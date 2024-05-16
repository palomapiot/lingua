import { defineComponent, ref, inject, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n';
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import DatasetService from '@/dataset/dataset.service';

type Dataset = {
    id: string;
    name: string;
    authors: string;
    header: {}[];
    annotation_header: {}[];
    total_items: number;
    content: {}[];
};
// Header types: id, label, text, metadata -> type: "original" (original header)
// Header annotation types: freetext, label (list with values)
type AnnotationField = {
  field: string;
  type: any;
}


export default defineComponent({
  compatConfig: { MODE: 3 },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    const datasetService = inject<DatasetService<string>>('datasetService');

    // Dataset info
    var dataset: Dataset = {
        id: '',
        name: '',
        authors: '',
        header: [],
        annotation_header: [],
        total_items: 0,
        content: []
    };
    
    // Dataset rows selection
    const selectedRows = ref([]);
    const isCheckboxSelected = ref(false);

    // Pagination logic
    const itemsPerPage = 10;
    const currentPage = ref(1);

    // Annotations
    var annotations: AnnotationField[] = [];
    const fieldName1 = ref("");
    const isFreetext1 = ref(false);
    const isLabel1 = ref(false);
    const labelsList1 = ref([]);
    const fieldName2 = ref("");
    const isFreetext2 = ref(false);
    const isLabel2 = ref(false);
    const labelsList2 = ref([]);
    const isModalOpen = ref(false);
    const showDangerAlert = ref(false);

    const generateCSV = () => {
        console.log('ID:', props.id);
        const labels: string[] = ['NO HATE', 'HATE'];
        const texts: string[] = ['Lorem ipsum dolor sit amet', 'Consectetur adipiscing elit', 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua', /* Add more random texts as needed */];
        const numSamples: number = 26000;
  
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
        dataset.total_items = numSamples;
    };

    const getExistingAnnotations = () => {
      console.log('get existing annotations for dataset id:', props.id);
      //annotations = [{field: "explanation", type: "freetext"}, {field: "is hate", type: ["HATE", "NO HATE"]}];
      console.log(annotations);
    };

    onBeforeMount(() => {
        generateCSV();
        //dataset = datasetService.getDataset(props.id, itemsPerPage, currentPage);
        getExistingAnnotations();
    });

    const openModal = () => {
      if (annotations.length === 0) {
        isModalOpen.value = true;
      } else {
        router.push(`/dataset/annotation/${props.id}`);
      }
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    // Create new annotation
    const newAnnotation = () => {
      // TODO: implement
      console.log(fieldName1.value);
      console.log(isFreetext1.value === true);
      console.log(labelsList1.value);
      console.log(fieldName2.value);
      console.log(isFreetext2.value === true);
      console.log(labelsList2.value);
      isModalOpen.value = false;
      router.push(`/dataset/annotation/${props.id}`);
    };

    const dismissAlert = () => {
      showDangerAlert.value = false;
    };

    // Export dataset (of selected rows)
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
      } else {
        showDangerAlert.value = true;
        setTimeout(dismissAlert, 5000);
      }
    };

    // Pagination
    const paginatedData = computed(() => {
        // TODO: when implemented, paginatedData will be directly dataset.content
        const startIndex = (currentPage.value - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return dataset.content.slice(startIndex, endIndex);
    });

    const pagesToDisplay = computed(() => {
      const pages = [];
    
      if (totalPages.value <= 10) {
        for (let i = 1; i <= totalPages.value; i++) {
          pages.push(i);
        }
      } else {
        // First 3 pages
        pages.push(1, 2, 3);
    
        // Previous and next of the current page
        if (currentPage.value > 4) {
          pages.push('...');
        }

        // Push the previous page if not already included
        if (!pages.includes(currentPage.value - 1) && currentPage.value < totalPages.value - 2 && currentPage.value > 3) {
          pages.push(currentPage.value - 1);
        }

        if (currentPage.value > 3 && currentPage.value < totalPages.value - 2) {
          pages.push(currentPage.value);
        }
    
        // Push the next page if not already included
        if (!pages.includes(currentPage.value + 1) && currentPage.value < totalPages.value - 2 && currentPage.value < totalPages.value - 3) {
          pages.push(currentPage.value + 1);
        }

        // Last 3 pages
        if (currentPage.value < totalPages.value - 3) {
          pages.push('...');
        }
        pages.push(totalPages.value - 2, totalPages.value - 1, totalPages.value);

      }
    
      return pages;
    });    

    const totalPages = computed(() => Math.ceil(dataset.total_items / itemsPerPage));

    const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }};

    const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }};

    const gotoPage = (pageNumber: any) => {
      if (pageNumber != '...') {
        currentPage.value = pageNumber;
      }
    };

    watch(currentPage, (newValue, oldValue) => {
      // TODO: When currentPage changes --> fetch new dataset content
      //dataset = datasetService.getDataset(props.id, itemsPerPage, currentPage.value);
    });

    return {
      dataset,
      selectedRows,
      exportDataset,
      selectAllRows,
      isCheckboxSelected,
      paginatedData,
      pagesToDisplay,
      totalPages,
      prevPage,
      nextPage,
      gotoPage,
      currentPage,
      isModalOpen,
      openModal,
      closeModal,
      newAnnotation,
      annotations,
      fieldName1,
      isFreetext1,
      isLabel1,
      labelsList1,
      fieldName2,
      isFreetext2,
      isLabel2,
      labelsList2,
      showDangerAlert,
      dismissAlert,
      t$: useI18n().t,
    };
  },
});