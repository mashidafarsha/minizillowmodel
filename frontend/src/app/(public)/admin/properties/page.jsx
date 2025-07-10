"use client";
import { useEffect, useState } from "react";
import AdminSidebar from "../../../../components/admin/sidebar/index";

import {
  deletePropertyByIdApi,
  getAllPropertiesApi,
} from "@/utils/axiosApi/propertyApis";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AllPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminAccessToken");
    const adminRole = localStorage.getItem("admin");

    if (!adminToken || !adminRole) {
      router.push("/admin/login");
    }
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await getAllPropertiesApi();
        setProperties(res.properties || res);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (propertyId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (!confirmDelete) return;

    try {
      await deletePropertyByIdApi(propertyId);
      toast.success("Property deleted successfully!");
      setProperties((prev) => prev.filter((p) => p._id !== propertyId));
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete property.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 ">
        {loading ? (
          <p>Loading...</p>
        ) : properties.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold mb-1">{property.title}</h3>
                <p className="text-sm text-gray-500">{property.category}</p>
                <p className="text-sm text-gray-500 mb-1">
                  {property.location}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  {property.description}
                </p>
                <div className="font-bold text-green-600 mb-2">
                  AED {property.price}
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-blue-600 text-sm"
                    onClick={() =>
                      router.push(`/admin/properties/${property._id}`)
                    }
                  >
                    View
                  </button>
                  <button
                    className="text-yellow-600 text-sm"
                    onClick={() =>
                      router.push(`/admin/properties/${property._id}/edit`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 text-sm"
                    onClick={() => handleDelete(property._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
