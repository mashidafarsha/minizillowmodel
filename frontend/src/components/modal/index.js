// components/PropertyModal.jsx
"use client";
import { Dialog } from "@headlessui/react";

const PropertyModal = ({ isOpen, onClose, property }) => {
  if (!property) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal content wrapper */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 text-2xl font-bold z-10"
          >
            &times;
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Left: Image */}
            <div className="w-full md:w-1/2 h-[250px] md:h-auto">
              <img
                src={property.image}
                alt="Property"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Details */}
            <div className="p-6 md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                ${property.price}
              </h2>
              <p className="text-sm text-gray-700 mb-2">
                <strong>{property.beds}</strong> bds ·{" "}
                <strong>{property.baths}</strong> ba ·{" "}
                <strong>{property.sqft}</strong> sqft
              </p>
              <p className="text-gray-600 mb-1">{property.address}</p>
              <p className="text-sm text-blue-700 font-medium">{property.agency}</p>

              {/* Optional: CTA buttons */}
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
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PropertyModal;
