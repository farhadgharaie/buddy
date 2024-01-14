import { User } from './user';
export interface IUserFilter {
  firstName: string | null;
  lastName: string | null;
  age: number | null;
}
export interface UserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  getUserByFilter(userId: string, userFilter: IUserFilter): Promise<User[]>;

}