import React, { useState, useEffect } from "react";
import axios from "axios";

function PurchaseOrders() {

  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [productId, setProductId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [quantity, setQuantity] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
    // eslint-disable-next-line
  }, []);

  const normalize = (res) => {
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data.data)) return res.data.data;
    return [];
  };

  const fetchProducts = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/products",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setProducts(normalize(res));

    } catch (err) {
      console.error("Products error:", err);
      setProducts([]);
    }
  };

  const fetchWarehouses = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/warehouses",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setWarehouses(normalize(res));

    } catch (err) {
      console.error("Warehouses error:", err);
      setWarehouses([]);
    }
  };

  const receiveStock = async () => {

    if (!productId || !warehouseId || !quantity) {
      alert("Please fill all fields");
      return;
    }

    try {

      await axios.post(
        "http://localhost:5000/api/stock",
        {
          product_id: Number(productId),
          warehouse_id: Number(warehouseId),
          quantity: Number(quantity),
          movement_type: "IN"
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Stock Received Successfully");

      setProductId("");
      setWarehouseId("");
      setQuantity("");

    } catch (err) {

      console.error("Receive stock error:", err);
      alert("Error receiving stock");

    }
  };

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Receive Stock
      </h1>

      <div className="space-y-4 max-w-md">

        {/* PRODUCT */}
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">Select Product</option>

          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}

        </select>

        {/* WAREHOUSE */}
        <select
          value={warehouseId}
          onChange={(e) => setWarehouseId(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">Select Warehouse</option>

          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}

        </select>

        {/* QUANTITY */}
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border p-2 w-full rounded"
        />

        {/* BUTTON */}
        <button
          onClick={receiveStock}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Receive Stock
        </button>

      </div>

    </div>
  );
}

export default PurchaseOrders;