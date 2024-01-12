import { Entity } from '../core/entity';

export interface IUser {
    email: string;
    firstname: string;
    lastname: string;
    birthdate: Date
}

export class User extends Entity<IUser>  {
    private _email: string;
    private _firstname: string;
    private _lastname: string;
    private _birthdate: Date;

    constructor({ email, firstname, lastname, birthdate }: IUser, id?: string) {
        super(id);
        this._email = email;
        this._firstname = firstname;
        this._lastname = lastname;
        this._birthdate = birthdate;
    }

    get email() {
        return this._email;
    }

    get firstname() {
        return this._firstname;
    }

    get lastname() {
        return this._lastname;
    }

    get birthdate() {
        return this._birthdate;
    }

    get age(): number {
        let timeDiff = Math.abs(Date.now() - this._birthdate.getTime());
        const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        return age
    }
    public static register(props: IUser, guid?: string) {
        return new User(props, guid);
    }
}