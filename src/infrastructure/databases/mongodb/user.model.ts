import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export enum FriendshipStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Declined = 'declined',
}

export interface IUser {
  email: string;
  _password: string;
  firstName: string;
  lastName: string;
  birthdate: Date;
  _friends: { user: Types.ObjectId; status: FriendshipStatus }[];
  _invitations: { user: Types.ObjectId; status: FriendshipStatus }[];
}

export interface IUserDocument extends IUser, Document { }

const UserSchema = new Schema<IUserDocument>({
  email: { type: String, required: true, unique: true },
  _password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthdate: { type: Date, required: true },
  _friends: [{ user: { type: Types.ObjectId, ref: 'User' }, status: String }],
  _invitations: [{ user: { type: Types.ObjectId, ref: 'User' }, status: String }],
});

export const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>('User', UserSchema);


