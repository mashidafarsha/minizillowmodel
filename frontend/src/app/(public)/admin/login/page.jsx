"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdminApi } from "../../../../utils/axiosApi/authApi";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");
    const role = localStorage.getItem("admin");

    if (token && role) {
      router.push("/admin");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { accessToken, refreshToken, admin } = await loginAdminApi(form);

      localStorage.setItem("adminAccessToken", accessToken);
      localStorage.setItem("adminRefreshToken", refreshToken);
      localStorage.setItem("admin", JSON.stringify(admin));

      // Clear user tokens to avoid conflicts
      localStorage.removeItem("user");
      localStorage.removeItem("userAccessToken");
      localStorage.removeItem("userRefreshToken");

      toast.success("Admin login successful!");
      router.push("/admin/");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
      toast.error("Admin login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side image */}

      {/* Right side form */}
      <div className="flex w-full md:w-1/4 justify-center items-center p-8 bg-white">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-8 text-center text-green-600">
            Admin Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold transition"
            >
              Login
            </button>

            <p className="mt-4 text-center text-gray-600">
              Not an admin?{" "}
              <a
                href="/login"
                className="text-green-600 hover:underline font-semibold"
              >
                Login as User
              </a>
            </p>
          </form>
        </div>
      </div>
      <div
        className="hidden md:block md:w-3/4 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://photos.zillowstatic.com/fp/422a68322ae9ce71b39645c8821bc3d2-cc_ft_960.jpg')",
        }}
        aria-label="Admin login image"
      ></div>
    </div>
  );
}
