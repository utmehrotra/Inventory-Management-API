import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String },
    price: { type: Number },
    quantity: {type: Number, default: 0 },
    status: {type: Boolean, default: true }
  },
  {
    timestamps: true,
    collection: 'products'
  }
);

export const ProductModel = mongoose.model('Product', ProductSchema);
export default ProductModel;
