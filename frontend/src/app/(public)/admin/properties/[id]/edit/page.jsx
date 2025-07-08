"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/sidebar";
import { getPropertyByIdApi, updatePropertyByIdApi } from "@/utils/axiosApi/propertyApis";

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    price: "",
    images: [],
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await getPropertyByIdApi(id);
        const prop = res.property || res;
        setProperty(prop);
        setFormData({
          title: prop.title || "",
          location: prop.location || "",
          description: prop.description || "",
          price: prop.price || "",
          images: prop.images || [],
        });
      } catch (err) {
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePropertyByIdApi(id, formData);
      alert("Property updated successfully!");
      router.push(`/admin/properties/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update property.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!property) return <p className="p-6">Property not found.</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 md:ml-64">
        <div className="bg-white p-6 rounded-lg shadow mt-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Edit Property</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full p-2 border rounded"
              required
            />
            {/* Add image uploader here if needed */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
