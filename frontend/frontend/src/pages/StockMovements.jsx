import { useState, useEffect } from "react";
import API from "../api";

function StockMovements() {

  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    product_id: "",
    warehouse_id: "",
    movement_type: "IN",
    quantity: "",
    reference: ""
  });

  const normalize = (res) =>
    Array.isArray(res.data) ? res.data : res.data.data || [];

  const fetchMovements = async () => {
    try {
      const res = await API.get("/stock/history");
      setMovements(normalize(res));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(normalize(res));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await API.get("/warehouses");
      setWarehouses(normalize(res));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovements();
    fetchProducts();
    fetchWarehouses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/stock", {
        ...form,
        quantity: Number(form.quantity)
      });

      fetchMovements();
      fetchProducts();

      setShowModal(false);

      setForm({
        product_id:"",
        warehouse_id:"",
        movement_type:"IN",
        quantity:"",
        reference:""
      });

      fetchMovements();

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Stock Movements</h1>

        <button
          onClick={()=>setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Record Movement
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl border overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-full table-auto">

            <thead className="bg-gray-100 border-b">

              <tr className="text-left text-sm font-semibold text-gray-700">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Warehouse</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Qty</th>
                <th className="px-6 py-3">Date</th>
              </tr>

            </thead>

            <tbody className="divide-y">

              {movements.map(m => (

                <tr key={m.id} className="hover:bg-gray-50">

                  <td className="px-6 py-3">{m.product_name}</td>
                  <td className="px-6 py-3">{m.warehouse_name}</td>
                  <td className="px-6 py-3">{m.movement_type}</td>
                  <td className="px-6 py-3">{m.quantity}</td>
                  <td className="px-6 py-3">
                    {new Date(m.created_at).toLocaleDateString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {showModal && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl shadow-lg w-96">

            <h2 className="text-xl font-bold mb-4">
              Record Movement
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <select
                className="border p-2 w-full rounded"
                value={form.product_id}
                onChange={(e)=>setForm({...form,product_id:e.target.value})}
                required
              >
                <option value="">Select Product</option>

                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}

              </select>

              <select
                className="border p-2 w-full rounded"
                value={form.warehouse_id}
                onChange={(e)=>setForm({...form,warehouse_id:e.target.value})}
                required
              >
                <option value="">Select Warehouse</option>

                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}

              </select>

              <select
                className="border p-2 w-full rounded"
                value={form.movement_type}
                onChange={(e)=>setForm({...form,movement_type:e.target.value})}
              >
                <option value="IN">Stock IN</option>
                <option value="OUT">Stock OUT</option>
              </select>

              <input
                type="number"
                placeholder="Quantity"
                className="border p-2 w-full rounded"
                value={form.quantity}
                onChange={(e)=>setForm({...form,quantity:e.target.value})}
                required
              />

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
              >
                Save
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default StockMovements;