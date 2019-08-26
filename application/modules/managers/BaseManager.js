// Описание базового менеджера.
// Здесь прописываются все параметры, которые должны быть у каждого менеджера

class BaseManager {
    constructor({db, mediator, events, triggers, socketEvents, socket}) {
        this.db = db;
        this.mediator = mediator;
        this.events = events;
        this.triggers = triggers;
        this.socketEvents = socketEvents;
        this.socket = socket;
    }
}

module.exports = BaseManager;
