import mongoose, { Schema } from 'mongoose';

const ProductLogSchema = new Schema(
  {
    pid: { type: Schema.Types.ObjectId, ref: 'Product' },
    uid: { type: Schema.Types.ObjectId, ref: 'User' },
    quantity: {type: Number },
    status: {type: Boolean },
  },
  {
    timestamps: true,
    collection: 'product_logs'
  }
);

export const ProductLogModel = mongoose.model('ProductLog', ProductLogSchema);
export default ProductLogModel;
