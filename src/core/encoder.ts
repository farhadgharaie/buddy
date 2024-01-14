import * as bcrypt from 'bcrypt';

export class PasswordEncoder {
    static async encodePassword(password: string) {
        return await bcrypt.hash(password, 10);
    }

    static async comparePasswords(encodedPassword: string, inputPassword: string) {
        return await bcrypt.compare( inputPassword,encodedPassword);
    }
}