import mongoose from "mongoose";

interface UserAttrs {
  email: string;
  password: string;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

let userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

userSchema.statics.build = function (attrs: UserAttrs) {
  return new User(attrs);
};

let User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
