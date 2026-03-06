import { useEffect, useState } from "react";
import API from "../api";

function Customers() {

  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");

  const fetchCustomers = async () => {
    const res = await API.get("/customers");
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const addCustomer = async () => {
    await API.post("/customers", { name });
    setName("");
    fetchCustomers();
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">Customers</h1>

      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Customer name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={addCustomer}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">

        {customers.map((c) => (
          <div
            key={c.id}
            className="border-b p-3"
          >
            {c.name}
          </div>
        ))}

      </div>

    </div>
  );
}

export default Customers;