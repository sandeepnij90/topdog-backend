import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String, required: true },
  refreshToken: { type: String },
  verified: { type: Boolean, default: false },
  verificationCode: { type: String, required: true },
});

const userModel = mongoose.model("User", UserSchema);

export default userModel;
