import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const schema = new Schema({
  title: { type: String, required: true, max: 50, unique: true },
  description: { type: String, required: true, max: 100 },
  code: { type: String, required: true, max: 30 },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true, default: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true, max: 30 },
  thumbnail: { type: Array, required: true },
});

schema.plugin(mongoosePaginate);
export const productMongoose = model("products", schema);
