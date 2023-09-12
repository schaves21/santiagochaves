import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    purchase_datetime: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'products' },
        quantity: { type: Number, required: true },
        _id: false,
      },
    ],
  },
  { versionKey: false }
);

export const ticketMongoose = model('tickets', schema);
