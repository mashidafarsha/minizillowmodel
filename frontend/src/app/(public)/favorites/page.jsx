"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAllPropertiesApi,
  getCurrentUserApi,
  toggleBookmarkApi,
} from "@/utils/axiosApi/propertyApis";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import PropertyModal from "@/components/modal";
import toast from "react-hot-toast";

const FavoritesPage = () => {
  const router = useRouter();
  const [allProperties, setAllProperties] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userData = await getCurrentUserApi();
      setUser(userData);
      setFavoriteIds(userData.favorites || []);

      const res = await getAllPropertiesApi();
      setAllProperties(res.properties || res);
    } catch (err) {
      console.error("Error loading favorites page:", err);
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
        setFavoriteIds(res.favorites);
        const isBookmarked = res.favorites.includes(propertyId);
        toast.success(
          isBookmarked ? "Added to favourites!" : "Removed from favourites."
        );
      }
    } catch (err) {
      toast.error("Bookmark toggle failed.");
      console.error(err);
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

  const favoriteProperties = allProperties.filter((p) =>
    favoriteIds.includes(p._id)
  );

  return (
    <section className="px-6 py-10 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Your Favorite Properties
      </h2>

      {favoriteProperties.length === 0 ? (
        <p className="text-center text-gray-600">
          You haven't added any favorites yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favoriteProperties.map((property) => (
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
                  {favoriteIds.includes(property._id) ? (
                    <AiFillHeart className="text-red-500 text-[20px]" />
                  ) : (
                    <AiOutlineHeart className="text-gray-400 text-[20px]" />
                  )}
                </button>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-[20px] font-bold text-gray-900">
                  AED {property.price}
                </p>
                <p className="text-[14px] text-gray-700">
                  <strong>{property.title || "--"}</strong> , · <br />
                 
                </p>
                <p className="text-[14px] text-gray-700">
                  <strong>{property.category || "--"}</strong> , · <br />
                </p>
                <p className="text-[14px] text-gray-600">
                  {property.address || property.location || "Unknown address"}
                </p>
                <p className="text-[12px] text-blue-700">
                  {property.agency || "Listed by Zillow"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <PropertyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        propertyId={selectedProperty}
      />
    </section>
  );
};

export default FavoritesPage;
