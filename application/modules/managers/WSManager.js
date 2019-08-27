function WSManager(options = {}) {
    const io = options.io;
    const socketEvents = options.socketEvents;
    const mediator = options.mediator;
    const events = mediator.EVENTS;
    const triggers = mediator.TRIGGERS;

    function getStudentsList({ admin, students }) {
        io.to(admin.socketId).emit(socketEvents.GET_STUDENTS_LIST, { students });
    }

    function initSocket(socket) {
        const users = mediator.get(triggers.GET_ACTIVE_USERS);
        const usersKeys = Object.keys(users);
        const me = users[usersKeys[usersKeys.length - 1]];
        if (me) {
            me.socketId = socket;
            io.local.emit(socketEvents.SEND_MESSAGE_TO_ALL, { text: `Пользователь ${me.name} подключился!`, id: me.id, name: me.name});
        }
    }

    function getUserBySocketId(socket) {
        const users = mediator.get(triggers.GET_ACTIVE_USERS);
        return getUser(users, socket);
    }

    function getUser(users, socket) {
        const key = Object.keys(users).find(user => users[user].socketId.id === socket.id);
        return users[key];
    }

    function init() {
        mediator.subscribe(events.GET_STUDENTS_LIST, getStudentsList);
        io.on('connection', socket => {
            console.log('user connected to WSManager ' + socket.id);
            initSocket(socket);

            socket.on(socketEvents.SEND_MESSAGE, ({ text }) => {
                const me = getUserBySocketId(socket);
                if (me) {
                    io.local.emit(socketEvents.SEND_MESSAGE_TO_ALL, { text, id: socket.id, name: me.name });
                }
            });

            socket.on(socketEvents.LOGOUT_CHAT, () => {
                const users = mediator.get(triggers.GET_ACTIVE_USERS);
                const me = getUser(users, socket);
                if (me) {
                    const text = `Пользователь ${me.name} отключился!`;
                    delete users[me.token];
                    io.local.emit(socketEvents.SEND_MESSAGE_TO_ALL, { text, id: socket.id, name: me.name });
                }
            });
        });
    }
    init();
}

module.exports = WSManager;
