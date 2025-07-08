export default function MetricCard({ title, value }) {
    return (
      <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
        <h4 className="text-sm text-gray-500">{title}</h4>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    );
  }
  