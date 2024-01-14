// src/infrastructure/mongodb/user.repository.ts
import { UserRepository, IUserFilter } from '../../../domain/user.repository';
import { User } from '../../../domain/user';
import { UserModel } from './user.model';

export class MongoDBUserRepository implements UserRepository {
  async save(user: User): Promise<User> {
    const savedUser = await UserModel.create(user);
    return new User(savedUser.toObject());
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email })
    return user ? new User(user.toObject()) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user ? new User(user.toObject()) : null;
  }

  async getUserByFilter(userId: string, userFilter: IUserFilter): Promise<User[]> {
    const user = await this.findById(userId);
    console.log('user', user)
    if (!user) {
      throw new Error('User not found');
    }
    const filter: any = {};

    if (userFilter.firstName) {
      filter.firstName = { $regex: new RegExp(userFilter.firstName, 'i') };
    }

    if (userFilter.lastName) {
      filter.lastName = { $regex: new RegExp(userFilter.lastName, 'i') };
    }

    if (userFilter.age) {
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear() - userFilter.age, currentDate.getMonth(), currentDate.getDate());
      const endDate = new Date(currentDate.getFullYear() - userFilter.age - 1, currentDate.getMonth(), currentDate.getDate());

      filter.birthdate = { $gte: endDate, $lt: startDate };
    }
    const users = await UserModel.find({ $and: [{ _id: { $nin: [userId] } }, filter] })
    return users.map((u) => new User(u.toObject()));
  }
}
