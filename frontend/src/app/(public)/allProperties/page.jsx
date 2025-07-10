"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAllPropertiesApi,
  getCurrentUserApi,
  toggleBookmarkApi,
} from "@/utils/axiosApi/propertyApis";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import PropertyModal from "@/components/modal";

const AllPropertiesPage = () => {
  const router = useRouter();

  const [properties, setProperties] = useState([]);
  const [bookmarkedProperties, setBookmarkedProperties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const itemsPerPage = 6;

  useEffect(() => {
    fetchProperties();

    const token = localStorage.getItem("userAccessToken");
    if (token) {
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await getCurrentUserApi();
      setUser(userData);
      if (Array.isArray(userData.favorites)) {
        setBookmarkedProperties(userData.favorites);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await getAllPropertiesApi();
      setProperties(res.properties || res);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    }
  };

  const handleBookmark = async (e, propertyId) => {
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const res = await toggleBookmarkApi(propertyId);
      if (res.success && Array.isArray(res.favorites)) {
        setBookmarkedProperties(res.favorites);
        const isBookmarkedNow = res.favorites.includes(propertyId);
        toast.success(
          isBookmarkedNow ? "Added to favourites!" : "Removed from favourites."
        );
      }
    } catch (err) {
      console.error("Bookmark failed:", err);
      toast.error("Something went wrong.");
    }
  };

  const openModal = (propertyId) => {
    if (!user) {
      router.push("/login");
      return;
    }
    setSelectedProperty(propertyId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };


  const filteredProperties = properties.filter((property) => {
    const matchesLocation =
      property.location?.toLowerCase().includes(searchLocation.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchLocation.toLowerCase());

    const matchesCategory =
      categoryFilter === "" || property.category === categoryFilter;

    return matchesLocation && matchesCategory;
  });


  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  return (
    <section className="px-6 py-10 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        All Properties
      </h2>

     
      <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by location or address..."
          value={searchLocation}
          onChange={(e) => {
            setSearchLocation(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none text-sm"
        />

      
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none text-sm"
        >
          <option value="">All Categories</option>
          <option value="Villa">Villa</option>
          <option value="Flat">Flat</option>
          <option value="Penthouse">Penthouse</option>
          <option value="Studio">Studio</option>
          <option value="Townhouse">Townhouse</option>
          <option value="Land">Land</option>
        </select>
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentProperties.map((property) => (
          <div
            key={property._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
            onClick={() => openModal(property._id)}
          >
           
            <div className="relative h-[180px]">
              <img
                src={property.images?.[0] || "/images/placeholder.jpg"}
                alt="Property"
                className="w-full h-full object-cover"
              />

              <button
                className="absolute top-2 right-2 rounded-full p-1 bg-zinc-100 shadow"
                onClick={(e) => handleBookmark(e, property._id)}
              >
                {user && bookmarkedProperties.includes(property._id) ? (
                  <AiFillHeart className="text-red-500 text-[20px]" />
                ) : (
                  <AiOutlineHeart className="text-gray-400 text-[20px]" />
                )}
              </button>
            </div>

            {/* Info */}
            <div className="p-4 space-y-2">
              <p className="text-lg font-bold text-gray-900">
                AED {property.price}
              </p>
              <p className="text-sm text-gray-700">
                <strong>{property.title || "--"}</strong>
              </p>
              <p className="text-[14px] text-gray-700">
                <strong>{property.category || "--"}</strong>
              </p>
              <p className="text-sm text-gray-600">
                {property.address || property.location || "Unknown address"}
              </p>
              <p className="text-xs text-blue-700">
                {property.agency || "Listed by Zillow"}
              </p>
            </div>
          </div>
        ))}
      </div>

    
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-[#00A7B6] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

    
      <PropertyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        propertyId={selectedProperty}
      />
    </section>
  );
};

export default AllPropertiesPage;
