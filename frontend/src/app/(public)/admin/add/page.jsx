"use client";
import { useRouter } from "next/navigation.js";
import AddPropertyForm from "../../../../components/addPropertyForm.jsx";
import { useEffect } from "react";
import AdminSidebar from "@/components/admin/sidebar/index.jsx";

export default function AddPage() {
  const router = useRouter();
  useEffect(() => {
    const adminToken = localStorage.getItem("adminAccessToken");
    const adminRole = localStorage.getItem("admin");

    if (!adminToken || !adminRole) {
      router.push("/admin/login");
    }
  }, []);
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 ">
        <div className="min-h-screen bg-gray-100 p-4">
          <AddPropertyForm />
        </div>
      </main>
    </div>
  );
}
