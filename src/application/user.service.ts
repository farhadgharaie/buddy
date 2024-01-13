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
    async login(email: string, password: string): Promise<{ token: string, email: string, firstName: string, lastName: string } | null> {
        const user = await this.userRepository.findByEmail(email);

        if (user && user.isValidPassword(password)) {
            const token = 'your_generated_token';
            return { token, email: user.email, firstName: user.firstName, lastName: user.lastName };
        }

        throw new Error('Invalid credentials');
    }

    async getInvitations(userId: string): Promise<User[]> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Invalid user ID');
        }

        return user.invitations.map(invitation => invitation.user);
    }

}