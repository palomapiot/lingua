import { defineComponent, ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeMount, onMounted, nextTick } from 'vue';
import Dataset from '@/dataset/dataset.component';
import { useRouter } from 'vue-router';

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
    var dataset: Dataset = {
        id: '',
        name: '',
        authors: '',
        header: [],
        annotation_header: [],
        total_items: 0,
        content: []
    };
    const textareaRef = ref(null);
    const annotationFreetext = ref(null);
    const annotationLabel = ref(null);
    const showSuccessAlert = ref(false);


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

    const generateCSV = () => {
      // TODO: load existing dataset, pagination if 1 element per page
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
      dataset.header = [{'id': 'id'}, {'label': ['HATE', 'NO HATE']}, {'text': 'text'}];
      dataset.annotation_header = [{'explanation': 'freetext'}, {'is hate': ['HATE', 'NO HATE']}];
      dataset.total_items = numSamples;
      //dataset.header = ['id', 'label', 'text'];
    };

    onBeforeMount(() => {
        generateCSV();
    });

    watch(textareaRef, (newValue) => {
      textareaRef.value[0].focus();
    });
    // Iteration
    const currentRow = ref(1);
    const totalRows = computed(() => dataset.total_items);

    const prevRow = () => {
    if (currentRow.value > 1) {
      currentRow.value--;
    }};

    const nextRow = () => {
    if (currentRow.value < totalRows.value) {
      currentRow.value++;
      textareaRef.value[0].focus();
    }};


    const getLabelById = (content: { [x: string]: any; }, header: string | number) => {
      let value = content[Object.keys(header)[0]];
      return value ? value : 'Error';
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
      totalRows,
      prevRow,
      nextRow,
      getLabelById,
      t$: useI18n().t,
    };
  },
});