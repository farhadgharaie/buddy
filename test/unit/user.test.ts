import * as assert from "assert";
import { validate } from 'uuid';

import { User, IUser, FriendshipStatus } from "../../src/domain/user";

describe('Unit test User', () => {

    const validEmail = 'test@test.com';
    const validPassword = 'securePassword@1234';
    const validFirstName = "Jim";
    const validLastName = "Petrosian";
    const validBirthdate = new Date("1985-09-08");
    const validAge = 38;

    const userMock: IUser = {
        email: validEmail,
        firstName: validFirstName,
        lastName: validLastName,
        birthdate: validBirthdate,
        password: validPassword,
        invitations: [],
        friends: [],
    };

    describe('User.Register', () => {
        it('generates user when all properties are valid', () => {
            const user = new User(userMock);
            expect(user).not.toHaveProperty('password');
            expect(user).toBeDefined();
            expect(user.email).toBe(userMock.email);
            expect(user.firstName).toBe(userMock.firstName);
            expect(user.lastName).toBe(userMock.lastName);
            expect(user.birthdate).toBe(userMock.birthdate);
            expect(user.friends).toEqual(userMock.friends);
            expect(user.invitations).toEqual(userMock.invitations);
        });

        it('generates user age from birthdate', () => {
            const user = new User(userMock);
            assert.equal(user.age, validAge);
        });

        it('generates valid uuid when no ID is provided', () => {
            const user = new User(userMock);
            assert.ok(validate(user.id));
        });

        it('generates user with valid password', () => {
            const user = new User(userMock);
            expect(user.isValidPassword(validPassword)).toBeTruthy
           
        });

        it('invites a friend', () => {
            const user = new User({
                email: validEmail,
                firstName: validFirstName,
                lastName: validLastName,
                birthdate: validBirthdate,
                password: validPassword,
                invitations: [],
                friends: [],
            });
            const friendUser = new User({
                email: 'pedram@test.com',
                firstName: 'Pedram',
                lastName: 'Sib',
                birthdate: new Date("2000-01-04"),
                password: validPassword,
                invitations: [],
                friends: [],
            })

            user.inviteFriend(friendUser);

            expect(user.friends).toHaveLength(1);
            expect(user.friends[0].user).toEqual(friendUser);
            expect(user.friends[0].status).toBe(FriendshipStatus.Pending);

            expect(friendUser.invitations).toHaveLength(1);
            expect(friendUser.invitations[0].user).toEqual(user);
            expect(friendUser.invitations[0].status).toBe(FriendshipStatus.Pending);

        });

        it('should accept a friendship invitation', () => {
            const inviterUser = new User({
                email: validEmail,
                firstName: validFirstName,
                lastName: validLastName,
                birthdate: validBirthdate,
                password: validPassword,
                invitations: [],
                friends: [],
            });
            const invitedUser = new User({
                email: 'jim@test.com',
                firstName: 'Jim',
                lastName: 'Hamingon',
                birthdate: new Date("2000-01-04"),
                password: validPassword,
                invitations: [],
                friends: [],
            });


            inviterUser.inviteFriend(invitedUser);
            invitedUser.acceptFriendship(inviterUser);

            expect(inviterUser.invitations).toHaveLength(0);
            expect(inviterUser.friends).toHaveLength(1);
            expect(inviterUser.friends[0].user).toEqual(invitedUser);
            expect(inviterUser.friends[0].status).toBe(FriendshipStatus.Accepted);

            expect(invitedUser.invitations).toHaveLength(0);
            expect(invitedUser.friends).toHaveLength(1);
            expect(invitedUser.friends[0].user).toEqual(inviterUser);
            expect(invitedUser.friends[0].status).toBe(FriendshipStatus.Accepted);
        });

        it('should decline a friendship invitation', () => {
            const inviterUser = new User({
                email: validEmail,
                firstName: validFirstName,
                lastName: validLastName,
                birthdate: validBirthdate,
                password: validPassword,
                invitations: [],
                friends: [],
            });
            const invitedUser = new User({
                email: 'jim@test.com',
                firstName: 'Jim',
                lastName: 'Hamingon',
                birthdate: new Date("2000-01-04"),
                password: validPassword,
                invitations: [],
                friends: [],
            });

            inviterUser.inviteFriend(invitedUser);
            invitedUser.declineFriendship(inviterUser);

            expect(inviterUser.invitations).toHaveLength(0);
            expect(inviterUser.friends).toHaveLength(0);
            expect(invitedUser.invitations).toHaveLength(0);
            expect(invitedUser.friends).toHaveLength(0);
        });
    })
});

