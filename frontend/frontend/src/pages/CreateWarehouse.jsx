import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function CreateWarehouse() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    location: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/warehouses", form);

      alert("Warehouse created");

      navigate("/warehouses");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating warehouse");
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Create Warehouse
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 max-w-md space-y-4"
      >

        <div>
          <label className="block mb-1 font-medium">
            Warehouse Name
          </label>

          <input
            type="text"
            className="border w-full p-2 rounded"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Location
          </label>

          <input
            type="text"
            className="border w-full p-2 rounded"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Warehouse
        </button>

      </form>

    </div>
  );
}

export default CreateWarehouse;
