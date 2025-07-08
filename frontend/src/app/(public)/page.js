"use client";

import "./style.css";
import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";
import PropertyModal from "@/components/modal";
import { useRouter } from "next/navigation";
import { getAllPropertiesApi, getCurrentUserApi, toggleBookmarkApi } from "@/utils/axiosApi/propertyApis"; // ✅ real API
import { useSelector } from "react-redux";
import toast from "react-hot-toast"; 

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // prevent flash of content
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [properties, setProperties] = useState([]);
const [user,setUser]=useState(null)
  const [bookmarkedProperties, setBookmarkedProperties] = useState([]);

  

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

  useEffect(() => {
    fetchProperties();
  
    const token = localStorage.getItem("userAccessToken");
    if (token) {
      fetchUser();
    }
  
    setLoading(false);
  }, []);
  

  const openModal = (property) => {
    if (!user) {
      router.push("/login"); // ⬅️ redirect to login page
      return;
    }
    setSelectedProperty(property);
    setIsModalOpen(true);
  };
  
  

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };


  



 

  const handleBookmark = async (e, propertyId) => {
    e.stopPropagation();
  
    if (!user) {
      router.push("/login"); // optional redirect
      return;
    }
  
    try {
      const res = await toggleBookmarkApi(propertyId);
      if (res.success && Array.isArray(res.favorites)) {
        setBookmarkedProperties(res.favorites);
  
        // Check if just added or removed
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
  
  
  
  


  return (
    <>
      <main className="flex flex-col items-center w-full overflow-hidden">
        {/* Hero Section */}

        <section
          className="flex flex-row justify-center items-center min-h-[408px] relative w-full bg-cover bg-no-repeat"
          style={{
            backgroundImage:
              "url('/svg/images/home/BackgroundMainBanner.webp')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="hidden lg:flex flex-row gap-[40px] justify-center">
            <div className="flex flex-col justify-center w-[440px] xl:w-[520px] h-[352px] -translate-x-80 relative top-5">
              <h1 className="text-white font-[900] text-[60px] leading-[72px] mb-8">
                Agents. Tours. <br />
                Loans. Homes.
              </h1>

              {/* Search Box */}
              <div className="flex items-center bg-white rounded-xl overflow-hidden h-16 shadow-lg w-[90%] sm:w-[80%] md:w-[450px] ml-0">
                <input
                  type="text"
                  placeholder="Enter an address, neighborhood, city, or ZIP code"
                  className="flex-1 px-4 py-3 text-gray-800 focus:outline-none text-[16px]"
                />
                <button className="bg-white hover:bg-[#dde0e2] text-black p-3 px-4">
                  <FiSearch size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>
       

        <section className="flex flex-col items-center w-full bg-[#F9F7FE] px-4 sm:px-6 py-12 lg:py-28">
          <p className="font-semibold text-[22px] lg:text-[34px] mb-16 leading-6 lg:leading-10 text-center text-[#333]">
            Highlight Services
          </p>

          <p className="text-[20px] sm:text-[24px] font-semibold text-[#333] text-center mb-10">
            Find quality care that prioritizes your <br />
            <span className="text-[#00A7B6]">Comfort</span> and{" "}
            <span className="text-[#00A7B6]">Recovery</span>.
          </p>

          {/* Scrollable Card Section */}
          <div className="flex overflow-x-auto gap-6 px-4 py-6 scrollbar-hide">
  {properties.map((property, idx) => (
    <div
      key={property._id || idx}
      className="min-w-[300px] max-w-[300px] bg-white rounded-xl shadow-lg overflow-hidden relative cursor-pointer"
      onClick={() => openModal(property._id)}

    >
      {/* Property Image */}
      <div className="relative h-[180px]">
        <img
          src={property.images?.[0] || "/images/placeholder.jpg"}
          alt="Property"
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 left-2 bg-black/70 text-white text-[12px] px-2 py-1 rounded-md">
          {property.feature || "Covered front porch"}
        </span>
        <button
  className={`absolute top-2 right-2 rounded-full p-1 ${
    user && bookmarkedProperties.includes(property._id)
      ? "bg-red-500 text-white"
      : "bg-white text-gray-400"
  } shadow`}
  onClick={(e) => {
    e.stopPropagation(); // prevent modal from opening
    if (!user) {
      router.push("/login"); // ⬅️ redirect if not logged in
      return;
    }
    handleBookmark(e, property._id);
  }}
>
  ❤️
</button>




      </div>

      {/* Property Info */}
      <div className="p-4 space-y-2">
        <p className="text-[20px] font-bold text-gray-900">
          ${property.price}
        </p>
        <p className="text-[14px] text-gray-700">
          <strong>{property.beds || "--"}</strong> bds ·{" "}
          <strong>{property.baths || "--"}</strong> ba ·{" "}
          <strong>{property.sqft || "--"}</strong> sqft - House for sale
        </p>
        <p className="text-[14px] text-gray-600">
          {property.address || property.location || "Unknown address"}
        </p>
        <p className="text-[12px] text-blue-700">
          {property.agency || "Listed by SnapShare"}
        </p>
      </div>
    </div>
  ))}
</div>


          {/* Property Modal */}
          <PropertyModal
  isOpen={isModalOpen}
  onClose={closeModal}
  propertyId={selectedProperty}
/>


          {/* Learn More Button */}
          <button className="mt-10 bg-[#00A7B6] text-white text-[18px] font-medium py-2.5 px-6 rounded-full hover:shadow-lg transition-all">
            Learn more
          </button>
        </section>

        {/* Stand out Yourself section */}

        <section className="home-section-4 flex flex-col items-center w-full lg:p-28 px-6 py-12">
          <motion.p
            id="title"
            className=" mb-8 lg:mb-16 font-semibold lg:text-[34px] text-[22px] lg:leading-10 leading-6"
            // {...slideInFromBottom}
          >
            Stand out yourself
          </motion.p>
          <div className="max-w-[1200px] w-full">
            <div className="flex flex-col lg:flex-row  items-center justify-between">
              {/* Left: Feature list */}
              <div className="flex flex-col w-full sm:w-[330px] md:w-[400px] lg:w-[70%] xl:w-[60%] ">
                <h2 className="text-black text-[20px] xl:text-[20px] font-[900] leading-6 xl:leading-6 ">
                  Recommendations underway
                </h2>

                <p className=" text-black text-[14px]  font-[400] leading-6  mt-2 sm:mt-1 xl:mt-2 2xl:mt-2 ">
                  Search and save a few homes you like and we'll find
                  recommendations for you.
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                  <Link
                    href="/pricing"
                    className="flex justify-center flex-row bg-transparent border text-blue-800  w-[60px] h-[30px] md:w-[60px] md:h-[30px] lg:w-[80px] lg:h-[40px] rounded-md md:rounded-lg items-center mt-3 sm:mt-3 xl:mt-3 2xl:mt-3 "
                  >
                    <span className="sf-pro-body leading-4 text-blue-800   text-[10px] xl:text-[14px] xl:font-normal tracking-normal p-0 m-0 ">
                      Sign in
                    </span>
                  </Link>
                </div>
              </div>

              {/* Right: Image block */}
              <div className="w-full lg:w-[500px] h-[350px] bg-white rounded-[32px] flex items-center justify-center shadow-xl">
                {/* Replace with actual image */}
                <img
                  src="https://www.zillowstatic.com/s3/web-platform/sub-apps/hops-homepage/hops-homepage.prod.master.9954683.4440c378/web/1d9d5bce566c85fa242cb21ad3292cb8.webp"
                  alt="Dr. Shafeek"
                  className="rounded-[32px] w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Blog and Case Study section */}

        <section className="home-section-5 flex flex-col items-center w-full lg:p-28 px-6 py-12">
          <motion.p
            id="title"
            className="sf-pro-headline mb-8 lg:mb-16"
            // {...slideInFromBottom}
          >
            Case Studies
          </motion.p>
          <div className="max-w-[1200px] w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {[
                {
                  icon: "/icons/buy.svg",
                  title: "Buy a home",
                  desc: "Find your place with an immersive photo experience and the most listings, including things you won’t find anywhere else.",
                  btn: "Browse homes",
                },
                {
                  icon: "/icons/sell.svg",
                  title: "Sell a home",
                  desc: "No matter what path you take to sell your home, we can help you navigate a successful sale.",
                  btn: "See your options",
                },
                {
                  icon: "/icons/rent.svg",
                  title: "Rent a home",
                  desc: "We’re creating a seamless online experience – from shopping on the largest rental network, to applying, to paying rent.",
                  btn: "Find rentals",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition hover:shadow-xl"
                >
                  <img
                    src={card.icon}
                    alt={card.title}
                    className="w-24 h-24 mb-4"
                  />
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">{card.desc}</p>
                  <button className="text-blue-600 border border-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition">
                    {card.btn}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
