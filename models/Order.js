import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },

  orderId: {
    type: String,
    unique: true,
    default: function () {
      return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    },
  },

  products: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
      totalPrice: { type: Number, required: true, min: 0 },
    },
  ],

  totalAmount: { type: Number, required: true, min: 0 },

  address: {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String, default: 'Cambodia' },
  },

  paymentMethod: {
    type: String,
    enum: ['COD', 'card', 'paypal', 'bank_transfer'],
    default: 'COD',
  },

  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },

  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },

  orderDate: { type: Date, default: Date.now },

  estimatedDelivery: { type: Date },

  notes: { type: String },

  createdAt: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook
OrderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  this.products.forEach(product => {
    product.totalPrice = product.price * product.quantity;
  });

  if (!this.estimatedDelivery) {
    this.estimatedDelivery = new Date(this.orderDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  }

  next();
});

// Pre-update hook
OrderSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
