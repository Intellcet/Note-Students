import { Socket } from 'socket.io';

export type UserOptions = {
  id: number;
  login: string;
  password: string;
  name: string;
  token: string;
  socketId: Socket;
};

class User {
  id: number;

  login: string;

  password: string;

  name: string;

  token: string;

  socketId: Socket;

  constructor(options: UserOptions) {
    this.id = options.id;
    this.login = options.login;
    this.password = options.password;
    this.name = options.name;
    this.token = options.token;
    this.socketId = options.socketId || null;
  }
}

export default User;
