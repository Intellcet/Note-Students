import { AxiosResponse } from 'axios';

type CorrectData = {
  result: string;
  data: string;
};

type IncorrectData = {
  result: string;
  error: string;
};

const isCorrectData = (
  data: CorrectData | IncorrectData
): data is CorrectData => (data as CorrectData).data !== undefined;

class LoginManager {
  static token: string;

  static error: string;

  static parseAnswer(data: AxiosResponse<any>): string {
    if (isCorrectData(data.data)) {
      this.token = data.data.result;
      return 'Logged In!';
    }
    return data.data.error;
  }
}

export default LoginManager;
