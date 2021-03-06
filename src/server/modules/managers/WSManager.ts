import socket, { Socket } from 'socket.io';

import { Student, User } from '../struct';
import Mediator, { Event } from '../../Mediator';
import DB from '../db';

type WSManagerOptions = {
  io: socket.Server;
  db: DB;
  socketEvents: Event;
  mediator: Mediator;
};

class WSManager {
  io: socket.Server;

  db: DB;

  socketEvents: Event;

  mediator: Mediator;

  events: Event;

  triggers: Event;

  constructor(options: WSManagerOptions) {
    this.io = options.io;
    this.db = options.db;
    this.socketEvents = options.socketEvents;
    this.mediator = options.mediator;
    this.events = this.mediator.EVENTS;
    this.triggers = this.mediator.TRIGGERS;
    this.init();
  }

  getStudentsList({
    admin,
    students,
  }: {
    admin: Student;
    students: Student[];
  }) {
    if (admin.socketId) {
      this.io
        .to(admin.socketId.id)
        .emit(this.socketEvents.GET_STUDENTS_LIST, { students });
    }
  }

  getUserBySocketId(socket: Socket) {
    const users = this.mediator.get(this.triggers.GET_ACTIVE_USERS);
    return this.getUser(users, socket);
  }

  getUser(users: { [token: string]: User }, socket: Socket) {
    const key = Object.keys(users).find(
      (token: string) =>
        users[token].socketId && users[token].socketId.id === socket.id
    );
    return key && users[key];
  }

  private init() {
    this.mediator.subscribe(
      this.events.GET_STUDENTS_LIST,
      this.getStudentsList
    );
    this.io.on('connection', socket => {
      console.log('user connected to WSManager ' + socket.id);

      let user: User;

      socket.on(this.socketEvents.NEW_USER_CAME, ({ token }) => {
        const users = this.mediator.get(this.triggers.GET_ACTIVE_USERS);
        const me = users[token];
        if (me) {
          me.socketId = socket;
          user = new User({ ...me });
          this.io.local.emit(this.socketEvents.SEND_MESSAGE_TO_ALL, {
            text: `Пользователь ${me.name} подключился!`,
            id: me.id,
            name: me.name,
          });
        }
      });

      socket.on(this.socketEvents.SEND_MESSAGE, ({ text }) => {
        this.io.local.emit(this.socketEvents.SEND_MESSAGE_TO_ALL, {
          text,
          id: socket.id,
          name: user.name,
        });
      });

      socket.on(this.socketEvents.LOGOUT_CHAT, () => {
        const users = this.mediator.get(this.triggers.GET_ACTIVE_USERS);
        if (user && user.token) {
          const text = `Пользователь ${user.name} отключился!`;
          delete users[user.token];
          this.io.local.emit(this.socketEvents.SEND_MESSAGE_TO_ALL, {
            text,
            id: socket.id,
            name: user.name,
          });
        }
      });
    });
  }
}

export default WSManager;
