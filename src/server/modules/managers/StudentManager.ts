import socket from 'socket.io';

import { Student, User } from '../struct';
import BaseManager, { BaseOptions } from "./BaseManager";

type StudentManagerOptions = BaseOptions & { io: socket.Server };

// Класс для описания методов для работы со студентами
class StudentManager extends BaseManager {
    io: socket.Server;

    constructor(options: StudentManagerOptions) {
        super(options);
        this.io = options.io;
        this.mediator.set(this.triggers.SET_STUDENT, this.setStudent);
        this.mediator.set(this.triggers.NOTE_STUDENT, this.noteStudent);
        this.mediator.set(this.triggers.GET_STUDENTS_ON_LESSON, this.getStudentsOnLesson);
    }

    // Добавить студента data = {userId, groupId, type}
    setStudent = (data: { userId: number, groupId: number, type: number }) => this.db.addStudent(data);

    setSocketIdToStudent = (student: User) => {
        const users = this.mediator.get(this.triggers.GET_ACTIVE_USERS);
        const userToken = Object.keys(users).find((token: string) => users[token].id === student.id);
        if (userToken) {
            student.socketId = users[userToken].socketId;
        }
    };

    getDate = () => new Date().toJSON().split('T')[0];

    noteStudent = async ({ tokenAdmin, tokenStudent }: { tokenAdmin: string, tokenStudent: string }) => {
        let studentFromDB = await this.db.getStudentByToken(tokenAdmin);
        if (studentFromDB) {
            const admin = new Student(studentFromDB);
            if (admin && (admin.type === 1 || admin.type === 2)) {
                this.setSocketIdToStudent(admin);
                studentFromDB = await this.db.getStudentByToken(tokenStudent);
                if (studentFromDB) {
                    const student = new Student(studentFromDB);
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
                                this.io.to(admin.socketId.id).emit(this.socketEvents.GET_STUDENTS_LIST, { students });
                            }
                        }
                    }
                }
            }
        }
    };

    // Получить студентов, пришедших на пару data = { tokenAdmin, date, lessonNum }
    getStudentsOnLesson = async ({tokenAdmin, date, lessonNum }: { tokenAdmin: string, date: string, lessonNum: number }) => {
        const studentFromDB = await this.db.getStudentByToken(tokenAdmin);
        if (studentFromDB) {
            const admin = new Student(studentFromDB);
            if (admin && (admin.type === 1 || admin.type === 2)) {
                const lesson = await this.db.getLessonByNum(lessonNum);
                if (lesson) {
                    return this.db.getStudentsOnLesson({ adminId: admin.id, date, lessonId: lesson.id });
                }
            }
        }
        return false;
    };
}

export default StudentManager;
