import { UserService } from '../../src/application/user.service';
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

    describe('searchUsers', () => {
        const allUsersExceptFriendsMock: User[] = [
            new User({
                email: 'user1@example.com',
                password: 'password1',
                firstName: 'Alice',
                lastName: 'Smith',
                birthdate: new Date('1995-01-01'),
                friends: [],
                invitations: []
            }),
            new User({
                email: 'user2@example.com',
                password: 'password2',
                firstName: 'Bob',
                lastName: 'Johnson',
                birthdate: new Date('1990-05-15'),
                friends: [],
                invitations: []
            }),
            new User({
                email: 'user3@example.com',
                password: 'password3',
                firstName: 'John',
                lastName: 'Doe',
                birthdate: new Date('1997-11-20'),
                friends: [],
                invitations: []
            }),
        ];
        it('should return filtered users based on search criteria', async () => {
            // Mock data
            const userId = 'user123';
            const firstName = 'John';
            const lastName = 'Doe';
            const age = 26;

            userRepositoryMock.getAllUsersExcludeFriends.mockResolvedValueOnce(allUsersExceptFriendsMock);

            const filteredUsers = await userService.searchUsers(userId, firstName, lastName, age);

            expect(filteredUsers).toHaveLength(1);
            expect(filteredUsers[0].firstName).toBe('John');
            expect(filteredUsers[0].lastName).toBe('Doe');
            expect(filteredUsers[0].age).toBe(26); // Adjust the age based on current date

            expect(userRepositoryMock.getAllUsersExcludeFriends).toHaveBeenCalledWith(userId);
        });

        it('should return filtered users based on search criteria', async () => {
            const userId = 'user123';
            const firstName = null;
            const lastName = 'Doe';
            const age = 26;

            userRepositoryMock.getAllUsersExcludeFriends.mockResolvedValueOnce(allUsersExceptFriendsMock);

            const filteredUsers = await userService.searchUsers(userId, firstName, lastName, age);

            expect(filteredUsers).toHaveLength(1);
            expect(filteredUsers[0].firstName).toBe('John');
            expect(filteredUsers[0].lastName).toBe('Doe');
            expect(filteredUsers[0].age).toBe(26); // Adjust the age based on current date

            expect(userRepositoryMock.getAllUsersExcludeFriends).toHaveBeenCalledWith(userId);
        });

    });

});