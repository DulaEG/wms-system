import { useEffect, useState } from "react";
import API from "../api";

function StockTransfer() {

  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [product, setProduct] = useState("");
  const [fromWarehouse, setFromWarehouse] = useState("");
  const [toWarehouse, setToWarehouse] = useState("");
  const [quantity, setQuantity] = useState("");

  const [loading, setLoading] = useState(true);

  const safeArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      const p = await API.get("/products");
      const w = await API.get("/warehouses");
      const i = await API.get("/inventory");

      setProducts(safeArray(p.data));
      setWarehouses(safeArray(w.data));
      setInventory(safeArray(i.data));

      console.log("PRODUCTS:", p.data);
      console.log("WAREHOUSES:", w.data);
      console.log("INVENTORY:", i.data);

    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  
  const validFromWarehouses =
    product === ""
      ? []
      : warehouses.filter(w => {
          return inventory.some(i => {

            // CASE 1: inventory has IDs
            if (i.product_id && i.warehouse_id) {
              return (
                Number(i.product_id) === Number(product) &&
                Number(i.warehouse_id) === Number(w.id) &&
                Number(i.quantity) > 0
              );
            }

            // CASE 2: inventory has names
            const selectedProductName = products.find(
  p => Number(p.id) === Number(product)
)?.name;

            return (
              i.product === selectedProductName &&
              i.warehouse === w.name &&
              Number(i.quantity) > 0
            );

          });
        });

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!product || !fromWarehouse || !toWarehouse || !quantity) {
      alert("Please fill all fields");
      return;
    }

    if (fromWarehouse === toWarehouse) {
      alert("Cannot transfer to same warehouse");
      return;
    }

    try {
      await API.post("/stock-transfer", {
        product_id: Number(product),
        source_warehouse_id: Number(fromWarehouse),
        destination_warehouse_id: Number(toWarehouse),
        quantity: Number(quantity)
      });

      alert("Stock transferred successfully");

      await loadData();

      setProduct("");
      setFromWarehouse("");
      setToWarehouse("");
      setQuantity("");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Transfer failed");
    }
  };

  if (loading) return <h2>Loading...</h2>;

 return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

    <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg border">

      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Stock Transfer
      </h1>

      <form onSubmit={handleTransfer} className="space-y-5">

        {/* Product */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-600">
            Product
          </label>
          <select
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={product}
            onChange={(e) => {
              setProduct(e.target.value);
              setFromWarehouse("");
            }}
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* From Warehouse */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-600">
            From Warehouse
          </label>
          <select
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fromWarehouse}
            onChange={(e) => setFromWarehouse(e.target.value)}
          >
            <option value="">Select Warehouse</option>

            {product === "" ? (
              <option disabled>Select product first</option>
            ) : validFromWarehouses.length === 0 ? (
              <option disabled>No stock available</option>
            ) : (
              validFromWarehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))
            )}
          </select>
        </div>

        {/* To Warehouse */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-600">
            To Warehouse
          </label>
          <select
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={toWarehouse}
            onChange={(e) => setToWarehouse(e.target.value)}
          >
            <option value="">Select Destination</option>

            {warehouses
              .filter(w => Number(w.id) !== Number(fromWarehouse))
              .map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-600">
            Quantity
          </label>
          <input
            type="number"
            placeholder="Enter quantity"
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200 shadow"
        >
          Transfer Stock
        </button>

      </form>
    </div>
  </div>
);
}

export default StockTransfer;