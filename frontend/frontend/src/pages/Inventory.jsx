import { useEffect, useState } from "react";
import axios from "axios";

function Inventory() {

  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/inventory",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setInventory(res.data);

    } catch (error) {
      console.error("Inventory fetch error:", error);
    }

  };

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Inventory
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 mb-4 rounded w-64"
      />

      <div className="bg-white shadow-lg rounded-xl border overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-full table-auto">

            <thead className="bg-gray-100 border-b">
              <tr className="text-left text-sm font-semibold text-gray-700">

                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Warehouse</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Stock Status</th>

              </tr>
            </thead>

            <tbody className="divide-y">

              {inventory
  .filter((item) => {
    const product = item.product ? item.product.toLowerCase() : "";
    const warehouse = item.warehouse ? item.warehouse.toLowerCase() : "";
    const searchText = search ? search.toLowerCase() : "";

    return (
      product.includes(searchText) ||
      warehouse.includes(searchText)
    );
  })
  .map((item) => (

                  <tr key={item.id} className="hover:bg-gray-50">

                    <td className="px-6 py-3">
                      {item.product}
                    </td>

                    <td className="px-6 py-3">
                      {item.warehouse}
                    </td>

                    <td className="px-6 py-3 font-medium">
                      {item.quantity}
                    </td>

                    <td className="px-6 py-3">

                      {item.quantity < 10 ? (

                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                          LOW STOCK
                        </span>

                      ) : (

                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                          OK
                        </span>

                      )}

                    </td>

                  </tr>

                ))}

              {inventory.length === 0 && (

                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No inventory found
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

export default Inventory;