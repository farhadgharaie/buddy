import { UserRepository } from '../domain/user.repository';
import { PasswordEncoder } from '../core/encoder'
import { v4 as UUID } from 'uuid';

export class AuthenticationService {
    constructor(private userRepository: UserRepository) { }
    async login(email: string, password: string): Promise<{ token: string, email: string, firstName: string, lastName: string } | null> {
        const user = await this.userRepository.findByEmail(email);
        if (user && await PasswordEncoder.comparePasswords(user.password, password)) {
            const token = UUID();
            return { token, email: user.email, firstName: user.firstName, lastName: user.lastName };
        }

        throw new Error('Invalid credentials');
    }
}