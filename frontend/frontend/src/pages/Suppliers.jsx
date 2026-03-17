import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

function Suppliers() {

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    try {
      const res = await API.get("/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const deleteSupplier = async (id) => {

    if (!window.confirm("Delete this supplier?")) return;

    try {

      await API.delete(`/suppliers/${id}`);

      fetchSuppliers();

    } catch (err) {

      alert("Error deleting supplier");

    }

  };

  if (loading) return <p>Loading...</p>;

  return (

    <div>

      {/* HEADER */}

      <div className="flex justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Suppliers
        </h1>

        <Link
          to="/suppliers/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Supplier
        </Link>

      </div>


      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Contact Person</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {suppliers.map((supplier) => (

              <tr key={supplier.id} className="border-t">

                <td className="p-3">{supplier.name}</td>

                <td className="p-3">{supplier.contact_person}</td>

                <td className="p-3">{supplier.phone}</td>

                <td className="p-3">{supplier.email}</td>

                <td className="p-3">

                  <button
                    onClick={() => deleteSupplier(supplier.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default Suppliers;