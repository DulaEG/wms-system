import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

function Returns() {

  const [returns, setReturns] = useState([]);

  const fetchReturns = async () => {
    const res = await API.get("/returns");
    setReturns(res.data);
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Returns</h1>

        <Link
          to="/returns/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Return
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full table-auto text-sm">

          {/* Table Header */}
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>

            {returns.map((r) => (
              <tr
                key={r.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-3">{r.id}</td>

                <td className="px-4 py-3">
  {r.return_type === "Damage" && (
    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
      Damage
    </span>
  )}

  {r.return_type === "Customer Return" && (
    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
      Customer
    </span>
  )}

  {r.return_type === "Supplier Return" && (
    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
      Supplier
    </span>
  )}
</td>

                <td className="px-4 py-3">
                  {r.product}
                </td>

                <td className="px-4 py-3 text-center font-medium">
                  {r.quantity}
                </td>

                <td className="px-4 py-3">
                  {r.reason}
                </td>

                <td className="px-4 py-3">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Returns;