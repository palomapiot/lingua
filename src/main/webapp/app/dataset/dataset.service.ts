import axios from 'axios';

export default class DatasetService {

  public async getDataset(id: any, itemsPerPage: number, currentPage: number): Promise<any> {
    const qparams = {
      params: {items: itemsPerPage, page: currentPage}
    }
    return axios.get(`api/datasets/${id}/records`, qparams)
    .then(response => response.data)
    .catch(error => {
      console.error('There was an error fetching the dataset:', error);
      throw error;
    });
  }

  public async getDatasetFields(id: any): Promise<any> {
    return axios.get(`api/datasets/${id}/fields`)
    .then(response => response.data)
    .catch(error => {
      console.error('There was an error fetching the dataset fields:', error);
      throw error;
    });
  }

  public async createHuggingFaceDataset(datasetName: string, apiKey: string): Promise<any> {
    const qparams = {
      params: {name: datasetName}
    }
    await axios.get<any>(`api/hf`, qparams)
      .then((response) => {
        console.log('Request URL:', response.config.url);
        return response.data;
    }).catch((err) => {
      console.log('This isnt right');
    });

  }

  public async getDatasetsOverview(): Promise<any> {
    return axios.get('api/datasets')
      .then(response => response.data)
      .catch((err) => {
        console.log('Error getting datasets overview.');
      });
  }

  public async createDataset(name: string, authors: string, file: any): Promise<any> {
    let formData = new FormData();
    formData.append('file', file);
    console.log(file);
    const qparams = {
      params: {name: name, authors: authors}
    }
    return await axios.post('api/datasets', formData, qparams);
  }

  public async createAnnotation(id: any, field1: {}, field2: {}): Promise<any> {
    console.log(field1);
    console.log(field2);
    return await axios.post(`api/datasets/${id}/fields`, [field1, field2]);
  }

}

  