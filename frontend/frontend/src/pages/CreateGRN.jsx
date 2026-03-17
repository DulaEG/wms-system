import { useEffect, useState } from "react";
import API from "../api";

function CreateGRN() {

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);

  const [supplier, setSupplier] = useState("");
  const [warehouse, setWarehouse] = useState("");

  const [items, setItems] = useState([
    { product_id: "", location_id: "", quantity: "" }
  ]);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ SAFE ARRAY FUNCTION
  const safeArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const fetchAll = async () => {
    try {
      const [s, p, w] = await Promise.all([
        API.get("/suppliers"),
        API.get("/products"),
        API.get("/warehouses")
      ]);

      setSuppliers(safeArray(s.data));
      setProducts(safeArray(p.data));
      setWarehouses(safeArray(w.data));

    } catch (err) {
      console.error(err);
    }
  };

  const fetchLocations = async (warehouseId) => {
  try {
    const res = await API.get(`/locations/warehouse/${warehouseId}`);

    const data = res.data?.data || res.data || [];

    setLocations(data);

  } catch (err) {
    console.error(err);
    setLocations([]);
  }
};

  const handleWarehouseChange = (id) => {
  const wid = Number(id);

  console.log("Selected warehouse:", wid); // debug

  setWarehouse(wid);
  setLocations([]);

  if (wid > 0) {
    fetchLocations(wid);
  }

  setItems(prev =>
    prev.map(i => ({
      ...i,
      location_id: ""
    }))
  );
};

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value === "" ? "" : Number(value);
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { product_id: "", location_id: "", quantity: "" }]);
  };

  const saveGRN = async () => {

    if (!supplier || !warehouse) {
      alert("Select supplier and warehouse");
      return;
    }

    for (let i of items) {
      if (!i.product_id || !i.location_id || !i.quantity) {
        alert("Fill all fields");
        return;
      }
    }

    try {
      await API.post("/grn", {
        supplier_id: Number(supplier),
        warehouse_id: Number(warehouse),
        items
      });

      alert("GRN created successfully");

      setItems([{ product_id: "", location_id: "", quantity: "" }]);

    } catch (err) {
      console.error(err);
      alert("Error creating GRN");
    }
  };

  return (
  <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">

    <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8">

      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
        Create GRN
      </h2>

      {/* TOP SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        <div>
          <label className="block text-sm text-gray-600 mb-1">Supplier</label>
          <select
            value={supplier}
            onChange={e => setSupplier(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Supplier</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Warehouse</label>
          <select
            value={warehouse}
            onChange={e => handleWarehouseChange(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Warehouse</option>
            {warehouses.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* ITEMS */}
      <div className="space-y-4">

        {items.map((item, index) => (

          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-lg border"
          >

            {/* PRODUCT */}
            <select
              value={item.product_id}
              onChange={e => updateItem(index, "product_id", e.target.value)}
              className="border rounded-lg p-2"
            >
              <option value="">Product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {/* LOCATION */}
            <select
              value={item.location_id}
              onChange={e => updateItem(index, "location_id", e.target.value)}
              className="border rounded-lg p-2"
            >
              <option value="">Location</option>

              {locations.length === 0 ? (
                <option disabled>No locations</option>
              ) : (
                locations.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))
              )}
            </select>

            {/* QUANTITY */}
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={e => updateItem(index, "quantity", e.target.value)}
              className="border rounded-lg p-2"
            />

            {/* REMOVE BUTTON */}
            <button
              onClick={() =>
                setItems(items.filter((_, i) => i !== index))
              }
              className="bg-red-500 text-white rounded-lg px-3 hover:bg-red-600"
            >
              Remove
            </button>

          </div>

        ))}

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-between mt-6">

        <button
          onClick={addItem}
          className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          + Add Item
        </button>

        <button
          onClick={saveGRN}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Save GRN
        </button>

      </div>

    </div>

  </div>
);

}

export default CreateGRN;