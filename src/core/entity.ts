import { v4 as UUID } from 'uuid';

export abstract class Entity<T> {
    public id: string;

    constructor() {
        this.id = UUID();
    }
    
}