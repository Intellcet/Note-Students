import Student from './Student';

type GroupOptions = {
    id?: number;
    name?: string;
    shortName?: string;
    code?: string;
    students: Student[];
}

class Group {
    id: number | null;
    name: string | null;
    shortName: string | null;
    code: string | null;
    students: Student[] | null;

    constructor(options: GroupOptions) {
        this.id = options.id || null;
        this.name = options.name || null;
        this.shortName = options.shortName || null;
        this.code = options.code || null;
        this.students = options.students || null;
    }
}

export default Group;
