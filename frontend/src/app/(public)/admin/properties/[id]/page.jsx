"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/sidebar";
import { deletePropertyByIdApi, getPropertyByIdApi } from "@/utils/axiosApi/propertyApis";
import toast from "react-hot-toast";
export default function PropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter(); 
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await getPropertyByIdApi(id); // ✅ Correct call with ID
        setProperty(res.property || res); // adjust based on API response
      } catch (err) {
        console.error("Failed to fetch property:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);






  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this property?");
    if (!confirmDelete) return;
  
    const deletingToast = toast.loading("Deleting property...");
  
    try {
      await deletePropertyByIdApi(id);
      toast.success("Property deleted successfully!", { id: deletingToast });
      router.push("/admin/properties");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete property.", { id: deletingToast });
    }
  };
  

  if (loading) return <p className="p-6">Loading...</p>;
  if (!property) return <p className="p-6">Property not found.</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 md:ml-64">
        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-2xl font-bold mb-2">{property.title}</h2>
          <p className="text-gray-500 mb-2">{property.location}</p>
          <p className="text-gray-700 mb-4">{property.description}</p>

          <div className="text-lg font-semibold text-green-600 mb-4">
            Price: ${property.price}
          </div>

          {property.images && property.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {property.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Property image ${idx + 1}`}
                  className="w-full h-48 object-cover rounded"
                />
              ))}
            </div>
          )}

          <div className="space-x-4 mt-4">
          <button
  className="bg-yellow-500 text-white px-4 py-2 rounded"
  onClick={() => router.push(`/admin/properties/${id}/edit`)}
>
  Edit
</button>

<button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
