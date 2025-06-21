import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, required: true },
  name: String,
  email: String,
  cartItems: {
    type: Map,
    of: Number,
    default: {},
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
