const BaseManager = require('./BaseManager');
const Student = require('../struct/Student');

// Класс для описания методов для работы со студентами
class StudentManager extends BaseManager {

    constructor(options) {
        super(options);
        this.io = options.io;
        this.mediator.set(this.triggers.SET_STUDENT, this.setStudent);
        this.mediator.set(this.triggers.NOTE_STUDENT, this.noteStudent);
        this.mediator.set(this.triggers.GET_STUDENTS_ON_LESSON, this.getStudentsOnLesson);
    }

    // Добавить студента data = {userId, group, type}
    setStudent = data => this.db.addStudent(data);

    setSocketIdToStudent = student => {
        const users = this.mediator.get(this.triggers.GET_ACTIVE_USERS);
        for (const user in users) {
            if (users[user].id === student.id) {
                student.socketId = users[user].socketId;
                return;
            }
        }
    };

    getDate = () => new Date().toJSON().split('T')[0];

    noteStudent = async ({ tokenAdmin, tokenStudent }) => {
        const admin = new Student(await this.db.getStudentByToken(tokenAdmin));
        if (admin && admin.type === 1 && admin.type === 2) {
            this.setSocketIdToStudent(admin);
            const student = new Student(await this.db.getStudentByToken(tokenStudent));
            if (student && student.groupId === admin.groupId) {
                this.setSocketIdToStudent(student);
                const lesson = await this.db.getCurrentLesson();
                if (lesson) {
                    // Смотрим, отметился ли уже этот студент на этой пару
                    const isStudentAlreadyHere = await this.db.getStudentOnLesson({ studentId: student.id, lessonId: lesson.id});
                    if (!isStudentAlreadyHere) {
                        // Отметить студента
                        await this.db.noteStudent({adminId: admin.id, studentId: student.id, lessonId: lesson.id});
                        // Получить список студентов на этой паре
                        const students = await this.db.getStudentsOnLesson({ adminId: admin.id, date: this.getDate(), lessonId: lesson.id });
                        this.io.to(admin.socketId).emit(this.socketEvents.GET_STUDENTS_LIST, { students });
                    }
                }
            }
        }
    };

    // Получить студентов, пришедших на пару data = { tokenAdmin, date, lessonNum }
    getStudentsOnLesson = async ({tokenAdmin, date, lessonNum }) => {
        const admin = new Student(await this.db.getStudentByToken(tokenAdmin));
        if (admin && admin.type === 1 && admin.type === 2) {
            const lesson = await this.db.getLessonByNum(lessonNum);
            if (lesson) {
                return this.db.getStudentsOnLesson({ adminId: admin.id, date, lessonId: lesson.id });
            }
        }
        return false;
    };
}

module.exports = StudentManager;
