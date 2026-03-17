import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function CreateSupplier() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const submit = async (e) => {

    e.preventDefault();

    try {

      await API.post("/suppliers", {
        name,
        contact_person: contactPerson,
        phone,
        email
      });

      navigate("/suppliers");

    } catch (err) {

      alert("Error creating supplier");

    }

  };

  return (

    <div className="max-w-lg">

      <h1 className="text-3xl font-bold mb-6">
        Add Supplier
      </h1>

      <form
        onSubmit={submit}
        className="bg-white p-6 rounded shadow space-y-4"
      >

        <input
          type="text"
          placeholder="Supplier Name"
          className="border p-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Contact Person"
          className="border p-2 w-full"
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone"
          className="border p-2 w-full"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Supplier
        </button>

      </form>

    </div>

  );

}

export default CreateSupplier;