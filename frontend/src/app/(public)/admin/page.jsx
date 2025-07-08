"use client";
import AdminSidebar from "../../../components/admin/sidebar/index";

import MetricCard from "../../../components/admin/metricCard/index";
import { getAllPropertiesApi } from "@/utils/axiosApi/propertyApis";
import { useEffect, useState } from "react";

export default function AdminDashboard() {

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        const data = await getAllPropertiesApi();
        setProperties(data.properties); // ✅ make sure you're setting an array
        
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
      <main className="flex-1 p-6 md:ml-64">
        {/* <AdminHeader title="Dashboard" /> */}

        {/* Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
          <MetricCard title="Total Properties" value="123" />
          <MetricCard title="Active Users" value="45" />
          <MetricCard title="Revenue" value="$24,500" />
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
        <h3 className="font-semibold text-gray-800">{property.title}</h3>
        <p className="text-sm text-gray-500">{property.location}</p>
        <p className="mt-2 text-sm text-green-600 font-bold">
          ${property.price}
        </p>
      </div>
    ))}
  </div>
</section>

      </main>
    </div>
  );
}
