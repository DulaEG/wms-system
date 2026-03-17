import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function CreateReturn() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [returnType, setReturnType] = useState("Customer Return");
  const [product, setProduct] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {

      const p = await API.get("/products");
      const w = await API.get("/warehouses");

      setProducts(Array.isArray(p.data) ? p.data : p.data.data || []);
      setWarehouses(Array.isArray(w.data) ? w.data : w.data.data || []);

    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await API.post("/returns", {
        return_type: returnType,
        product_id: product,
        warehouse_id: warehouse,
        quantity,
        reason
      });

      alert("Return created successfully");
      navigate("/returns");

    } catch (err) {

      console.error(err);
      alert("Error creating return");

    }
  };

  return (
    <div className="flex justify-center items-center p-6">

      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Create Return
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">

          {/* Return Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Return Type
            </label>

            <select
              value={returnType}
              onChange={(e) => setReturnType(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Customer Return</option>
              <option>Damage</option>
              <option>Supplier Return</option>
            </select>
          </div>

          {/* Product */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Product
            </label>

            <select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Product</option>

              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}

            </select>
          </div>

          {/* Warehouse */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Warehouse
            </label>

            <select
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Warehouse</option>

              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}

            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Quantity
            </label>

            <input
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Reason
            </label>

            <input
              type="text"
              placeholder="Enter reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={() => navigate("/returns")}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Return
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateReturn;