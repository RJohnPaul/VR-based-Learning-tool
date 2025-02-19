import mongoose, { Schema, Document } from "mongoose";

interface IProfile extends Document {
  email: string;
  name?: string;
  age?: string;
  gender?: string;
  disorder?: string;
  mobile?: string;
  avatar?: string;
}

const ProfileSchema = new Schema<IProfile>({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  age: { type: String },
  gender: { type: String },
  disorder: { type: String },
  mobile: { type: String },
  avatar: { type: String },
});

const Profile = mongoose.model<IProfile>("Profile", ProfileSchema);

export default Profile;
export { IProfile };
