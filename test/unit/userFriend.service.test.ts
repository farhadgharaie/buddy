import { UserService } from '../../src/application/user.service';
import { UserRepository } from "../../src/domain/user.repository";
import { User, IUser, FriendshipStatus } from '../../src/domain/user';

// A mock for the UserRepository interface
const userRepositoryMock: jest.Mocked<UserRepository> = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
};

// Mock the implementation of the UserRepository methods
jest.mock('../../src/domain/user.repository', () => ({
    UserRepository: jest.fn(() => userRepositoryMock),
}));

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService(userRepositoryMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getInvitations', () => {
        it('should return invitations for a valid user', async () => {
            const mockUser: IUser = {
                email: 'ali@test.com',
                password: 'validPassword',
                firstName: 'Simin',
                lastName: 'Jones',
                birthdate: new Date('2010-03-07'),
                friends: [],
                invitations: [
                    { user: { id: 'inviter1' } as User, status: FriendshipStatus.Pending },
                    { user: { id: 'inviter2' } as User, status: FriendshipStatus.Pending },
                ]
            };

            const userInstance = new User(mockUser);
            const userId = userInstance._id;
            userRepositoryMock.findById.mockResolvedValueOnce(userInstance);

            const result = await userService.getInvitations(userId);

            expect(result).toHaveLength(2);
            expect(result.map(invitation => invitation.id)).toEqual(['inviter1', 'inviter2']);
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
        });

        it('should throw an error for an invalid user ID', async () => {
            const invalidUserId = 'invalidUser';

            userRepositoryMock.findById.mockResolvedValueOnce(null);

            await expect(userService.getInvitations(invalidUserId)).rejects.toThrow('Invalid user ID');

            expect(userRepositoryMock.findById).toHaveBeenCalledWith(invalidUserId);
        });
    });

    describe('inviteFriend', () => {
        it('should successfully invite a friend', async () => {
            const senderUserMock: IUser = {
                email: 'ali@test.com',
                password: 'validPassword',
                firstName: 'Ali',
                lastName: 'Typhon',
                birthdate: new Date('2010-03-07'),
                friends: [],
                invitations: []
            };

            const senderUserInstance = new User(senderUserMock);
            const senderId = senderUserInstance._id;

            const receiverUserMock: IUser = {
                email: 'Simin@test.com',
                password: 'validPassword',
                firstName: 'Simin',
                lastName: 'Jones',
                birthdate: new Date('1999-02-03'),
                friends: [],
                invitations: []
            };

            const receiverUserInstance = new User(receiverUserMock);
            const receiverId = receiverUserInstance._id;

            userRepositoryMock.findById.mockResolvedValueOnce(senderUserInstance);
            userRepositoryMock.findById.mockResolvedValueOnce(receiverUserInstance);

            userRepositoryMock.save.mockResolvedValueOnce(senderUserInstance);

            senderUserInstance.inviteFriend = jest.fn();
            await userService.inviteFriend(senderId, receiverId);

            expect(senderUserInstance.inviteFriend).toHaveBeenCalledWith(receiverUserInstance);
            expect(userRepositoryMock.save).toHaveBeenCalledWith(senderUserInstance);
        });

        it('should throw an error for invalid sender ID', async () => {
            const invalidSenderId = 'invalidSender';
            const receiverId = 'receiver1';

            userRepositoryMock.findById.mockResolvedValueOnce(null);

            await expect(userService.inviteFriend(invalidSenderId, receiverId)).rejects.toThrow('Invalid user IDs');

            expect(userRepositoryMock.findById).toHaveBeenCalledWith(invalidSenderId);
            expect(userRepositoryMock.save).not.toHaveBeenCalled();
        });

        it('should throw an error for invalid receiver ID', async () => {
            const invalidReceiverId = 'invalidReceiver';

            const senderUserMock: IUser = {
                email: 'ali@test.com',
                password: 'validPassword',
                firstName: 'Simin',
                lastName: 'Jones',
                birthdate: new Date('2010-03-07'),
                friends: [],
                invitations: []
            };

            const senderUserInstance = new User(senderUserMock);
            const senderId = senderUserInstance._id;

            userRepositoryMock.findById.mockResolvedValueOnce(senderUserInstance);
            userRepositoryMock.findById.mockResolvedValueOnce(null); // For simulate an invalid receiver ID

            await expect(userService.inviteFriend(senderId, invalidReceiverId)).rejects.toThrow('Invalid user IDs');

            expect(userRepositoryMock.findById).toHaveBeenCalledWith(senderId);
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(invalidReceiverId);
            expect(userRepositoryMock.save).not.toHaveBeenCalled();
        });
    });

    describe('acceptFriendship', () => {
        it('should successfully accept a friendship invitation', async () => {
            const inviterMock: IUser = {
                email: 'inviter@test.com',
                password: 'validPassword',
                firstName: 'Inviter',
                lastName: 'User',
                birthdate: new Date('2005-01-15'),
                friends: [],
                invitations: []
            };
            const inviterInstance = new User(inviterMock);

            const userMock: IUser = {
                email: 'ali@test.com',
                password: 'validPassword',
                firstName: 'Simin',
                lastName: 'Jones',
                birthdate: new Date('2010-03-07'),
                friends: [],
                invitations: [{ user: inviterInstance, status: FriendshipStatus.Pending }]
            };
            const userInstance = new User(userMock);

            userRepositoryMock.findById.mockResolvedValueOnce(userInstance);
            userRepositoryMock.findById.mockResolvedValueOnce(inviterInstance);

            userRepositoryMock.save.mockResolvedValueOnce(userInstance);

            await userService.acceptFriendship(userInstance.id, inviterInstance.id);

            expect(userInstance.invitations).toHaveLength(0);
            expect(userInstance.friends).toHaveLength(1);
            expect(userInstance.friends[0].user).toEqual(inviterInstance);
            expect(userInstance.friends[0].status).toBe(FriendshipStatus.Accepted);

            expect(userRepositoryMock.save).toHaveBeenCalledWith(userInstance);
        });

        it('should throw an error for invalid user IDs', async () => {
            const senderId = 'invalidSenderId';
            const receiverId = 'invalidReceiverId';

            userRepositoryMock.findById.mockResolvedValueOnce(null);
            userRepositoryMock.findById.mockResolvedValueOnce(null);

            await expect(userService.acceptFriendship(senderId, receiverId)).rejects.toThrow('Invalid user IDs');

            expect(userRepositoryMock.findById).toHaveBeenCalledWith(senderId);
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(receiverId);

            expect(userRepositoryMock.save).not.toHaveBeenCalled();
        });

    });

    describe('declineFriendship', () => {
        it('should successfully decline a friendship invitation', async () => {
            const inviterMock: IUser = {
                email: 'inviter@test.com',
                password: 'validPassword',
                firstName: 'Inviter',
                lastName: 'User',
                birthdate: new Date('2005-01-15'),
                friends: [],
                invitations: []
            };
            const inviterInstance = new User(inviterMock);

            const userMock: IUser = {
                email: 'ali@test.com',
                password: 'validPassword',
                firstName: 'Simin',
                lastName: 'Jones',
                birthdate: new Date('2010-03-07'),
                friends: [],
                invitations: [{ user: inviterInstance, status: FriendshipStatus.Pending }]
            };
            const userInstance = new User(userMock);

            userRepositoryMock.findById.mockResolvedValueOnce(userInstance);
            userRepositoryMock.findById.mockResolvedValueOnce(inviterInstance);

            userRepositoryMock.save.mockResolvedValueOnce(userInstance);

            await userService.declineFriendship(userInstance.id, inviterInstance.id);

            expect(userInstance.invitations).toHaveLength(0);
            expect(userInstance.friends).toHaveLength(0);

            expect(userRepositoryMock.save).toHaveBeenCalledWith(userInstance);
        });

        it('should throw an error for invalid user IDs', async () => {
            const senderId = 'invalidSenderId';
            const receiverId = 'invalidReceiverId';

            userRepositoryMock.findById.mockResolvedValueOnce(null);
            userRepositoryMock.findById.mockResolvedValueOnce(null);

            await expect(userService.declineFriendship(senderId, receiverId)).rejects.toThrow('Invalid user IDs');

            expect(userRepositoryMock.findById).toHaveBeenCalledWith(senderId);
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(receiverId);

            expect(userRepositoryMock.save).not.toHaveBeenCalled();
        });
    });
});