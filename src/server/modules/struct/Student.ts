import User, { UserOptions } from './User';

export type StudentOptions = UserOptions & {
    studentId: number;
    groupId: number;
    type: number;
};

class Student extends User {
    studentId: number | null;
    groupId: number | null;
    type: number | null;

    constructor(options: StudentOptions) {
        super(options);
        this.studentId = options.studentId || null;
        this.groupId = options.groupId || null;
        this.type = options.type || null;
    }
}

export default Student;
