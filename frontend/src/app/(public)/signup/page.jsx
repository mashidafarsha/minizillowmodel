"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { signupUser } from "../../../store/authSlice";
import { useRouter } from "next/navigation";
import { validateSignup } from "@/utils/validation/signupValidation";
import toast from "react-hot-toast";

export default function SignupPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateSignup(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the form errors.");
      return;
    }

    try {
      await dispatch(signupUser(form)).unwrap();
      toast.success("Signup successful! Please login.");
      router.push("/login");
    } catch (err) {
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto py-20">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
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
        <button type="submit" className="w-full bg-blue-600 text-white py-2">
          Sign Up
        </button>
      </form>
    </div>
  );
}
