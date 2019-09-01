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

  initSocket(socket: Socket) {
    const users = this.mediator.get(this.triggers.GET_ACTIVE_USERS);
    const usersKeys = Object.keys(users);
    const me = users[usersKeys[usersKeys.length - 1]];
    if (me) {
      me.socketId = socket;
      this.io.local.emit(this.socketEvents.SEND_MESSAGE_TO_ALL, {
        text: `Пользователь ${me.name} подключился!`,
        id: me.id,
        name: me.name,
      });
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
      this.initSocket(socket);

      socket.on(this.socketEvents.SEND_MESSAGE, ({ text }) => {
        const me = this.getUserBySocketId(socket);
        if (me) {
          this.io.local.emit(this.socketEvents.SEND_MESSAGE_TO_ALL, {
            text,
            id: socket.id,
            name: me.name,
          });
        }
      });

      socket.on(this.socketEvents.LOGOUT_CHAT, () => {
        const users = this.mediator.get(this.triggers.GET_ACTIVE_USERS);
        const me = this.getUser(users, socket);
        if (me && me.token) {
          const text = `Пользователь ${me.name} отключился!`;
          delete users[me.token];
          this.io.local.emit(this.socketEvents.SEND_MESSAGE_TO_ALL, {
            text,
            id: socket.id,
            name: me.name,
          });
        }
      });
    });
  }
}

export default WSManager;
