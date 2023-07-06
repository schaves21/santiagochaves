import { Schema, model } from "mongoose";

const schema = new Schema({
  firstName: { type: String, required: true, max: 50 },
  lastName: { type: String, required: true, max: 50 },
  email: { type: String, required: true, max: 50, unique: true },
  password: { type: String, required: true, max: 50 },
  age: { type: Number, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
});

export const UserModel = model("users", schema);
