const BaseManager = require('./BaseManager');

class GroupManager extends BaseManager{
    constructor(options) {
        super(options);
        this.mediator.set(this.triggers.GET_GROUPS_CODES, this.getGroupsCodes)
    }

    getGroupsCodes = () => this.db.getGroupsCodes();
}

module.exports = GroupManager;
