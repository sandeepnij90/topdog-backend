import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  userId: { type: String, required: true },
});

const tokenModel = mongoose.model("Token", tokenSchema);

export default tokenModel;
