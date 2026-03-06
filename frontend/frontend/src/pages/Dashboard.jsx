import { useEffect, useState } from "react";
import API from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function Dashboard() {

  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  if (!data) return <h2>Loading...</h2>;

  const chartData = [
    { name: "Products", value: data.total_products },
    { name: "Warehouses", value: data.total_warehouses },
    { name: "Stock", value: data.total_stock_quantity },
    { name: "Low Stock", value: data.low_stock_products }
  ];

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-6 mb-8">

        <Card title="Total Products" value={data.total_products} />

        <Card title="Warehouses" value={data.total_warehouses} />

        <Card title="Total Stock" value={data.total_stock_quantity} />

        <Card title="Low Stock" value={data.low_stock_products} />

      </div>

      {/* CHART */}

      <div className="bg-white p-6 rounded-xl shadow mb-8">

        <h2 className="text-xl font-bold mb-4">
          System Overview
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={chartData}>

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="value" />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* RECENT MOVEMENTS */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4">
          Recent Movements
        </h2>

        <table className="w-full text-left">

          <thead>
            <tr className="border-b">
              <th className="py-2">Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>

            {data.recent_movements?.map((item, index) => (

              <tr key={index} className="border-b">

                <td className="py-2">{item.product_name}</td>

                <td>{item.movement_type}</td>

                <td>{item.quantity}</td>

                <td>
                  {new Date(item.created_at).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

function Card({ title, value }) {

  return (

    <div className="bg-white p-6 rounded-xl shadow text-center">

      <h3 className="text-gray-500">{title}</h3>

      <p className="text-3xl font-bold text-blue-600">
        {value}
      </p>

    </div>

  );

}

export default Dashboard;