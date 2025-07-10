"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { addPropertyApi } from "@/utils/axiosApi/propertyApis";
import { useRouter } from "next/navigation";

const AddPropertyForm = () => {
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    category: "", 
    images: [],
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      setForm((prev) => ({
        ...prev,
        images: Array.from(files),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.images.length < 3) {
      toast.error("Please upload at least 3 images.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("location", form.location);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("category", form.category); 

    form.images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await addPropertyApi(formData);
      toast.success("Property uploaded successfully!");
      router.push("/admin");
    } catch (err) {
      console.error("Error uploading:", err);
      toast.error("Failed to upload property!");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Property</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (AED)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select category</option>
            <option value="Villa">Villa</option>
            <option value="Flat">Flat</option>
            <option value="Penthouse">Penthouse</option>
            <option value="Studio">Studio</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Land">Land</option>
          </select>
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
           <p className="text-sm text-gray-500 mt-1">
                Upload more images (minimum 3 total)
              </p>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2 text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add Property
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyForm;
