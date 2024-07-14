import { defineComponent, ref, inject, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeMount, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import DatasetService from '@/dataset/dataset.service';

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
    const textareaRef = ref(null);
    const annotationFreetext1 = ref(null);
    const annotationFreetext2 = ref(null);
    const annotationLabel1 = ref(null);
    const annotationLabel2 = ref(null);
    const showSuccessAlert = ref(false);
    const isLoaded = ref(false);

    const updateLabel = (index, value) => {
        if (index === 0) {
          annotationLabel1.value = value;
        } else {
          annotationLabel2.value = value;
        }
    }

    const updateFreetext = (index, value) => {
      if (index === 0) {
        annotationFreetext1.value = value;
      } else {
        annotationFreetext2.value = value;
      }
    }

    const getFreetext = (index) => {
      return index === 0 ? annotationFreetext1.value : annotationFreetext2.value;
    }

    const saveAnnotation = () => {
      console.log('save annotation');
      var content = {}
      for (const id in dataset.value.annotation_header) {
        const field = dataset.value.annotation_header[id];
        if (field.options !== 'freetext') {
          if (id === '0') {
            content[field.name] = annotationLabel1.value;
          }
          if (id === '1') {
            content[field.name] = annotationLabel2.value;
          }
        } else {
          if (id === '0') {
            content[field.name] = annotationFreetext1.value;
          }
          if (id === '1') {
            content[field.name] = annotationFreetext2.value;
          }
        }
      }
      datasetService.updateRow(props.id, currentRow.value, content);
      showSuccessAlert.value = true;
      setTimeout(dismissAlert, 3000);
      annotationFreetext1.value = null;
      annotationFreetext2.value = null;
      annotationLabel1.value = null;
      annotationLabel2.value = null;
      nextRow();
    };

    const dismissAlert = () => {
      showSuccessAlert.value = false;
    };

    const inspectMode = () => {
      router.push(`/dataset/${props.id}`);
    };

    const generateCSV = async () => {
      // load existing dataset, pagination if 1 element per page
      datasetService.getDataset(props.id, 1, currentRow.value)
      .then(data => {
        datasetService.getDatasetFields(props.id)
        .then(fields => {
          dataset.value.header = fields.data.filter(item => !item.annotate).map(item => item.name);
          dataset.value.annotation_header = fields.data
          .filter(item => item.annotate)
          .map(item => ({
            name: item.name,
            options: item.options ? item.options : "freetext"
          }));
          dataset.value.id = data.data.id;
          dataset.value.name = data.data.name;
          dataset.value.authors = data.data.authors;
          dataset.value.content = data.data.content;
          dataset.value.total_items = data.data.total_items;
          console.log(dataset.value.annotation_header);
          console.log(dataset.value.header);
          // If row has annotation value, add it
          for (const id in dataset.value.annotation_header) {
            const field = dataset.value.annotation_header[id];
            if (field.options !== 'freetext') {
              if (id === '0') {
                annotationLabel1.value = dataset.value.content[0][field.name];
              }
              if (id === '1') {
                annotationLabel2.value = dataset.value.content[0][field.name];
              }
            } else {
              if (id === '0') {
                annotationFreetext1.value = dataset.value.content[0][field.name];
              }
              if (id === '1') {
                annotationFreetext2.value = dataset.value.content[0][field.name];
              }
            }
          }
        });
      });
      console.log(annotationFreetext1.value);
      console.log(annotationFreetext2.value);
    };

    onBeforeMount(() => {
        generateCSV();
    });

    onMounted(() => {
      isLoaded.value = true;
    });

    watch(textareaRef, (newValue) => {
      if (textareaRef.value) {
        textareaRef.value[0].focus();
      }
    });

    // Iteration
    // TODO: currentRow --> persistir este valor y al cambiar al annotation mode cargarlo y seguir por ahí.
    const currentRow = ref(1);

    const prevRow = () => {
    if (currentRow.value > 1) {
      currentRow.value = currentRow.value - 1;
      datasetService.getDataset(props.id, 1, currentRow.value)
      .then(data => {
        datasetService.getDatasetFields(props.id)
        .then(fields => {
          dataset.value.header = fields.data.filter(item => !item.annotate).map(item => item.name);
          dataset.value.annotation_header = fields.data
          .filter(item => item.annotate)
          .map(item => ({
            name: item.name,
            options: item.options ? item.options : "freetext"
          }));
          dataset.value.id = data.data.id;
          dataset.value.name = data.data.name;
          dataset.value.authors = data.data.authors;
          dataset.value.content = data.data.content; 
          dataset.value.total_items = data.data.total_items;
          // If row has annotation value, add it
          for (const id in dataset.value.annotation_header) {
            const field = dataset.value.annotation_header[id];
            if (field.options !== 'freetext') {
              if (id === '0') {
                annotationLabel1.value = dataset.value.content[0][field.name];
              }
              if (id === '1') {
                annotationLabel2.value = dataset.value.content[0][field.name];
              }
            } else {
              if (id === '0') {
                annotationFreetext1.value = dataset.value.content[0][field.name];
              }
              if (id === '1') {
                annotationFreetext2.value = dataset.value.content[0][field.name];
              }
            }
          }
        });
      });
    }};

    const nextRow = () => {
    if (currentRow.value < dataset.value.total_items) {
      currentRow.value = currentRow.value + 1;
      datasetService.getDataset(props.id, 1, currentRow.value)
      .then(data => {
        datasetService.getDatasetFields(props.id)
        .then(fields => {
          dataset.value.header = fields.data.filter(item => !item.annotate).map(item => item.name);
          dataset.value.annotation_header = fields.data
          .filter(item => item.annotate)
          .map(item => ({
            name: item.name,
            options: item.options ? item.options : "freetext"
          }));
          dataset.value.id = data.data.id;
          dataset.value.name = data.data.name;
          dataset.value.authors = data.data.authors;
          dataset.value.content = data.data.content; 
          dataset.value.total_items = data.data.total_items;
          // If row has annotation value, add it
          for (const id in dataset.value.annotation_header) {
            const field = dataset.value.annotation_header[id];
            if (field.options !== 'freetext') {
              if (id === '0') {
                annotationLabel1.value = dataset.value.content[0][field.name];
              }
              if (id === '1') {
                annotationLabel2.value = dataset.value.content[0][field.name];
              }
            } else {
              if (id === '0') {
                annotationFreetext1.value = dataset.value.content[0][field.name];
              }
              if (id === '1') {
                annotationFreetext2.value = dataset.value.content[0][field.name];
              }
            }
          }
        });
      });
      if (textareaRef.value) {
        textareaRef.value[0].focus();
      }
    }};

    watch(currentRow, (newValue) => {
      console.log('current row changes');
    });

    const getLabelById = (content: { [x: string]: any; }, header: string | number) => {
      //let value = content[Object.keys(header)[0]];
      let value = content[header]
      return value ? value : '';
    };


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
      textareaRef,
      updateFreetext,
      getFreetext,
      annotationFreetext1,
      annotationFreetext2,
      updateLabel,
      annotationLabel1,
      annotationLabel2,
      saveAnnotation,
      inspectMode,
      showSuccessAlert,
      dismissAlert,
      currentRow,
      prevRow,
      nextRow,
      isLoaded,
      getLabelById,
      isArrayOfObjects,
      t$: useI18n().t,
    };
  },
});