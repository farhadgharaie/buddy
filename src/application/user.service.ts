import { User } from '../domain/user';
import { UserRepository } from '../domain/user.repository';
import { PasswordEncoder } from '../core/encoder'

export class UserService {
    constructor(private userRepository: UserRepository) { }
    async register(email: string, firstName: string, lastName: string, birthdate: Date, password: string): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw new Error('Email is already in use');
        }
        const hashPassword = await PasswordEncoder.encodePassword(password)
        const user = new User({ email, password: hashPassword, firstName, lastName, birthdate, friends: [], invitations: [] });
        return await this.userRepository.save(user);
    }

    async searchUsers(userId: string, firstName: string | null, lastName: string | null, age: number | null): Promise<User[]> {
        return await this.userRepository.getUserByFilter(userId, { firstName, lastName, age });
    }

}