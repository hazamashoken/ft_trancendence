import ApiClient from '../api-client'
import { User } from './interfaces'

export class MeApi {
  constructor(accessToken?: string) {
    if (accessToken) {
      this.client.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    }
  }
  private path = 'me';
  private client = ApiClient;

  getAccount() {
    return this.client.get<User>('me/account').then(({data}) => data)
  }
}
