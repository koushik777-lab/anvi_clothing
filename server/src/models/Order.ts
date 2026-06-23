import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: IOrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: "cod" | "upi";
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  notes?: string;
  sessionId: string;
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    address: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cod", "upi"], required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    notes: { type: String },
    sessionId: { type: String, required: true },
  },
  { timestamps: true }
);

OrderSchema.index({ sessionId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
