const RecentOrder = ({ orders }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
    <ul className="divide-y">
      {orders.map((order) => (
        <li key={order.id} className="py-2 flex justify-between">
          <span>
            #{order.id} - {order.status}
          </span>
          <span className="text-sm text-gray-600">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export default RecentOrder;
