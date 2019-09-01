import express from 'express';
import http from 'http'
import socket from 'socket.io';

import { settings } from './settings';
import Mediator from "./Mediator";
import Router from './Router';
import DB from './modules/db';
import { WSManager, StudentManager, GroupManager, UserManager } from './modules/managers';

const app = express();
const server = new http.Server(app);
const io = socket(server);

const db = new DB({ dbName: settings.dbName });
const mediator = new Mediator({ EVENTS: settings.mediator.events, TRIGGERS: settings.mediator.triggers });
const router = new Router({ mediator, events: mediator.EVENTS, triggers: mediator.TRIGGERS }).getRouter();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(`${process.cwd()}/src/client`));
app.use(router);

new WSManager({ mediator, db, io, socketEvents: settings.socketEvents });
new UserManager({ mediator, db, socketEvents: settings.socketEvents });
new StudentManager({ mediator, db, io, socketEvents: settings.socketEvents });
new GroupManager({ mediator, db, socketEvents: settings.socketEvents });

server.listen(8080, () => console.log('The server has been started on port 8080'));
