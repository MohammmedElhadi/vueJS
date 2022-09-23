import axios from 'axios'

let baseURL
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  baseURL = 'http://auto_parts.local:8080/'
} else {
  baseURL = 'http://safyauto.com'
}

export const HTTP = axios.create(
  {
    baseURL: baseURL,
      withCredentials: true,
    headers: {
      "Content-type": "application/json"
    }
  })
