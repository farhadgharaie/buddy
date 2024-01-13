import { User } from '../domain/user';
import { UserRepository } from '../domain/user.repository';

export class UserService {
    constructor(private userRepository: UserRepository) { }
    async register(email: string, firstName: string, lastName: string, birthdate: Date, password: string): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw new Error('Email is already in use');
        }

        const user = new User({ email, password, firstName, lastName, birthdate, friends: [], invitations: [] });
        return await this.userRepository.save(user);
    }

    async searchUsers(userId: string, firstName: string | null, lastName: string | null, age: number | null): Promise<User[]> {
        const allUsersExceptFriends = await this.userRepository.getAllUsersExcludeFriends(userId);

        return allUsersExceptFriends.filter((user) => {
            const matchFirstName = firstName ? user.firstName.includes(firstName) : true;
            const matchLastName = lastName ? user.lastName.includes(lastName) : true;
            const matchAge = age ? user.age === age : true;

            return matchFirstName && matchLastName && matchAge;
        });
    }

}