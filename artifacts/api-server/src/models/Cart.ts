import mongoose, { Document, Schema } from "mongoose";

export interface ICartItem {
  _id: mongoose.Types.ObjectId;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
}

export interface ICart extends Document {
  sessionId: string;
  items: ICartItem[];
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String, required: true },
});

const CartSchema = new Schema<ICart>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    items: [CartItemSchema],
  },
  { timestamps: true },
);

export const Cart = mongoose.model<ICart>("Cart", CartSchema);
