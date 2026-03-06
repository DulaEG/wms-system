import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function CreateSalesOrder() {

  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customerId, setCustomerId] = useState("");

  const [items, setItems] = useState([
    {
      product_id: "",
      warehouse_id: "",
      location_id: "",
      quantity: 1
    }
  ]);

  // LOAD DATA
  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchCustomers = async () => {
    const res = await API.get("/customers");
    setCustomers(res.data);
  };

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  // ADD ITEM ROW
  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: "",
        warehouse_id: "",
        location_id: "",
        quantity: 1
      }
    ]);
  };

  // UPDATE ITEM
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // CREATE ORDER
  const createOrder = async (e) => {
    e.preventDefault();

    try {

      await API.post("/sales-orders", {
        customer_id: customerId,
        items: items
      });

      alert("Sales Order Created");

      navigate("/sales-orders");

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Create Sales Order
      </h1>

      <form onSubmit={createOrder} className="space-y-6">

        {/* CUSTOMER */}

        <div>
          <label className="block mb-2 font-semibold">
            Customer
          </label>

          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select Customer</option>

            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}

          </select>
        </div>

        {/* ITEMS */}

        <div>

          <h2 className="text-xl font-semibold mb-4">
            Order Items
          </h2>

          {items.map((item, index) => (

            <div
              key={index}
              className="grid grid-cols-4 gap-3 mb-3"
            >

              <select
                className="border p-2"
                value={item.product_id}
                onChange={(e) =>
                  updateItem(index, "product_id", e.target.value)
                }
                required
              >
                <option value="">Product</option>

                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}

              </select>

              <input
                type="number"
                placeholder="Warehouse ID"
                className="border p-2"
                value={item.warehouse_id}
                onChange={(e) =>
                  updateItem(index, "warehouse_id", e.target.value)
                }
                required
              />

              <input
                type="number"
                placeholder="Location ID"
                className="border p-2"
                value={item.location_id}
                onChange={(e) =>
                  updateItem(index, "location_id", e.target.value)
                }
                required
              />

              <input
                type="number"
                placeholder="Qty"
                className="border p-2"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(index, "quantity", e.target.value)
                }
                required
              />

            </div>

          ))}

          <button
            type="button"
            onClick={addItem}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            + Add Item
          </button>

        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-5 py-2 rounded"
        >
          Create Order
        </button>

      </form>

    </div>
  );
}

export default CreateSalesOrder;