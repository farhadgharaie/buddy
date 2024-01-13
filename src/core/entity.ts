import { v4 as UUID } from 'uuid';

export abstract class Entity<T> {
    public readonly _id: string;

    constructor() {
        this._id = UUID();
    }
    get id(): string {
        return this._id;
    }
}