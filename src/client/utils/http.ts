import axios from 'axios';
import { HttpRequest, DefaultHttpRequestOptions, HttpResponse } from '../types';

const defaultRequestOptions: DefaultHttpRequestOptions = {
  headers: {
    Accept: 'application/json',
  },
  method: 'GET',
  responseType: 'json',
};

export const http = <T>(request: HttpRequest): Promise<HttpResponse<T>> => {
  const {
    url,
    responseType = defaultRequestOptions.responseType,
    method = defaultRequestOptions.method,
    headers = defaultRequestOptions.headers,
  } = request;
  return new Promise((resolve, reject): void => {
    axios({
      ...request,
      url,
      responseType,
      headers: { ...defaultRequestOptions.headers, ...headers },
      method,
      timeout: 15000,
    })
      .then((res): void => {
        resolve({
          result: 'success',
          response: res.data,
        });
      })
      .catch((err): void => {
        const status = err.response ? err.response.status : err.status;
        const message = err.response ? err.response.statusText : err.message;

        // eslint-disable-next-line prefer-promise-reject-errors
        reject({
          result: 'failure',
          response: {
            errorCode: status,
            description: message,
          },
        });
      });
  });
};
