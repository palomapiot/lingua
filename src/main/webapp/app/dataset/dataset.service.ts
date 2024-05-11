import axios from 'axios';

export default class DatasetService {
  public loadDataset(id: any): Promise<any> {
    return axios.post('api/dataset', id);
  }
}

  