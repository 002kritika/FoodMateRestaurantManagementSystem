// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const CustomerProfile = () => {
//   const [customer, setCustomer] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCustomerProfile();
//   }, []);

//   const fetchCustomerProfile = async () => {
//     setLoading(true);
//     try {
//       const token = Cookies.get("token");
//       if (!token) throw new Error("Unauthorized: Please log in first.");

//       const response = await axios.get(
//         "http://localhost:5000/api/customer/profile",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );

//       setCustomer(response.data.customer);
//       setOrders(response.data.orders);
//       setCartItems(response.data.cart);
//     } catch (error) {
//       toast.error(error.response?.data || "Error fetching profile");
//       if (error.response?.status === 401) {
//         Cookies.remove("token");
//         navigate("/login");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <p>Loading profile...</p>;
//   if (!customer) return <p className="text-red-500">Profile not found.</p>;

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
//       <h2 className="text-3xl font-bold mb-4">Customer Profile</h2>
//       <div className="bg-white p-6 rounded-lg shadow-md w-96">
//         <p>
//           <strong>Name:</strong> {customer.name || "N/A"}
//         </p>
//         <p>
//           <strong>Email:</strong> {customer.email}
//         </p>
//         <p>
//           <strong>Verified:</strong> {customer.isVerified ? "Yes" : "No"}
//         </p>
//       </div>

//       <h3 className="text-2xl font-bold mt-6">Order History</h3>
//       {orders.length === 0 ? (
//         <p>No orders yet.</p>
//       ) : (
//         <ul className="bg-white p-4 rounded-lg shadow-md w-96">
//           {orders.map((order) => (
//             <li key={order.id} className="mb-2">
//               Order #{order.id} - <strong>{order.menu.name}</strong> - $
//               {order.total}
//             </li>
//           ))}
//         </ul>
//       )}

//       <h3 className="text-2xl font-bold mt-6">Cart Items</h3>
//       {cartItems.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <ul className="bg-white p-4 rounded-lg shadow-md w-96">
//           {cartItems.map((item) => (
//             <li key={item.id} className="flex justify-between">
//               {item.menu.name} - {item.quantity}x
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default CustomerProfile;
