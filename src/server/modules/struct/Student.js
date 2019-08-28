const User = require('./User');

class Student extends User {
    constructor({id = null, name = null, shortName = null, code = null, students = null, studentId = null, groupId = null, type = null}) {
        super({id, name, shortName, code, students});
        this.studentId = studentId;
        this.groupId = groupId;
        this.type = type;
    }
}

module.exports = Student;
