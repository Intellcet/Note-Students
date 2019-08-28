export type Event = {
    [eventName: string]: string;
}

type MediatorEvent = {
    [eventName: string]: Function[];
}

type MediatorTrigger = {
    [triggerName: string]: Function;
}

type MediatorOptions = {
    EVENTS: Event;
    TRIGGERS: Event;
};


class Mediator {
    private readonly events: MediatorEvent; // сами события
    private readonly triggers: MediatorTrigger; // сами триггеры
    EVENTS: Event; // типы событий
    TRIGGERS: Event; // типы триггеров


    constructor(options: MediatorOptions) {
        this.EVENTS = options.EVENTS;
        this.TRIGGERS = options.TRIGGERS;
        this.events = {};
        this.triggers = {};
        Object.keys(this.EVENTS  ).forEach(key => this.events[this.EVENTS[key]] = []);
        Object.keys(this.TRIGGERS).forEach(key => this.triggers[this.TRIGGERS[key]] = () => null);
    }

    // Подписка на событие
    subscribe(name: string, func: Function): void {
        if (this.events[name]) {
            this.events[name].push(func);
        }
    }

    // Вызов события
    call(name: string, data: any = null): void {
        if (this.events[name]) {
            this.events[name].forEach(event => {
                event(data);
            });
        }
    }

    // Вызов триггера
    get(name: string, data: any = null): any {
        if (this.triggers[name] && this.triggers[name] instanceof Function) {
            return this.triggers[name](data);
        }
        return null;
    }

    // Подписка на триггер
    set(name: string, func: Function): void {
        if (name) {
            this.triggers[name] = func;
        }
    }
}

export default Mediator;
