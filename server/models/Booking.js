import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema({
  product: { type: ObjectId, ref: "Product", required: true },
  user: { type: ObjectId, ref: "User", required: true },
  owner: { type: ObjectId, ref: "User", required: true },

  rentalStartDate: { type: Date, required: true },
  rentalEndDate: { type: Date, required: true },

  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },

  price: { type: Number, required: true },

  // PAYMENT FIELDS
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },

  transactionId: {
    type: String,
  },

  paidAt: {
    type: Date,
  }

}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
