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
  name: string;
  options: any;
  annotate: boolean;
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
    const dataset = ref({});

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


    const getExistingAnnotations = () => {
      datasetService.getDatasetFields(props.id)
      .then(data => {
        annotations.values = data.data;
      });
    };

    function sortContent(content: [], names: []) {
      return content.map(obj => {
        const sortedObj = {};
        names.forEach(key => {
          if (obj.hasOwnProperty(key)) {
            sortedObj[key] = obj[key];
          }
        });
        return sortedObj;
      });
    }

    onBeforeMount(async () => {
        datasetService.getDataset(props.id, itemsPerPage, currentPage.value)
        .then(data => {
          datasetService.getDatasetFields(props.id)
          .then(fields => {
            dataset.value.header = fields.data
            .filter(item => item.name) 
            .map(item => item.name)
            dataset.value.id = data.data.id;
            dataset.value.name = data.data.name;
            dataset.value.authors = data.data.authors;
            dataset.value.content = sortContent(data.data.content, dataset.value.header);
            dataset.value.total_items = data.data.total_items;
          });
        });
        getExistingAnnotations();
    });

    const openModal = () => {
      const annotationFields = annotations.values.filter(item => item.annotate === true);
      if (annotationFields.length === 0) {
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
      if (typeof labelsList1.value === 'string') {
        labelsList1.value = labelsList1.value.split(',').map(item => item.trim())
      }
      if (typeof labelsList2.value === 'string') {
        labelsList2.value = labelsList2.value.split(',').map(item => item.trim())
      }
      if (fieldName1.value && fieldName2.value) {
        console.log('create two fields');
        datasetService.createAnnotation(props.id, {'name': fieldName1.value, 'options': labelsList1.value}, {'name': fieldName2.value, 'options': labelsList2.value})
        .then(() => {
          isModalOpen.value = false;
          router.push(`/dataset/annotation/${props.id}`);
        });
      } else if (fieldName1.value) {
        console.log('create one field');
        datasetService.createAnnotation(props.id, {'name': fieldName1.value, 'options': labelsList1.value}, {})
        .then(() => {
          isModalOpen.value = false;
          router.push(`/dataset/annotation/${props.id}`);
        });
      } else {
        console.log('Error. First field empty.')
      }
    };

    const dismissAlert = () => {
      showDangerAlert.value = false;
    };

    // Export dataset (of selected rows)
    const selectAllRows = (e) => {
      //  TODO: if there is a query, select all will only select the rows that fulfill the query requirements
      const isChecked = e.target.checked;
      if (isChecked) {
        dataset.value.content.forEach(function (row) {
          selectedRows.value[row.line_number] = true;
        });
      } else {
        dataset.value.content.forEach(function (row) {
          selectedRows.value[row.line_number] = false;
        });
      }
    };

    const exportDataset = () => {
      const result = Object.entries(selectedRows.value)
        .filter(([key, value]) => value === true)
        .map(([key, _]) => Number(key));

      if (result.length > 0) {
        datasetService.getDataset(props.id, dataset.value.total_items, 1)
        .then(data => {
          const full_content = data.data.content;
          const selectedDataset = full_content.filter(item => result.map(String).includes(item.line_number));
          // Build and download dataset
          const tsvHeader = dataset.value.header.join("\t") + "\n";
          //const tsvRows = selectedDataset.map(item => `${item.label}\t${item.line_number}\t${item.text}`).join("\n");
          const tsvRows = selectedDataset.map(item => dataset.value.header.map(property => item[property]).join('\t')).join('\n');
          const tsvContent = tsvHeader + tsvRows;
          const blob = new Blob([tsvContent], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "data.tsv";
          a.click();
        });
      } else {
        showDangerAlert.value = true;
        setTimeout(dismissAlert, 5000);
      }
    };

    // Pagination

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

        // Show the previous if we are in the element N-2
        if (currentPage.value == totalPages.value - 2) {
          pages.push(currentPage.value - 1);
        }

        // Last 3 pages
        if (currentPage.value < totalPages.value - 3) {
          pages.push('...');
        }
        pages.push(totalPages.value - 2, totalPages.value - 1, totalPages.value);

      }
    
      return pages;
    });    

    const totalPages = computed(() => Math.ceil(dataset.value.total_items / itemsPerPage));

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
      datasetService.getDataset(props.id, itemsPerPage, currentPage.value)
      .then(data => {
        datasetService.getDatasetFields(props.id)
        .then(fields => {
          dataset.value.header = fields.data
          .filter(item => item.name) 
          .map(item => item.name);
          dataset.value.id = data.data.id;
          dataset.value.name = data.data.name;
          dataset.value.authors = data.data.authors;
          dataset.value.content = sortContent(data.data.content, dataset.value.header);
          dataset.value.total_items = data.data.total_items;
        });
      });
    });

    const isObjectWithProperties = (item: any, properties: string[]): boolean => {
      if (typeof item === 'object' && item !== null) {
        return properties.every(prop => prop in item);
      }
      return false;
    };

    const isArrayOfObjects = (data: any): [boolean, any] => {
      try {
        data = data.replace(/'([a-zA-Z0-9_]+)':/g, '"$1":');
        data = data.replace(/: '([^']*)'/g, (match, p1) => {
          const escapedValue = p1.replace(/"/g, '\\"');
          return `: "${escapedValue}"`;
        });
        data = JSON.parse(data);
        if (Array.isArray(data)) {
          if (data.every(item => isObjectWithProperties(item, ['input', 'explanation']))) {
            return [true, data];
          } else {
            return [false, data];
          }
        } else {
          return [false, data];
        }
      } catch (e) {
        return [false, data];
      }
    };

    return {
      dataset,
      selectedRows,
      exportDataset,
      selectAllRows,
      isCheckboxSelected,
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
      isArrayOfObjects,
      t$: useI18n().t,
    };
  },
});