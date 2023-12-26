import ApiClient from '../api-client'
import { User } from './interfaces'

export class MeApi {
  constructor(config?: {accessToken?: string, isClient: boolean}) {
    if (config && !config.isClient) {
      this.client = ApiClient('NODE');
    } else {
      this.client  = ApiClient();
    }
    if (config && config.accessToken) {
      this.client.defaults.headers.common.Authorization = `Bearer ${config.accessToken}`
    }
  }
  private client;
  private path = 'me'

  getAccount() {
    return this.client.get<User>(`${this.path}/account`).then(({data}) => data)
  }

  createAccount() {
    return this.client.post(`${this.path}/account`, {}).then(({data}) => data)
  }
}
