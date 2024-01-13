import { UserService as AuthenticationService } from '../../src/application/authentication.service';
import { UserRepository } from "../../src/domain/user.repository";
import { User, IUser } from '../../src/domain/user';

// A mock for the UserRepository interface
const userRepositoryMock: jest.Mocked<UserRepository> = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    getAllUsersExcludeFriends: jest.fn()
};

// Mock the implementation of the UserRepository methods
jest.mock('../../src/domain/user.repository', () => ({
    UserRepository: jest.fn(() => userRepositoryMock),
}));

describe('UserService', () => {
    let userService: AuthenticationService;

    beforeEach(() => {
        userService = new AuthenticationService(userRepositoryMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should login with valid credentials', async () => {
        const email = 'user@test.com';
        const password = 'validPassword';

        const mockUser: IUser = {
            email,
            password: 'validPassword', // Omitted for security reasons
            firstName: 'Patric',
            lastName: 'Askari',
            birthdate: new Date('1980-03-07'),
            friends: [],
            invitations: [],
        };

        const userInstance = new User(mockUser);

        userRepositoryMock.findByEmail.mockResolvedValueOnce(userInstance);

        const loginResult = await userService.login(email, password);

        // Expectations
        expect(loginResult).toEqual({
            token: expect.any(String),
            email: mockUser.email,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName
        });

        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should throw an error for invalid credentials', async () => {
        const email = 'user@test.com';
        const password = 'invalidpassword';
        const mockUser: IUser = {
            email,
            password: 'hashedpassword', // Omitted for security reasons
            firstName: 'Ali',
            lastName: 'Moradi',
            birthdate: new Date('1993-01-01'),
            friends: [],
            invitations: [],
        };

        const userInstance = new User(mockUser);
        userRepositoryMock.findByEmail.mockResolvedValueOnce(userInstance);

        jest.spyOn(userInstance, 'isValidPassword').mockReturnValue(false);

        await expect(userService.login(email, password)).rejects.toThrow('Invalid credentials');
        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
        expect(userInstance.isValidPassword).toHaveBeenCalledWith(password);
    });
});