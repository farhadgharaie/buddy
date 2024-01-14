import { AuthenticationService } from '../../src/application/authentication.service';
import { UserRepository } from "../../src/domain/user.repository";
import { User, IUser } from '../../src/domain/user';
import { PasswordEncoder } from '../../src/core/encoder';

// A mock for the UserRepository interface
const userRepositoryMock: jest.Mocked<UserRepository> = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    getUserByFilter: jest.fn()
};

// Mock the implementation of the UserRepository methods
jest.mock('../../src/domain/user.repository', () => ({
    UserRepository: jest.fn(() => userRepositoryMock),
}));
jest.mock('../../src/core/encoder');

describe('UserService', () => {
    let authService: AuthenticationService;
    let passwordEncoderMock: jest.Mocked<typeof PasswordEncoder>;
    beforeEach(() => {
        authService = new AuthenticationService(userRepositoryMock);
        passwordEncoderMock = PasswordEncoder as jest.Mocked<typeof PasswordEncoder>;

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
        passwordEncoderMock.comparePasswords.mockResolvedValue(true);

        const loginResult = await authService.login(email, password);

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
        userRepositoryMock.findByEmail.mockResolvedValue(null);
        passwordEncoderMock.comparePasswords.mockResolvedValue(false);

        await expect(authService.login('test@example.com', 'password')).rejects.toThrow('Invalid credentials');
    });
});
