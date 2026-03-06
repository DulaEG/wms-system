import { useEffect, useState } from "react";
import axios from "axios";

function Inventory() {

  const [inventory, setInventory] = useState([]);

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
      console.error(error);
    }

  };

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">Inventory</h1>

      <table className="w-full border bg-white">

        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Product</th>
            <th className="p-2">Warehouse</th>
            <th className="p-2">Quantity</th>
          </tr>
        </thead>

        <tbody>

          {inventory.map((item) => (

            <tr key={item.id} className="border-t">

              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.warehouse}</td>
              <td className="p-2">{item.quantity}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default Inventory;