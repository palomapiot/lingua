const Dataset = () => import('@/dataset/dataset.vue');

export default [
  {
    path: '/dataset/:id', 
    name: 'DatasetDetail',
    component: Dataset,
    props: true 
  },
];
