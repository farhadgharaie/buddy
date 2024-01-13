import { Entity } from '../core/entity';

export enum FriendshipStatus {
    Pending = 'pending',
    Accepted = 'accepted',
    Declined = 'declined',
}

export interface IUser {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthdate: Date;
    friends: { user: User; status: FriendshipStatus }[];
    invitations: { user: User; status: FriendshipStatus }[];
}

export class User extends Entity<IUser>  {
    private _email: string;
    private _password: string;
    private _firstname: string;
    private _lastname: string;
    private _birthdate: Date;
    private _friends: { user: User; status: FriendshipStatus }[];
    private _invitations: { user: User; status: FriendshipStatus }[];

    constructor(user: IUser) {
        super();
        this._email = user.email;
        this._password = user.password;
        this._firstname = user.firstName;
        this._lastname = user.lastName;
        this._birthdate = user.birthdate;
        this._friends = user.friends || [];
        this._invitations = user.invitations || [];
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

    get friends() {
        return this._friends;
    }

    get invitations() {
        return this._invitations;
    }

    get age(): number {
        let timeDiff = Math.abs(Date.now() - this._birthdate.getTime());
        const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        return age
    }

    public static save(props: IUser):User {
        return new User(props);
    }

    inviteFriend(friend: User): void {
        this._friends.push({ user: friend, status: FriendshipStatus.Pending });
        friend._invitations.push({ user: this, status: FriendshipStatus.Pending })
    }

    acceptFriendship(inviter: User): void {
        const invitationIndex = this._invitations.findIndex((invite) => invite.user.id === inviter.id);

        if (invitationIndex !== -1) {
            this._invitations.splice(invitationIndex, 1);
            this._friends.push({ user: inviter, status: FriendshipStatus.Accepted });
            const inviterIndex = inviter.friends.findIndex((friend) => friend.user.id === this._id);
            if (inviterIndex !== -1) {
                inviter.friends.splice(inviterIndex, 1);
                inviter.friends.push({ user: this, status: FriendshipStatus.Accepted });
            }
        }
    }

    declineFriendship(inviter: User): void {
        this._invitations = this._invitations.filter((invite) => invite.user.id !== inviter.id);
        inviter._friends = inviter._friends.filter((invite) => invite.user.id !== this.id);
      }
}