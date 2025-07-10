"use client";
import { Dialog } from "@headlessui/react";
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  getPropertyByIdApi,
  ratePropertyApi,
} from "@/utils/axiosApi/propertyApis";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const PropertyModal = ({ isOpen, onClose, propertyId }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const router = useRouter();

  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    if (property?.averageRating) setAvgRating(property.averageRating);
  }, [property]);

  const handleRate = async (value) => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const res = await ratePropertyApi(propertyId, value);
      toast.success("Rating submitted!");
      setUserRating(value);
      setAvgRating(res.averageRating);
    } catch (err) {
      toast.error("Failed to submit rating.");
    }
  };

  useEffect(() => {
    if (!propertyId) return;

    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await getPropertyByIdApi(propertyId);
        const fetchedProperty = res.property || res;
        setProperty(fetchedProperty);
        setAvgRating(fetchedProperty.averageRating || 0);
      } catch (err) {
        console.error("Failed to fetch property:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  useEffect(() => {
    if (!property || !user) return;

    const existingRating = property.ratings?.find(
      (r) => r.user === user._id || r.user?._id === user._id
    );
    setUserRating(existingRating?.rating || 0);
  }, [property, user?._id]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 text-2xl font-bold z-10"
          >
            &times;
          </button>

          {loading ? (
            <div className="p-10 text-center text-lg">Loading...</div>
          ) : !property ? (
            <div className="p-10 text-center text-lg">Property not found.</div>
          ) : (
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 grid grid-cols-2 gap-2 h-[300px]">
                <div className="col-span-1 row-span-2 h-full overflow-hidden rounded-lg">
                  <img
                    src={property.images?.[0] || "/images/placeholder.jpg"}
                    alt="Main"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="col-span-1 h-[145px] overflow-hidden rounded-lg">
                  <img
                    src={property.images?.[1] || "/images/placeholder.jpg"}
                    alt="Image 2"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="col-span-1 h-[145px] overflow-hidden rounded-lg">
                  <img
                    src={property.images?.[2] || "/images/placeholder.jpg"}
                    alt="Image 3"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="p-6 md:w-1/2">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  AED {property.price}
                </h2>
                <p className="text-[14px] text-gray-700">
                  <strong>{property.title || "--"}</strong> , · <br />
                  <strong>{property.category || "--"}</strong>
                  <br />
                  <strong>{property.description || "--"}</strong> , ·{" "}
                </p>

                <p className="text-[14px] text-gray-600">
                  {property.address || property.location || "Unknown address"}
                </p>
                <p className="text-[12px] text-blue-700">
                  {property.agency || "Listed by Zillow"}
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button className="bg-[#00A7B6] text-white font-semibold px-6 py-2 rounded-md hover:bg-[#008c99] transition">
                    Request a tour
                  </button>
                  <button className="bg-white border border-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-md hover:bg-gray-100 transition">
                    Apply now
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Rating UI */}
          <div className=" ml-7 mb-4">
            <p className="text-sm text-gray-600 mb-1">Your Rating:</p>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => handleRate(star)}
                  className={`cursor-pointer text-xl ${
                    star <= userRating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Average Rating: <strong>{avgRating.toFixed(1)}</strong> / 5
            </p>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PropertyModal;
