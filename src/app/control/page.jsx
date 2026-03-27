"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Enroll() {
  
  const [form, setForm] = useState({
    email:"",
    password: "",

  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState();
  
    const [loading, setLoading] = useState(false);
    const router = useRouter();


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};

   
    if(!form.password.trim()) newErrors.password="Password is required"

   

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }


    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // send api
   try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...form}),
      });

      const data = await res.json();

      if (res.ok) {
        //
        router.push("/users");
        router.refresh(); // Forces Next.js to re-check the middleware
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setErrors("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-xl bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">

        
         <div className="text-center mb-8">
                  <Image src="/images-removebg-preview.png" width={120} height={40} alt="Logo" className="mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
                  <p className="text-gray-500 mt-2">Access the enrollment dashboard</p>
                </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 text-center">
              {error}
            </div>
          )}

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="text"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className={`w-full p-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-red-500 transition-all ${errors.email ? "border-red-500" : "border-gray-400"
                } outline-none focus:ring-2 focus:ring-[#da2721]`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className={`w-full p-4 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-red-500 transition-all ${errors.password ? "border-red-500" : "border-gray-400"
                } outline-none focus:ring-2 focus:ring-[#da2721]`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

         
         
        

          <button
            type="submit"
            className="w-full py-3 bg-[#da2721] text-white rounded-lg font-semibold shadow-md hover:scale-105 transition"
          >
            Login
          </button>

        </form>
      </div>

    </main>
  );
}