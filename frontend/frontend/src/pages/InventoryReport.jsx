import { useEffect, useState } from "react";
import API from "../api";

function InventoryReport() {

  const [data, setData] = useState([]);

  const fetchReport = async () => {
    const res = await API.get("/inventory/report");
    setData(res.data);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Inventory Report
      </h1>

      <table className="w-full bg-white shadow rounded">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Warehouse</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Quantity</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t">
              <td className="p-3">{row.product}</td>
              <td className="p-3">{row.warehouse}</td>
              <td className="p-3">{row.location}</td>
              <td className="p-3">{row.quantity}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default InventoryReport;