import axios, { AxiosRequestConfig } from 'axios'
import { API_URL } from './constants'

const config: AxiosRequestConfig = {
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
}

const api = axios.create(config)

export default api