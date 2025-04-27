import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const transactionUuid = queryParams.get("transaction_uuid");
  const orderId = queryParams.get("orderId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("Processing...");
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/payment/order-details`,
          {
            params: { transaction_uuid: transactionUuid, orderId },
          }
        );

        if (res.data && res.data.order) {
          setPaymentStatus("✅ Payment successful!");
          setOrderDetails(res.data.order);

          localStorage.removeItem("cart");
        } else {
          throw new Error("Order details not found");
        }
      } catch (err) {
        console.error("❌ Error fetching order details:", err);
        setError("There was an error fetching your order details.");
      } finally {
        setLoading(false);
      }
    };

    if (transactionUuid || orderId) {
      fetchOrderDetails();
    } else {
      setError("Missing transaction UUID or order ID.");
      setLoading(false);
    }
  }, [transactionUuid, orderId]);

  if (!orderDetails) {
    return null; // or show a fallback if needed
  }

  // Calculate correct total based on order type
  const calculateTotalAmount = () => {
    const subtotal = orderDetails.subtotal || 0;
    const deliveryCharge =
      orderDetails.orderType === "DELIVERY"
        ? orderDetails.deliveryCharge || 0
        : 0;

    return subtotal + deliveryCharge;
  };

  const correctedTotalAmount = calculateTotalAmount();

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-green-200">
        <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">
          🎉 Payment Successful!
        </h1>

        {loading && (
          <p className="text-blue-500 text-center text-lg animate-pulse">
            Processing your payment...
          </p>
        )}

        {error && (
          <p className="text-red-500 text-center text-lg">❌ Error: {error}</p>
        )}

        {!loading && !error && orderDetails && (
          <>
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6">
              <p className="font-semibold">{paymentStatus}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                <p className="text-gray-600">
                  <strong>Transaction UUID:</strong>
                  <br />
                  <span className="break-all text-sm text-gray-800">
                    {transactionUuid}
                  </span>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                <p className="text-gray-600">
                  <strong>Order ID:</strong> {orderDetails.id}
                </p>
                <p className="text-gray-600">
                  <strong>Status:</strong> {orderDetails.status}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                <p className="text-gray-600">
                  <strong>Payment Method:</strong> {orderDetails.paymentMethod}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md shadow-sm space-y-2">
                <p className="text-gray-600">
                  <strong>Order Type:</strong> {orderDetails.orderType}
                </p>

                <p className="text-gray-600">
                  <strong>Subtotal:</strong> Rs.{orderDetails.subtotal}
                </p>

                {/* Show delivery charge only if delivery order */}
                {orderDetails.orderType === "DELIVERY" && (
                  <p className="text-gray-600">
                    <strong>Delivery Charge:</strong> Rs.
                    {orderDetails.deliveryCharge}
                  </p>
                )}

                <p className="text-gray-800 font-bold">
                  <strong>Total Amount:</strong> Rs.{correctedTotalAmount}
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate("/customer")}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Success;
