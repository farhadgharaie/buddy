import { v4 as UUID } from 'uuid';

export abstract class Entity<T> {
    public readonly _id: string;

    constructor(id?: string) {
        this._id = id || UUID();
    }
    get id(): string {
        return this._id;
    }
}