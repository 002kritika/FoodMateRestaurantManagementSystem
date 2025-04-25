import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const OrderChart = ({ data }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h2 className="text-xl font-semibold mb-4">Orders Overview</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#34d399"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default OrderChart;
