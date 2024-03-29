import { UserService } from '../../src/application/user.service';
import { UserRepository } from "../../src/domain/user.repository";
import { User, IUser } from '../../src/domain/user';

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

        const email = 'newuser@test.com';
        const firstName = 'Roya';
        const lastName = 'Maleki';
        const birthdate = new Date('1989-05-04');
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

        const email = 'existinguser@test.com';
        const firstName = 'Keyvan';
        const lastName = 'Azizi';
        const birthdate = new Date('2005-01-06');
        const password = 'password123';

        await expect(userService.register(email, firstName, lastName, birthdate, password)).rejects.toThrow('Email is already in use');
        expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(email);
        expect(userRepositoryMock.save).not.toHaveBeenCalled();
    });

    describe('searchUsers', () => {
        const expectedFilteredUserMock= [
            new User({
                email: 'user3@example.com',
                password: 'password3',
                firstName: 'John',
                lastName: 'Doe',
                birthdate: new Date('1997-11-20'),
                friends: [],
                invitations: []
            }),
        ]
        it('should return filtered users based on search criteria', async () => {
            // Mock data
            const userId = 'user123';
            const firstName = 'John';
            const lastName = 'Doe';
            const age = 26;

            userRepositoryMock.getUserByFilter.mockResolvedValueOnce(expectedFilteredUserMock);

            const filteredUsers = await userService.searchUsers(userId, firstName, lastName, age);

            expect(filteredUsers).toHaveLength(1);
            expect(filteredUsers[0].firstName).toBe('John');
            expect(filteredUsers[0].lastName).toBe('Doe');
            expect(filteredUsers[0].age).toBe(26);

            expect(userRepositoryMock.getUserByFilter).toHaveBeenCalledWith(userId,{ firstName, lastName, age });
        });

        it('should return filtered users based on search criteria', async () => {
            const userId = 'user123';
            const firstName = null;
            const lastName = 'Doe';
            const age = 26;

            userRepositoryMock.getUserByFilter.mockResolvedValueOnce(expectedFilteredUserMock);

            const filteredUsers = await userService.searchUsers(userId, firstName, lastName, age);

            expect(filteredUsers).toHaveLength(1);
            expect(filteredUsers[0].firstName).toBe('John');
            expect(filteredUsers[0].lastName).toBe('Doe');
            expect(filteredUsers[0].age).toBe(26);

            expect(userRepositoryMock.getUserByFilter).toHaveBeenCalledWith(userId,{ firstName, lastName, age });
        });

    });

});