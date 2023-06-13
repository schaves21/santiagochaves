import { Schema, model } from "mongoose";

export const productModel = model(
  "products",
  new Schema({
    title: { type: String, required: true, max: 50 },
    description: { type: String, required: true, max: 100 },
    code: { type: String, required: true, max: 30 },
    price: { type: Number, required: true },
    status: { type: Boolean, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true, max: 30 },
    thumbnail: { type: Array, required: true },
  })
);
