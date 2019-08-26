const express = require('express');
const router = express.Router();

const ApiAnswer = require('./ApiAnswer');

function Router(options = {}) {
    const { mediator, events, triggers } = options;
    const error = new ApiAnswer().error;

    // Получить всех юзеров
    router.get('/api/user', async (req, res) => res.send(ApiAnswer.answer(await mediator.get(triggers.GET_USERS))));

    // Получить юзера по логину
    router.get('/api/user/:login', async (req, res) => {
        const login = req.params.login;
        const result = await mediator.get(triggers.GET_USER, { login });
        if (result) {
            result.password = null;
            return res.send(ApiAnswer.answer(result));
        }
        res.send(error(404))
    });

    // Получить тип юзера по токену
    router.get('/api/user/type/:token', async (req, res) => {
        const token = req.params.token;
        const result = await mediator.get(triggers.GET_USER_TYPE_BY_TOKEN, { token });
        if (result) {
            return res.send(ApiAnswer.answer(result));
        }
        res.send(error(404));
    });

    // регистрация
    router.post('/api/user', async (req, res) => {
        const { login, password, group, type, name } = req.body;
        if (login && password && group && type && name) {
            const result = await mediator.get(triggers.SET_USER, { login, password, group, type, name });
            if (result) {
                return res.send(ApiAnswer.answer(result));
            }
            return res.send(error(2000));
        }
        res.send(error(1000));
    });

    // логин юзера
    router.get('/api/user/login/:login/:password/:rnd', async (req, res) => {
        const { login, password, rnd } = req.params;
        const result = await mediator.get(triggers.LOGIN, { login, password, rnd });
        if (result) {
            return res.send(ApiAnswer.answer(result));
        }
        res.send(error(2010));
    });

    // выход юзера
    router.get('/api/user/logout/:token', async (req, res) => {
        const token = req.params.token;
        const result = await mediator.get(triggers.LOGOUT, { token });
        if (result) {
            return res.send(ApiAnswer.answer(result));
        }
        res.send(error(2010));
    });

    // получить коды групп
    router.get('/api/group/codes', async (req, res) => res.send(ApiAnswer.answer(await mediator.get(triggers.GET_GROUPS_CODES))));

    // отметить студента
    router.get('/api/student/note/:tokenAdmin/:tokenStudent', async (req, res) => {
        const { tokenAdmin, tokenStudent } = req.params;
        const result = await mediator.get(triggers.NOTE_STUDENT, { tokenAdmin, tokenStudent });
        if (result) {
            return res.send(ApiAnswer.answer(result));
        }
        res.send(3010);
    });

    // получить студентов на занятии
    router.get('/api/student/getOnLesson/:tokenAdmin/:date/:lessonNum', async (req, res) => {
        const { tokenAdmin, date, lessonNum } = req.params;
        const result = await mediator.get(triggers.GET_STUDENTS_ON_LESSON, { tokenAdmin, date, lessonNum });
        if (result) {
            return res.send(ApiAnswer.answer(result));
        }
        res.send(error(3020))
    });

    return router;
}

module.exports = Router;
