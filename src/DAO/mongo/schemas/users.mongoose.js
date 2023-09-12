import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    firstName: { type: String, required: true, max: 100 },
    lastName: { type: String, required: true, max: 100 },
    email: { type: String, required: true, max: 100, unique: true },
    age: { type: Number, required: false },
    password: { type: String, required: false, max: 100 },
    cartID: { type: String, required: true, unique: true },
    rol: { type: String, default: 'user', required: true },
  },
  { versionKey: false }
);

export const UserMongoose = model('users', schema);
