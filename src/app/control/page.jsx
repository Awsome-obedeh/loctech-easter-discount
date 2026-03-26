"use client";

import { useState } from "react";
import { useSearchParams } from 'next/navigation';

export default function Enroll() {
  
  const [form, setForm] = useState({
    email:"",
    password: "",

  });

  const [errors, setErrors] = useState({});

  const courses = [
    "UI/UX Design",
    "Data Analysis",
    "Cybersecurity",
    "Cloud Computing Amazon Web Service",
    "Cloud Computing Microsoft Azure",
    "Full-Stack Web Development with Python and Django",
    "Data Analysis With Excel",
    "Data Analysis With Python and SQL",
    "Machine Learning With Python",
    "Data Analysis with Power BI",
    "Graphics Design",
    "Digital Marketing"
  ];

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

      const res = await fetch('api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, discountPrice }),
      })

      console.log(res)
      if(res.status==400){
        setErrors("This email is existing already")
      }
    }

    catch (err) {
      setErrors(err.message)
      console.log("this is the error", err)
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-xl bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">

        <img src="/images-removebg-preview.png" className="h-10 mx-auto mb-4" />

        <h1 className="text-3xl font-bold text-center text-black mb-2">
            Loctech's Easter Discount Panel
        </h1>

        <p className="text-center text-gray-600 mb-6 text-sm">
         Login to see Leads
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <div>
            <input
              type="text"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-white text-black border-2 ${errors.email ? "border-red-500" : "border-gray-400"
                } outline-none focus:ring-2 focus:ring-[#da2721]`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* PHONE */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-white text-black border-2 ${errors.password ? "border-red-500" : "border-gray-400"
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