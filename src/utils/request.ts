import axios from 'axios';
import { requestError } from '@/errors';

async function get(url: string, config?:any) {
  try {
    const result = await axios.get(url, config);
    return result;
  } catch (error) {
    const { status, statusText } = error.response;

    return requestError(status, statusText);
  }
}

async function post(url: string, body?: any, config?:any) {
  try {
    const result = await axios.post(url, body, config);
    return result;
  } catch (error) {
    const { status, statusText } = error.response;

    return requestError(status, statusText);
  }
}

export const request = {
  get,
  post,
};
