const sqlite3 = require('sqlite3');

class DB {
    constructor(options = {}) {
        this.db = new sqlite3.Database(`${__dirname}/${options.settings.dbName}`)
    }

    getUserByLogin = login =>
        new Promise(resolve => {
            if (login) {
                const query = 'SELECT * FROM user WHERE login=?';
                this.db.get(query, [login], (err, row) => resolve(err ? null : row))
            } else {
                resolve(null);
            }
        });

    getUserByToken = token =>
        new Promise(resolve => {
            if (token) {
                const query = 'SELECT * FROM user WHERE login=?';
                this.db.get(query, [token], (err, row) => resolve(err ? null : row));
            } else {
                resolve(null);
            }
        });

    getUsers = () =>
        new Promise(resolve => {
            const query = 'SELECT * FROM user';
            this.db.all(query, (err, rows) => resolve(err ? null : rows));
        });

    setToken = (id, token = null) =>
        new Promise(resolve => {
            if (token && Number(id)) {
                const query = 'UPDATE user SET token=? WHERE id=?';
                this.db.run(query, err => resolve(!err));
            }
        });

    addUser = ({login, password, name}) =>
        new Promise(resolve => {
            const query = 'INSERT INTO user (login, password, name) VALUES (?, ?, ?)';
            this.db.run(query, [login, password, name], err => !err ? resolve(this.getUserByLogin(login)) : resolve(null));
        });

    addStudent = (userId, groupId, type) =>
        new Promise(resolve =>  {
            const query = 'INSERT INTO student (user_id, group_id, type) VALUES (?, (SELECT id FROM "group" WHERE "group".code = ?), ?)';
            this.db.run(query, [userId, groupId, type], err => resolve(!err));
        });

    getStudentByToken = token =>
        new Promise(resolve => {
            const query = 'SELECT student.id AS student_id, student.group_id AS group_id, student.type AS type,' +
                'user.id AS id, user.login AS login, user.password AS password, user.name AS name, user.token AS token' +
                'FROM student JOIN user ON (student.user_id = user.id)' +
                'WHERE user.token = ?';
            this.db.get(query, [token], (err, row) => resolve(err ? null : row));
        });

    getGroupsCodes = () =>
        new Promise(resolve => {
            const query = 'SELECT code FROM group';
            this.db.all(query, (err, rows) => resolve(err ? null : rows));
        });

    getCurrentLesson = () =>
        new Promise(resolve =>  {
            const query = "SELECT * FROM lesson_time WHERE time_start < time('now', 'localtime') AND time('now', 'localtime') < time_finish";
            this.db.get(query, (err, row) => resolve(err ? null : row));
        });

    noteStudent = ({adminId, studentId, lessonId}) =>
        new Promise(resolve => {
            const query = "INSERT INTO student_on_lessons (admin_id, students_id, lesson_time_id, date, time) " +
                "VALUES (?, ?, ?, date('now', 'localtime'), time('now', 'localtime'))";
            this.db.run(query, err => resolve(!err));
        });

    getLessonByNum = lessonNum =>
        new Promise(resolve => {
            const query = "SELECT * FROM lesson_time WHERE num_lesson = ?";
            this.db.get(query, [lessonNum], (err, row) => resolve(err ? null : row));
        });

    getStudentOnLesson = ({studentId, lessonId}) =>
        new Promise(resolve => {
            const query = "SELECT * FROM student_on_lessons" +
                "WHERE students_id = ? AND lesson_time_id = ? AND student_on_lessons.date = date('now', 'localtime')";
            this.db.get(query, [studentId, lessonId], (err, row) => resolve(err ? null : row));
        });

    getStudentsOnLesson = ({adminId, date, lessonId}) =>
        new Promise(resolve => {
           const query = 'SELECT student_on_lessons.date AS date, student_on_lessons.time AS time, ' +
               'lesson_time.num_lesson AS lessonNum, lesson_time.time_start AS timeStart, lesson_time.time_finish AS timeFinish, ' +
               "student.type AS type, user.id AS userId, user.name AS name, 'group'.short_name AS shortName " +
               "FROM student_on_lessons " +
               "JOIN lesson_time ON (student_on_lessons.lesson_time_id = lesson_time.id) " +
               "JOIN user ON (user.id = student_on_lessons.students_id) " +
               "JOIN student ON (student.user_id = user.id) " +
               "JOIN 'group' ON ('group'.id = student.group_id) " +
               "WHERE student_on_lessons.date = ? " +
               "AND student_on_lessons.admin_id = ? " +
               "AND student_on_lessons.lesson_time_id = ?";
           this.db.all(query, [date, adminId, lessonId], (err, rows) => resolve(err ? null : rows));
        });

    getStudentType = id =>
        new Promise(resolve => {
            const query = "SELECT type FROM student WHERE user_id = ?";
            this.db.get(query, [id], (err, row) => resolve(err ? null : row));
        });
}

module.exports = DB;
