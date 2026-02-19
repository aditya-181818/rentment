import Booking from "../models/Booking.js";

export const dummyPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    // Only booking owner (user) can pay
    if (booking.user.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized payment attempt" });
    }

    // Prevent double payment
    if (booking.paymentStatus === "paid") {
      return res.json({ success: false, message: "Booking already paid" });
    }

    // Dummy payment success
    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    booking.transactionId = "DUMMY_TXN_" + Date.now();
    booking.paidAt = new Date();

    await booking.save();

    res.json({
      success: true,
      message: "Payment successful",
      transactionId: booking.transactionId,
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
