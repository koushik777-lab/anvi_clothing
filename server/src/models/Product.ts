import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  fabric?: string;
  sizes: string[];
  inStock: boolean;
  featured: boolean;
  onSale: boolean;
  tags: string[];
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: Number },
    images: [{ type: String }],
    category: { type: String, required: true },
    fabric: { type: String },
    sizes: [{ type: String }],
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    onSale: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true },
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ onSale: 1 });
ProductSchema.index({ slug: 1 }, { unique: true });

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
