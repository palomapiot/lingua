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
    const annotationFreetext = ref(null);
    const annotationLabel = ref(null);
    const showSuccessAlert = ref(false);
    const isLoaded = ref(false);


    watch(annotationFreetext, (newValue, oldValue) => {
    });

    watch(annotationLabel, (newValue, oldValue) => {
    });


    const saveAnnotation = () => {
      // TODO: implement
      console.log('save annotation');
      console.log(annotationFreetext.value);
      console.log(annotationLabel.value);
      showSuccessAlert.value = true;
      setTimeout(dismissAlert, 3000);
      annotationFreetext.value = null;
      annotationLabel.value = null;
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
          dataset.value.content = data.data.content; //sortContent(data.data.content, dataset.value.header);
          dataset.value.total_items = data.data.total_items;
        });
      });
    };

    onBeforeMount(() => {
        generateCSV();
    });

    onMounted(() => {
      isLoaded.value = true;
    });

    watch(textareaRef, (newValue) => {
      textareaRef.value[0].focus();
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
          dataset.value.content = data.data.content; //sortContent(data.data.content, dataset.value.header);
          dataset.value.total_items = data.data.total_items;
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
          dataset.value.content = data.data.content; //sortContent(data.data.content, dataset.value.header);
          dataset.value.total_items = data.data.total_items;
        });
      });
      textareaRef.value[0].focus();
    }};

    watch(currentRow, (newValue) => {
      console.log('current row changes');
    });

    const getLabelById = (content: { [x: string]: any; }, header: string | number) => {
      //let value = content[Object.keys(header)[0]];
      let value = content[header]
      return value ? value : '';
    };

    return {
      dataset,
      textareaRef,
      annotationFreetext,
      annotationLabel,
      saveAnnotation,
      inspectMode,
      showSuccessAlert,
      dismissAlert,
      currentRow,
      prevRow,
      nextRow,
      isLoaded,
      getLabelById,
      t$: useI18n().t,
    };
  },
});