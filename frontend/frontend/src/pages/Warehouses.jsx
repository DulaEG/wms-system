import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

function Warehouses() {

  const [warehouses, setWarehouses] = useState([]);

  const fetchWarehouses = async () => {
    try {

      const res = await API.get("/warehouses");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setWarehouses(data);

    } catch (err) {
      console.error("Error fetching warehouses:", err);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (

    <div className="p-6">

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">Warehouses</h1>

        <Link
          to="/warehouses/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Warehouse
        </Link>

      </div>


      {/* Warehouse Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Locations Count</th>
            </tr>
          </thead>

          <tbody>

            {warehouses.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No warehouses found
                </td>
              </tr>
            ) : (

              warehouses.map((w) => (

                <tr key={w.id} className="border-t">

                  <td className="p-3">{w.id}</td>

                  <td className="p-3 font-medium">
                    {w.name}
                  </td>

                  <td className="p-3">
                    {w.location}
                  </td>

                  <td className="p-3">
                    {w.location_count || 0}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );
}

export default Warehouses;