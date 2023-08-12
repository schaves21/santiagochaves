import { Schema, model } from 'mongoose';

const schema = new Schema({
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'products',
          required: true,
        },
        quantity: { type: Number, required: true, min: 1, default: 1 },
      },
    ],
    default: [],
  },
});

export const cartMongoose = model('carts', schema);
