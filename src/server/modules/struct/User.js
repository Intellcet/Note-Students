class User {
    constructor({id = null, login = null, password = null, name = null, token = null, socketId = null}) {
        this.id = id;
        this.login = login;
        this.password = password;
        this.name = name;
        this.token = token;
        this.socketId = socketId;
    }
}

module.exports = User;
