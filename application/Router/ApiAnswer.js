// Класс для формирования стандартизованных ответов сервера
class ApiAnswer {
    static answer = (data) => {
        return { result: 'ok', data };
    };

    errors = {
        1000: 'not enough parameters',
        2000: 'error with trying add to DB',
        2010: 'incorrect login/logout data',
        3010: 'error with note student',
        3020: 'error with trying get students on lesson',
        404: 'element not found',
        9000: 'unknown error'
    };

    error = code => {
        const error = this.errors[code] || this.errors[9000];
        return { result: 'error', error };
    }
}

module.exports = ApiAnswer;
