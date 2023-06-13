import { Schema, model } from "mongoose";

export const cartModel = model(
  "carts",
  new Schema({
    quantity: { type: Number, required: true },
    products: {
      type: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: "products",
          },
        },
      ],
      default: [],
    },
  })
);
