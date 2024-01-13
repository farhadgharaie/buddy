import { User } from '../domain/user';
import { UserRepository } from '../domain/user.repository';

export class UserService {
    constructor(private userRepository: UserRepository) { }
    async login(email: string, password: string): Promise<{ token: string, email: string, firstName: string, lastName: string } | null> {
        const user = await this.userRepository.findByEmail(email);

        if (user && user.isValidPassword(password)) {
            const token = 'your_generated_token';
            return { token, email: user.email, firstName: user.firstName, lastName: user.lastName };
        }

        throw new Error('Invalid credentials');
    }
}