"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HomeIcon,
  PlusIcon,
  ListBulletIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { usePathname, useRouter } from "next/navigation";

const AdminSidebar = () => {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("admin");
    router.push("/admin/login");
  };

  return (
    <aside
      className={`bg-gray-800 text-white ${
        open ? "w-64" : "w-16"
      } min-h-screen flex flex-col justify-between duration-300`}
    >
      <div>
        <div className="flex items-center justify-between px-4 py-4">
          <span className="text-xl font-bold">{open ? "Admin" : "A"}</span>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white"
          >
            ☰
          </button>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <Link href="/admin">
            <div
              className={`flex items-center gap-3 hover:bg-gray-700 p-2 rounded cursor-pointer ${
                isActive("/admin") ? "bg-gray-700" : ""
              }`}
            >
              <HomeIcon className="h-5 w-5" />
              {open && "Dashboard"}
            </div>
          </Link>
          <Link href="/admin/add">
            <div
              className={`flex items-center gap-3 hover:bg-gray-700 p-2 rounded cursor-pointer ${
                isActive("/admin/add") ? "bg-gray-700" : ""
              }`}
            >
              <PlusIcon className="h-5 w-5" />
              {open && "Add Property"}
            </div>
          </Link>
          <Link href="/admin/properties">
            <div
              className={`flex items-center gap-3 hover:bg-gray-700 p-2 rounded cursor-pointer ${
                isActive("/admin/properties") ? "bg-gray-700" : ""
              }`}
            >
              <ListBulletIcon className="h-5 w-5" />
              {open && "All Properties"}
            </div>
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-400 hover:text-white hover:bg-gray-700 p-2 rounded w-full"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          {open && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
