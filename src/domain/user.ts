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

    private _friends: { user: User; status: FriendshipStatus }[];
    private _invitations: { user: User; status: FriendshipStatus }[];
    private _password: string;
    constructor(user: IUser) {
        super();
        this.email = user.email;
        this._password = user.password;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.birthdate = user.birthdate;
        this._friends = user.friends || [];
        this._invitations = user.invitations || [];
    }
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly birthdate: Date;

    get friends(): { user: User; status: FriendshipStatus }[] {
        return this._friends;
    }

    get invitations(): { user: User; status: FriendshipStatus }[] {
        return this._invitations;
    }

    get age(): number {
        let timeDiff = Math.abs(Date.now() - this.birthdate.getTime());
        const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        return age
    }

    public static save(props: IUser): User {
        return new User(props);
    }

    isValidPassword(password: string) {
        return this._password === password
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
            const inviterIndex = inviter._friends.findIndex((friend) => friend.user.id === this.id);
            if (inviterIndex !== -1) {
                inviter._friends.splice(inviterIndex, 1);
                inviter._friends.push({ user: this, status: FriendshipStatus.Accepted });
            }
        }
    }

    declineFriendship(inviter: User): void {
        this._invitations = this._invitations.filter((invite) => invite.user.id !== inviter.id);
        inviter._friends = inviter.friends.filter((invite) => invite.user.id !== this.id);
    }
}