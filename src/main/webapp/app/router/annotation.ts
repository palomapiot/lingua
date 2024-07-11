const DatasetAnnotation = () => import('@/annotation/annotation.vue');

export default [
  {
    path: '/dataset/annotation/:id', 
    name: 'DatasetAnnotation',
    component: DatasetAnnotation,
    props: true 
  },
];
