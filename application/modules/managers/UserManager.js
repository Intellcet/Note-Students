const md5 = require('md5');

const BaseManager = require('./BaseManager');
const User = require('../struct/User');

// Класс для описания методов для работы с пользователями
class UserManager extends BaseManager {
    users = {};

    constructor(options) {
        super(options);
        this.mediator.set(this.triggers.GET_ACTIVE_USERS, this.getActiveUsers);
        this.mediator.set(this.triggers.GET_USER, this.getUser);
        this.mediator.set(this.triggers.GET_USER_TYPE_BY_TOKEN, this.getUserTypeByToken);
        this.mediator.set(this.triggers.GET_USERS, this.getUsers);
        this.mediator.set(this.triggers.SET_USER, this.setUser);
        this.mediator.set(this.triggers.LOGIN, this.login);
        this.mediator.set(this.triggers.LOGOUT, this.logout);
    }

    getActiveUsers = () => this.users;

    getUserTypeByToken = ({ token }) => {
        const user = this.db.getUserByToken(token);
        if (user) {
            return this.db.getStudentType(user.id);
        }
        return null;
    };

    // Получить пользователя по логину. data = {login}
    getUser = ({ login }) => this.db.getUserByLogin(login);

    getUsers = () => this.db.getUsers();

    // Регистрация. data = {login, password, name}
    setUser = (data) => {
        const result = this.db.addUser(data);
        if (result) {
            data.userId = result.userId;
            return this.mediator.get(this.triggers.SET_USER, data);
        }
        return null;
    };

    // Вход в систему. data = {login, password, rnd}
    login = ({ login, password, rnd }) => {
        const user = this.getUser({ login });
        if (user) {
            const passwordHash = md5( user.password + rnd );
            if (user && password === passwordHash ) {
                const rnd = Math.floor(Math.random() * 100000);
                const token = md5(rnd + login + password);
                this.db.setToken(user.id, token);
                user.token = token;
                this.users[user.token] = new User({...user});
                return token;
            }
        }
        return false;
    };

    logout = ({ token }) => {
        const user = this.db.getUserByToken(token);
        if (user) {
            this.db.setToken(user.id);
            return true;
        }
        return null;
    }

}

module.exports = UserManager;
