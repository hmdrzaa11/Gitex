import mongoose from "mongoose";
import { Password } from "../services/password";

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

userSchema.pre("save", async function (done) {
  //check to see if password is modified
  if (this.isModified("password")) {
    let hashes = await Password.toHash(this.get("password"));
    this.set("password", hashes);
  }
  done();
});

let User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
