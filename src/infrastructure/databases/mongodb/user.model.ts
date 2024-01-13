import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export enum FriendshipStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Declined = 'declined',
}

export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthdate: Date;
  friends: { user: Types.ObjectId; status: FriendshipStatus }[];
  invitations: { user: Types.ObjectId; status: FriendshipStatus }[];
}

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthdate: { type: Date, required: true },
  friends: [{ user: { type: Types.ObjectId, ref: 'User' }, status: String }],
  invitations: [{ user: { type: Types.ObjectId, ref: 'User' }, status: String }],
});

export const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>('User', UserSchema);


