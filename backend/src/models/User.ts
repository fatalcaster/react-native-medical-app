import { Schema, model, Document, Model } from "mongoose";
import { Permissions } from "../interfaces/interfaces";

export interface UserProps {
  email: string;
  password: string;
  permission?: Permissions;
}

export interface UserDoc extends Document {
  id: string;
  email: string;
  password: string;
  permission: Permissions;
}

interface UserModel extends Model<UserDoc> {
  build(attrs: UserProps): UserDoc;
}

const userSchema = new Schema<UserDoc>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    permission: {
      type: String,
      enum: Permissions,
      required: true,
      default: Permissions.Basic,
    },
  },
  {
    toJSON: {
      transform(_doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    toObject: {
      transform(_doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserProps) => {
  return new User(attrs);
};

const User = model<UserDoc, UserModel>("User", userSchema);

export { User };
