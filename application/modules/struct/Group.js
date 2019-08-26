class Group {
    constructor({id = null, name = null, shortName = null, code = null, students = null}) {
        this.id = id;
        this.name = name;
        this.shortName = shortName;
        this.code = code;
        this.students = students
    }
}

module.exports = Group;
