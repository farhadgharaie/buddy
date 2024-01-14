import { User } from '../domain/user';
import { UserRepository } from '../domain/user.repository';

export class FriendService {
    constructor(private userRepository: UserRepository) { }

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

}