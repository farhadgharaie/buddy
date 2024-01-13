import { UserService } from '../../src/application/user.service';
import { UserRepository } from "../../src/domain/user.repository";
import { User } from '../../src/domain/user';

// Create a mock for the UserRepository interface
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

    it('should register a new user', async () => {
        userRepositoryMock.findByEmail.mockResolvedValueOnce(null);
        userRepositoryMock.save.mockImplementationOnce((user) => Promise.resolve(user));

        const email = 'newuser@example.com';
        const firstName = 'John';
        const lastName = 'Doe';
        const birthdate = new Date('1990-01-01');
        const password = 'password123';

        const registeredUser = await userService.register(email, firstName, lastName, birthdate, password);

        expect(registeredUser).toBeDefined();
        expect(registeredUser.email).toBe(email);
        expect(registeredUser.firstName).toBe(firstName);
        expect(registeredUser.lastName).toBe(lastName);
        expect(registeredUser.birthdate).toBe(birthdate);

        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
        expect(userRepositoryMock.save).toHaveBeenCalledWith(expect.any(User));
    });

    it('should throw an error for duplicate email during registration', async () => {
        userRepositoryMock.findByEmail.mockResolvedValueOnce({} as User);

        const email = 'existinguser@example.com';
        const firstName = 'Jane';
        const lastName = 'Doe';
        const birthdate = new Date('1995-01-01');
        const password = 'password123';

        await expect(userService.register(email, firstName, lastName, birthdate, password)).rejects.toThrow('Email is already in use');

        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
        expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });
});