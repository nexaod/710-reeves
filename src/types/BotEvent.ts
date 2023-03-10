import EventEmitter = require('events');
import Bot from '../Bot';
import * as uuid from 'uuid';
export default interface BotEvent {
    new(client: Bot): BotEvent;
    uid: string;
    client: Bot;
    get name(): string;
    get fireOnce(): boolean;
    get enabled(): boolean;
    run(args: unknown | unknown[], args2?: unknown | unknown[]): Promise<void>;
}

export default class BotEvent extends EventEmitter {
    constructor(client: Bot) {
        super();
        this.client = client;
        this.uid = uuid.v4();
        this.on('error', (error) => {
            console.log(error);
            client.logger.error({ error: error, handler: this.constructor.name });
        });
    }

    exec(args: any, args2?: any) {
        const _args = args.length ? args.shift() : args;
        type EmittedError = typeof Object;
        if (args2) {
            this.run(_args, args2).catch((error: EmittedError) => this.emit('error', error));
        } else {
            this.run(_args).catch((error: EmittedError) => this.emit('error', error));
        }
    }
}
