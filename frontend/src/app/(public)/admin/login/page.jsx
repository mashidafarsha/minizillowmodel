"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdminApi } from "../../../../utils/axiosApi/authApi"; // adjust path as needed

export default function AdminLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { accessToken, refreshToken, admin } = await loginAdminApi(form);

      // Store tokens
      localStorage.setItem("adminAccessToken", accessToken);
      localStorage.setItem("adminRefreshToken", refreshToken);
      localStorage.setItem("admin", JSON.stringify(admin));
      

      // Redirect to dashboard
      router.push("/admin/");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="max-w-md mx-auto py-20">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" className="w-full bg-green-600 text-white py-2">
          Login
        </button>
      </form>
    </div>
  );
}
