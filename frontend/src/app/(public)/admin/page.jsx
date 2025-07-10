"use client";
import AdminSidebar from "../../../components/admin/sidebar/index";

import MetricCard from "../../../components/admin/metricCard/index";
import { getAllPropertiesApi } from "@/utils/axiosApi/propertyApis";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
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
    const fetchAllProperties = async () => {
      try {
        const data = await getAllPropertiesApi();
        setProperties(data.properties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProperties();
  }, []);
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 ">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
          <MetricCard title="Total Properties" value={properties.length} />
          <MetricCard title="Active Users" value="45" />
          <MetricCard title="Revenue" value="AED 24,500" />
          <MetricCard title="Pending Listings" value="7" />
        </section>

        {/* Recent Properties */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Properties</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {properties.slice(0, 3).map((property) => (
              <div
                key={property._id}
                className="border rounded-lg p-4 bg-gray-50 hover:shadow transition"
              >
                <h3 className="font-semibold text-gray-800">
                  {property.title}
                </h3>
                <p className="text-sm text-gray-500">{property.location}</p>
                <p className="text-sm text-gray-500">{property.category}</p>
                <p className="mt-2 text-sm text-green-600 font-bold">
                  AED {property.price}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/admin/properties")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              View All Properties
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
