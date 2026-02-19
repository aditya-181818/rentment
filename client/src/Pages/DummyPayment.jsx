import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const DummyPayment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { axios } = useAppContext();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const amount = query.get("amount");

  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState("card");

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // UPI field
  const [upiId, setUpiId] = useState("");

  // EXPIRY CHECK FUNCTION
  const isCardExpired = (expiry) => {
    const [month, year] = expiry.split("/").map(Number);
    const expiryDate = new Date(year, month); // expires end of month
    const today = new Date();
    return expiryDate <= today;
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    // VALIDATIONS
    if (paymentMode === "card") {
      if (!/^\d{16}$/.test(cardNumber)) {
        return toast.error("Card number must be exactly 16 digits");
      }

      if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(expiry)) {
        return toast.error("Expiry must be in MM/YYYY format");
      }

      if (isCardExpired(expiry)) {
        return toast.error("Card is expired");
      }

      if (!/^\d{3}$/.test(cvv)) {
        return toast.error("CVV must be exactly 3 digits");
      }
    }

    if (paymentMode === "upi") {
      if (!upiId || !upiId.includes("@")) {
        return toast.error("Enter a valid UPI ID (example@upi)");
      }
    }

    setLoading(true);

    try {
      const { data } = await axios.post("/api/payment/dummy", {
        bookingId,
        paymentMode,
      });

      if (data.success) {
        toast.success("Payment Successful");
        navigate("/my-bookings");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden mt-6 mb-6">

        {/* Header */}
        <div className="bg-primary text-white p-5">
          <h2 className="text-xl font-semibold">Secure Payment</h2>
          <p className="text-sm opacity-90">Payment Gateway</p>
        </div>

        <form onSubmit={handlePayment} className="p-6 space-y-4">

          {/* Amount */}
          <div className="border rounded-lg p-4 flex justify-between items-center bg-gray-50">
            <p className="text-gray-600 text-sm">Amount to Pay</p>
            <p className="text-lg font-semibold text-primary">₹ {amount}</p>
          </div>

          {/* Payment Mode Selector */}
          <div className="flex border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setPaymentMode("card")}
              className={`w-1/2 py-2 text-sm font-medium ${
                paymentMode === "card"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              Credit / Debit Card
            </button>

            <button
              type="button"
              onClick={() => setPaymentMode("upi")}
              className={`w-1/2 py-2 text-sm font-medium ${
                paymentMode === "upi"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              UPI
            </button>
          </div>

          {/* CARD PAYMENT */}
          {paymentMode === "card" && (
            <>
              <div>
                <label className="text-sm text-gray-600">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(
                      e.target.value.replace(/\D/g, "").slice(0, 16)
                    )
                  }
                  placeholder="1111 2222 3333 4444"
                  required
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Card Holder Name</label>
                <input
                  type="text"
                  required
                  className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-sm text-gray-600">
                    Expiry 
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YYYY"
                    required
                    className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div className="w-1/2">
                  <label className="text-sm text-gray-600">CVV</label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                    }
                    placeholder="***"
                    required
                    className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* UPI PAYMENT */}
          {paymentMode === "upi" && (
            <div>
              <label className="text-sm text-gray-600">UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@upi"
                required
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          )}

          {/* Pay Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-70"
          >
            {loading ? "Processing..." : "Pay Securely"}
          </button>

          <p className="text-xs text-center text-gray-400 mt-3">
            🔒 This is a mock payment gateway for demo purposes
          </p>
        </form>
      </div>
    </div>
  );
};

export default DummyPayment;
