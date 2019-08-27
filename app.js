const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const settings = require('./settings');
const Mediator = require('./application/Mediator');

const Router = require('./application/Router/Router');
const DB = require('./application/modules/db/db');

const WSManager = require('./application/modules/managers/WSManager');
const UserManager = require('./application/modules/managers/UserManager');
const StudentManager = require('./application/modules/managers/StudentManager');
const GroupManager = require('./application/modules/managers/GroupManager');

const db = new DB({ settings });
const mediator = new Mediator({ EVENTS: settings.mediator.events, TRIGGERS: settings.mediator.triggers });
const router = new Router({ db, mediator, events: mediator.EVENTS, triggers: mediator.TRIGGERS });

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(`${__dirname}/public`));
app.use(router);

new WSManager({ mediator, db, io, socketEvents: settings.socketEvents });
new UserManager({ mediator, db, socket: io, socketEvents: settings.socketEvents });
new StudentManager({ mediator, db, socket: io, socketEvents: settings.socketEvents });
new GroupManager({ mediator, db, socket: io, socketEvents: settings.socketEvents });

http.listen(8080, () => console.log('The server has been started on port 8080'));
