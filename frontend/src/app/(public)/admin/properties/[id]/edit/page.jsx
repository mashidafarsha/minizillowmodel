"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/sidebar";
import {
  getPropertyByIdApi,
  updatePropertyByIdApi,
} from "@/utils/axiosApi/propertyApis";
import { toast } from "react-hot-toast";

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
    category: "", 
    existingImages: [],
    newImages: [],
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
          category: prop.category || "", 
          existingImages: prop.images || [],
          newImages: [],
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

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      newImages: Array.from(e.target.files),
    }));
  };

  const handleRemoveExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.existingImages.length + formData.newImages.length < 3) {
      toast.error("Minimum 3 images required (existing + new).");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("location", formData.location);
    form.append("price", formData.price);
    form.append("description", formData.description);
    form.append("category", formData.category); 

    formData.existingImages.forEach((url) =>
      form.append("existingImages", url)
    );
    formData.newImages.forEach((file) => form.append("newImages", file));

    try {
      await updatePropertyByIdApi(id, form);
      toast.success("Property updated successfully!");
      router.push(`/admin/properties/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update property.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!property) return <p className="p-6">Property not found.</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6">
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

           
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Category</option>
              <option value="Villa">Villa</option>
              <option value="Flat">Flat</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Studio">Studio</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Land">Land</option>
            </select>

          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Existing Images
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.existingImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`Image ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(idx)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload New Images
              </label>
              <input
                type="file"
                name="newImages"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload more images (minimum 3 total)
              </p>
            </div>

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
