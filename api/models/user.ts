import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String },
  refreshToken: { type: String },
});

const userModel = mongoose.model("User", UserSchema);

export default userModel;
