import BaseManager, { BaseOptions } from './BaseManager';

class GroupManager extends BaseManager {
  constructor(options: BaseOptions) {
    super(options);
    this.mediator.set(this.triggers.GET_GROUPS_CODES, this.getGroupsCodes);
  }

  getGroupsCodes = () => this.db.getGroupsCodes();
}

export default GroupManager;
