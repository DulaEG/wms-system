import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {

      const res = await API.post("/auth/login", {
        email,
        password
      });

      const token = res.data.token;

      localStorage.setItem("token", token);

      navigate("/products");

    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-lg w-96">

        <h1 className="text-3xl font-bold text-center mb-6">
          Warehouse System Login
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter email"
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              className="w-full border p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;