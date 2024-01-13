// src/infrastructure/mongodb/user.repository.ts
import { UserRepository } from '../../../domain/user.repository';
import { User, IUser } from '../../../domain/user';
import { UserModel } from './user.model';

export class MongoDBUserRepository implements UserRepository {
    async save(user: User): Promise<User> {
        const savedUser = await UserModel.create(user);
        return new User(savedUser.toObject());
      }
    
      async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email }).populate('friends.user').populate('invitations.user');
        return user ? new User(user.toObject()) : null;
      }
    
      async findById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id).populate('friends.user').populate('invitations.user');
        return user ? new User(user.toObject()) : null;
      }
    
      async getAllUsersExcludeFriends(userId: string): Promise<User[]> {
        const user = await this.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
    
        // Assuming friends are stored as references in the friends array
        const friendIds = user.friends.map((friend) => friend.user);
    
        const users = await UserModel.find({ _id: { $nin: [...friendIds, userId] } }).populate('friends.user').populate('invitations.user');
        return users.map((u) => new User(u.toObject()));
      }
}
