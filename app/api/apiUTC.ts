import axios, { AxiosInstance } from 'axios';
import { parseStringPromise } from 'xml2js';

interface UsuarioModel {
  identificacion: string;
  tipo: string;
}

export class ApiService {
  private _httpClient: AxiosInstance;

  constructor() {
    this._httpClient = axios.create();
  }

  async getUsuarioAsync(url: string, model: UsuarioModel): Promise<any> {
    const params = new URLSearchParams();
    params.append('identificacion', model.identificacion);
    params.append('tipo', model.tipo);

    try {
      const response = await this._httpClient.post(url, params);
      const xmlResponse = response.data;
      const parsedXml = await parseStringPromise(xmlResponse);
      const result = parsedXml['string']._;
      return JSON.parse(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}