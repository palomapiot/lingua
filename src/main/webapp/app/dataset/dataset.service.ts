import axios from 'axios';

export default class DatasetService {

  public getDataset(id: any, itemsPerPage: number, currentPage: number): Promise<any> {
    const qparams = {
      params: {items: itemsPerPage, page: currentPage}
    }
    return axios.get(`api/datasets/${id}`, qparams).catch(error => {
      console.error('There was an error fetching the dataset:', error);
      throw error;
    });
  }

  public async getDatasetsOverview(): Promise<[]> {
    return (await axios.get('api/datasets')).data;
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

}

  