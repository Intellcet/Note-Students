export type HttpMethod = 'GET' | 'POST' | 'HEAD';

type ResponseType =
  | 'json'
  | 'arraybuffer'
  | 'text'
  | 'stream'
  | 'blob'
  | 'document';

export type HttpRequest = {
  method?: HttpMethod;
  url: string;
  headers?: { [header: string]: string };
  responseType?: ResponseType;
  data?: any;
  withCredentials?: boolean;
};

export type DefaultHttpRequestOptions = Omit<HttpRequest, 'url'>;

export type HttpResult = 'success' | 'failure';

export type HttpError = {
  errorCode: number;
  description: string;
};

export type HttpResponse<T> = {
  result: HttpResult;
  response: T;
};

export function isHttpError(err: HttpError): err is HttpError {
  return (err as HttpError).errorCode !== undefined;
}
