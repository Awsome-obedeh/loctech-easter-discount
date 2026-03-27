"use client"
import { useRouter } from 'next/navigation';

import React from 'react'

export default function Logout() {

    const router=useRouter()
    const handleLogout = async () => {
    try {
      const res = await fetch("api/logout", { method: "POST" });
      if (res.ok) {
        localStorage.removeItem("adminUser"); // Clear local flag
        // setIsAdmin(false);
        router.push("/control");
        router.refresh(); // Trigger middleware re-validation
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  return (
    <div>
<button
          onClick={handleLogout}
          className="text-sm md:text-base font-bold text-[#da2721] hover:bg-red-50 px-4 py-2 rounded-lg border border-[#da2721] transition-all"
        >
          Logout
        </button>
    </div>
  )
}
