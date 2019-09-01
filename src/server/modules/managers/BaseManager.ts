// Описание базового менеджера.
// Здесь прописываются все параметры, которые должны быть у каждого менеджера
import DB from '../db';
import Mediator, { Event } from '../../Mediator';

export type BaseOptions = {
  db: DB;
  mediator: Mediator;
  socketEvents: Event;
};

class BaseManager {
  db: DB;

  mediator: Mediator;

  events: Event;

  triggers: Event;

  socketEvents: Event;

  constructor(options: BaseOptions) {
    this.db = options.db;
    this.mediator = options.mediator;
    this.events = options.mediator.EVENTS;
    this.triggers = options.mediator.TRIGGERS;
    this.socketEvents = options.socketEvents;
  }
}

export default BaseManager;
