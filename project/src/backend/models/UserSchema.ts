import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface UserDocument extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    authMethod: 'local' | 'google';
}

export interface UserModel extends Model<UserDocument> {}

const userSchema = new Schema<UserDocument>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    authMethod: { type: String, enum: ['local', 'google'], default: 'local' },
});

const User: UserModel = mongoose.model<UserDocument, UserModel>('User', userSchema);
export default User;
