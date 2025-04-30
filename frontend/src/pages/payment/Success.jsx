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
    return null;
  }

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-3xl w-full animate-fade-in">
        <h1 className="text-4xl font-extrabold text-red-600 text-center mb-8">
          🎉 Payment Successful!
        </h1>

        {loading && (
          <div className="flex justify-center">
            <p className="text-red-400 text-lg animate-pulse">
              Processing your payment...
            </p>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <p className="text-red-600 text-lg font-semibold">❌ {error}</p>
          </div>
        )}

        {!loading && !error && orderDetails && (
          <>
            <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg text-center mb-8 font-medium">
              {paymentStatus}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InfoCard title="Transaction UUID" value={transactionUuid} />
                <InfoCard title="Order ID" value={orderDetails.id} />
                <InfoCard title="Status" value={orderDetails.status} />
              </div>

              <div className="space-y-4">
                <InfoCard
                  title="Payment Method"
                  value={orderDetails.paymentMethod}
                />
                <InfoCard title="Order Type" value={orderDetails.orderType} />
                <InfoCard
                  title="Subtotal"
                  value={`Rs.${orderDetails.subtotal}`}
                />
                {orderDetails.orderType === "DELIVERY" && (
                  <InfoCard
                    title="Delivery Charge"
                    value={`Rs.${orderDetails.deliveryCharge}`}
                  />
                )}
                <InfoCard
                  title="Total Amount"
                  value={`Rs.${correctedTotalAmount}`}
                  highlight
                />
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button
                onClick={() => navigate("/customer")}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300"
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

// Reusable card component
const InfoCard = ({ title, value, highlight = false }) => (
  <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
    <p className="text-sm text-gray-500">{title}</p>
    <p
      className={`mt-1 break-words ${
        highlight
          ? "text-lg font-bold text-red-600"
          : "text-base font-semibold text-gray-800"
      }`}
    >
      {value}
    </p>
  </div>
);

export default Success;
