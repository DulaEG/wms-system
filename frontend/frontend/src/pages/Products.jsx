import { useState, useEffect } from "react";
import API from "../api";

function Products() {

  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    description: "",
    quantity: "",
    warehouse_id: ""
  });

  const itemsPerPage = 8;
  const [page] = useState(1);

  /* ================= FETCH PRODUCTS ================= */

  const fetchProducts = async () => {
    try {

      const res = await API.get("/products");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setProducts(data);

    } catch (err) {
      console.error("Product error:", err.response?.data || err);
    }
  };

  /* ================= FETCH WAREHOUSES ================= */

  const fetchWarehouses = async () => {
    try {

      const res = await API.get("/warehouses");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      setWarehouses(data);

    } catch (err) {
      console.error("Warehouse error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
  }, []);

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this product?")) return;

    try {

      await API.delete(`/products/${id}`);

      fetchProducts();

    } catch (err) {

      console.error(err.response?.data || err);

    }
  };

  /* ================= OPEN MODALS ================= */

  const openAddModal = () => {

    setEditProduct(null);

    setForm({
      name: "",
      sku: "",
      category: "",
      description: "",
      quantity: "",
      warehouse_id: ""
    });

    setShowModal(true);
  };

  const openEditModal = (product) => {

    setEditProduct(product);

    setForm({
      name: product.name || "",
      sku: product.sku || "",
      category: product.category || "",
      description: product.description || "",
      quantity: product.quantity || "",
      warehouse_id: product.warehouse_id || ""
    });

    setShowModal(true);
  };

  /* ================= SAVE PRODUCT ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const payload = {
        name: form.name,
        sku: form.sku,
        category: form.category,
        description: form.description,
        quantity: Number(form.quantity),
        warehouse_id: Number(form.warehouse_id)
      };

      console.log("SENDING:", payload);

      if (editProduct) {

        await API.put(`/products/${editProduct.id}`, payload);

      } else {

        await API.post("/products", payload);

      }

      setShowModal(false);

      fetchProducts();

    } catch (err) {

      console.error("SAVE ERROR:", err.response?.data || err);

      alert(err.response?.data?.message || "Error saving product");

    }
  };

  /* ================= FILTER ================= */

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) return <h2 className="p-6">Loading...</h2>;

  return (
    <div className="p-6">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>

        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      <input
        type="text"
        placeholder="Search..."
        className="border p-2 rounded mb-4 w-full"
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border">

  <div className="overflow-x-auto">

    <table className="min-w-full table-auto">

      <thead className="bg-gray-100 border-b">
        <tr className="text-left text-sm font-semibold text-gray-700">
          <th className="px-6 py-3">ID</th>
          <th className="px-6 py-3">Name</th>
          <th className="px-6 py-3">SKU</th>
          <th className="px-6 py-3">Qty</th>
          <th className="px-6 py-3">Warehouse</th>
          <th className="px-6 py-3">Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y">

        {paginated.map(p => (

          <tr key={p.id} className="hover:bg-gray-50">

            <td className="px-6 py-3">{p.id}</td>
            <td className="px-6 py-3">{p.name}</td>
            <td className="px-6 py-3">{p.sku}</td>
            <td className="px-6 py-3">{p.quantity}</td>
            <td className="px-6 py-3">{p.warehouse_name}</td>

            <td className="px-6 py-3 space-x-2">

              <button
                onClick={()=>openEditModal(p)}
                className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
              >
                Edit
              </button>

              <button
                onClick={()=>handleDelete(p.id)}
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

      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-96">

            <h2 className="text-xl font-bold mb-4">
              {editProduct ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                className="border p-2 w-full rounded"
                placeholder="Name"
                value={form.name}
                onChange={(e)=>setForm({...form,name:e.target.value})}
                required
              />

              <input
                className="border p-2 w-full rounded"
                placeholder="SKU"
                value={form.sku}
                onChange={(e)=>setForm({...form,sku:e.target.value})}
              />

              <input
                type="number"
                className="border p-2 w-full rounded"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e)=>setForm({...form,quantity:e.target.value})}
                required
              />

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

              <div className="flex justify-end gap-2 pt-2">

                <button
                  type="button"
                  onClick={()=>setShowModal(false)}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Products;