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

    async getInvitations(userId: string): Promise<User[]> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Invalid user ID');
        }

        return user.invitations.map(invitation => invitation.user);
    }

    async inviteFriend(senderId: string, receiverId: string): Promise<void> {
        const sender = await this.userRepository.findById(senderId);
        const receiver = await this.userRepository.findById(receiverId);

        if (!sender || !receiver) {
            throw new Error('Invalid user IDs');
        }

        sender.inviteFriend(receiver);
        await this.userRepository.save(sender);
    }

    async acceptFriendship(userId: string, inviterId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        const inviter = await this.userRepository.findById(inviterId);

        if (!user || !inviter) {
            throw new Error('Invalid user IDs');
        }

        user.acceptFriendship(inviter);
        await this.userRepository.save(user);
    }

    async declineFriendship(userId: string, inviterId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        const inviter = await this.userRepository.findById(inviterId);
    
        if (!user || !inviter) {
          throw new Error('Invalid user IDs');
        }
    
        user.declineFriendship(inviter);
        await this.userRepository.save(user);
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