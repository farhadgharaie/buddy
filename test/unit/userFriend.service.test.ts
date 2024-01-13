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
            const userId = 'user1';
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
        // Add test cases for inviteFriend
    });

    describe('acceptFriendship', () => {
        // Add test cases for acceptFriendship
    });

    describe('declineFriendship', () => {
        // Add test cases for declineFriendship
    });
});