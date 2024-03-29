import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    email: { type: String, required: true },
    token: { type: String, required: true },
    expire: { type: Number, required: true },
  },
  { versionKey: false }
);

export const recoverMongoose = model('recover-tokens', schema);
