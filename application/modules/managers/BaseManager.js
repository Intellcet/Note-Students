// Описание базового менеджера.
// Здесь прописываются все параметры, которые должны быть у каждого менеджера

class BaseManager {
    constructor({db, mediator, socketEvents, socket}) {
        this.db = db;
        this.mediator = mediator;
        this.events = mediator.EVENTS;
        this.triggers = mediator.TRIGGERS;
        this.socketEvents = socketEvents;
        this.socket = socket;
    }
}

module.exports = BaseManager;
