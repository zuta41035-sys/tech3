// models/Order.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [{
    name: String,
    price: Number,
    quantity: Number,
    productId: String,
    image: String
  }],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);