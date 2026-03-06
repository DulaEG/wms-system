import { useState } from "react";
import API from "../api";

function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  const handleSubmit = async (e)=>{
    e.preventDefault();

    try{

      const res = await API.post("/auth/login",{
        email,
        password
      });

      const token = res.data.token;

      // SAVE TOKEN
      localStorage.setItem("token", token);

      // redirect
      window.location.href="/products";

    }catch(err){
      console.error(err);
      setError("Login failed");
    }
  }

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form 
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-96"
      >

        <h2 className="text-2xl font-bold mb-6 text-center">
          WMS Login
        </h2>

        {error && (
          <p className="text-red-500 mb-3">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;