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

  static parseAnswer(data: AxiosResponse<CorrectData | IncorrectData>): string {
    if (isCorrectData(data.data)) {
      this.token = data.data.result;
      localStorage.setItem('token', data.data.result);
      return 'Logged In!';
    }
    return data.data.error;
  }
}

export default LoginManager;
