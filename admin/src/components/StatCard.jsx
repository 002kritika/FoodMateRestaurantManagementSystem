const StatCard = ({ title, value, color }) => (
  <div className={`rounded-xl text-white p-6 shadow-lg ${color}`}>
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-3xl mt-2 font-bold">{value ?? 0}</p>
  </div>
);

export default StatCard;
