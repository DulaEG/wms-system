import { useEffect, useState } from "react";
import API from "../api";

function InventoryReport() {

  const [data, setData] = useState([]);

  const fetchReport = async () => {
    try {
      const res = await API.get("/inventory/report");
      setData(res.data);
    } catch (error) {
      console.error("Report fetch error:", error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Inventory Report
      </h1>

      <div className="bg-white shadow-lg rounded-xl border overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-full table-auto">

            <thead className="bg-gray-100 border-b">

              <tr className="text-left text-sm font-semibold text-gray-700">

                <th className="px-6 py-3">Product</th>

                <th className="px-6 py-3">Warehouse</th>

                <th className="px-6 py-3">Location</th>

                <th className="px-6 py-3">Quantity</th>

              </tr>

            </thead>

            <tbody className="divide-y">

              {data.map((row, i) => (

                <tr key={i} className="hover:bg-gray-50">

                  <td className="px-6 py-3">
                    {row.product}
                  </td>

                  <td className="px-6 py-3">
                    {row.warehouse}
                  </td>

                  <td className="px-6 py-3">
                    {row.location}
                  </td>

                  <td className="px-6 py-3">
                    {row.quantity}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}

export default InventoryReport;