"use client";
import { useState } from "react";
import Link from "next/link";
import { HomeIcon, PlusIcon, ListBulletIcon } from "@heroicons/react/24/solid";

const AdminSidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <aside className={`bg-gray-800 text-white ${open ? "w-64" : "w-16"} min-h-screen duration-300`}>
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-xl font-bold">{open ? "Admin" : "A"}</span>
        <button onClick={() => setOpen(!open)} className="md:hidden text-white">
          ☰
        </button>
      </div>
      <nav className="flex flex-col gap-2 p-4">
        <Link href="/admin">
          <div className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded cursor-pointer">
            <HomeIcon className="h-5 w-5" />
            {open && "Dashboard"}
          </div>
        </Link>
        <Link href="/admin/add">
          <div className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded cursor-pointer">
            <PlusIcon className="h-5 w-5" />
            {open && "Add Property"}
          </div>
        </Link>
        <Link href="/admin">
          <div className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded cursor-pointer">
            <ListBulletIcon className="h-5 w-5" />
            {open && "All Properties"}
          </div>
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
