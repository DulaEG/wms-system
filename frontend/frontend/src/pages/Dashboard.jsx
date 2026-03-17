import { useEffect, useState, useRef } from "react";
import API from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Dashboard() {

  const [data, setData] = useState(null);
  const dashboardRef = useRef();

  useEffect(() => {
    API.get("/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  // 🔹 BETTER LOADING UI
  if (!data) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  const chartData = [
    { name: "Products", value: data.total_products },
    { name: "Warehouses", value: data.total_warehouses },
    { name: "Stock", value: data.total_stock_quantity },
    { name: "Low Stock", value: data.low_stock_products }
  ];

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

  const downloadPDF = async () => {
    const element = dashboardRef.current;

    const canvas = await html2canvas(element, { scale: 2 }); // better quality
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save("dashboard-report.pdf");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>

        <button
          onClick={downloadPDF}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg shadow"
        >
          Download Report
        </button>

      </div>

      <div ref={dashboardRef}>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <Card title="Total Products" value={data.total_products} />

          <Card title="Warehouses" value={data.total_warehouses} />

          <Card title="Total Stock" value={data.total_stock_quantity} />

          <Card title="Low Stock" value={data.low_stock_products} />

        </div>

        {/* CHART */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">

          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            System Overview
          </h2>

          <ResponsiveContainer width="100%" height={280}>

            <BarChart data={chartData}>

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="value" radius={[6, 6, 0, 0]}>

                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}

              </Bar>

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* TABLE */}
        <div className="bg-white p-6 rounded-xl shadow-md">

          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Recent Movements
          </h2>

          {data.recent_movements?.length === 0 ? (
            <p className="text-gray-500">No recent movements</p>
          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-sm text-left border-collapse">

                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600">
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>

                <tbody>

                  {data.recent_movements?.map((item, index) => (

                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition"
                    >

                      <td className="px-4 py-2 font-medium text-gray-700">
                        {item.product_name}
                      </td>

                      <td className="px-4 py-2">
                        {item.movement_type}
                      </td>

                      <td className="px-4 py-2">
                        {item.quantity}
                      </td>

                      <td className="px-4 py-2 text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

// 🔹 CARD COMPONENT (POLISHED)
function Card({ title, value }) {

  return (

    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">

      <h3 className="text-gray-500 text-sm mb-2">
        {title}
      </h3>

      <p className="text-3xl font-bold text-blue-600">
        {value}
      </p>

    </div>

  );

}

export default Dashboard;