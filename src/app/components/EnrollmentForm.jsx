"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import SuccessModal from "./SuccessfulModal";
import { courses } from "@/lib/courses";

export default function EnrollmentForm() {
    const searchParams = useSearchParams();
    // let discountPrice = searchParams.get('d') || "0";
    // discountPrice = discountPrice > 40 ? discountPrice : 30;

    const [discountPrice, setDiscountPrice] = useState('')
    const [form, setForm] = useState({
        username: "",
        phone: "",
        email: "",
        modeOfLearning: "",
        course: "",
        location: ""

    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);


    let newErrors = {};
    let finalPrice = ""

    useEffect(() => {
        const saved = localStorage.getItem("loctech-easter");

        if (saved) {
            const data = JSON.parse(saved);
            const discountPrice = data.discount <= 40 ? data.discount : 30

            setDiscountPrice(discountPrice);

        }
    }, []);

    console.log("discountPrice:", discountPrice)
    finalPrice = form.coursePrice - (form.coursePrice * (Number(discountPrice) / 100));

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleCourseChange = (e) => {
        const selectedCourseName = e.target.value;

        // Find the course object that matches the selected name
        const selectedCourse = courses.find(c => c.courseName === selectedCourseName);

        setForm({
            ...form,
            course: selectedCourseName,
            coursePrice: selectedCourse ? selectedCourse.price : ""
        });

        setErrors({ ...errors, course: "" });
    };

    const validate = () => {


        if (!form.username.trim()) newErrors.name = "Full name is required";

        const phoneRegex = /^([0-9]\s*){10,15}$/;

        if (!form.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(form.phone)) {
            newErrors.phone = "Enter a valid phone number without country code";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Enter a valid email";
        }

        if (!form.modeOfLearning) newErrors.mode = "Select learning mode";
        if (!form.course) newErrors.course = "Select a course";
        if (!form.location) newErrors.location = "Select a location";

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
            // --- SANITIZATION STEP ---
            const cleanedPhone = form.phone.replace(/\s+/g, '');
            setLoading(true)
            const res = await fetch('api/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, phone: cleanedPhone, discountPrice, finalPrice }),
            })

            const data=await res.json()

            console.log(res)
            if (res.ok) {
                setIsModalOpen(true)
                setLoading(false)
                setForm({
                    username: "",
                    phone: "",
                    email: "",
                    modeOfLearning: "",
                    course: "",
                    price: "",
                    location: ""
                });

                setErrors({});

            }
            if (res.status == 400) {
                newErrors.error = data.message
                setErrors(newErrors)
                setLoading(false)

            }

            if (res.status == 500) {
                newErrors.serverError = data.message
                setErrors(newErrors)
                setLoading(false)
            }


        }

        catch (err) {
            setErrors(err.message)
            console.log("this is the error", err)
        }
    };




    return (
        <div className="">

            <main className="min-h-screen bg-white flex items-center justify-center px-6 py-10">

                <div className="w-full max-w-xl bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">

                    <img src="/images-removebg-preview.png" className="h-10 mx-auto mb-4" />

                    <h1 className="text-sm  md:text-lg lg:text-3xl font-bold text-center text-black mb-2">
                        Enroll in a Course
                    </h1>

                    <p className="text-center text-gray-600 mb-6 text-sm">
                        Claim your Easter discount before it expires
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {errors.serverError && <p className="text-red-500 text-sm mt-1">{errors.serverError}</p>}


                        {/* NAME */}
                        <div>
                            <input
                                type="text"
                                name="username"
                                placeholder="Full Name"
                                onChange={handleChange}
                                value={form.username ? form.username : ''}
                                className={`w-full p-3 rounded-lg bg-white text-black border-2 ${errors.name ? "border-red-500" : "border-gray-400"
                                    } outline-none focus:ring-2 focus:ring-[#da2721]`}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* PHONE */}
                        <div>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                onChange={handleChange}
                                value={form.phone ? form.phone : ''}
                                className={`w-full p-3 rounded-lg bg-white text-black border-2 ${errors.phone ? "border-red-500" : "border-gray-400"
                                    } outline-none focus:ring-2 focus:ring-[#da2721]`}
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        {/* EMAIL */}
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                onChange={handleChange}
                                value={form.email ? form.email : ''}
                                className={`w-full p-3 rounded-lg bg-white text-black border-2 ${errors.email || errors.error ? "border-red-500" : "border-gray-400"
                                    } outline-none focus:ring-2 focus:ring-[#da2721]`}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            {errors.error && <p className="text-red-500 text-sm mt-1">{errors.error}</p>}
                        </div>

                        {/* MODE */}
                        <div>
                            <select
                                name="modeOfLearning"
                                onChange={handleChange}
                                className={`w-full p-3 rounded-lg bg-white text-black border ${errors.mode ? "border-red-500" : "border-gray-400"
                                    } outline-none focus:ring-2 focus:ring-[#da2721]`}
                            >
                                <option value="">Mode of Learning</option>
                                <option value="online">Online</option>
                                <option value="inPerson">In Person</option>
                            </select>
                            {errors.mode && <p className="text-red-500 text-sm mt-1">{errors.mode}</p>}
                        </div>

                        {/* COURSE */}
                        <div>
                            <select
                                name="course"
                                value={form.course ? form.course : ''}
                                onChange={handleCourseChange} // Use a specific handler for courses
                                className={`w-full p-3 rounded-lg bg-white text-black border ${errors.course ? "border-red-500" : "border-gray-400"
                                    } outline-none focus:ring-2 focus:ring-[#da2721]`}
                            >
                                <option value="">Select Course</option>
                                {courses.map((c) => (
                                    <option key={c.id} value={c.courseName}>
                                        {c.courseName} - ₦{c.price.toLocaleString()}
                                    </option>
                                ))}
                            </select>
                            {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
                        </div>

                        <div>
                            <select name="location"
                                onChange={handleChange}
                                className={`w-full p-3 rounded-lg bg-white text-black border ${errors.location ? "border-red-500" : "border-gray-400"
                                    } outline-none focus:ring-2 focus:ring-[#da2721]`}>
                                <option >Select a Location</option>
                                <option value="portHarcourt">Port-Harcourt</option>
                                <option value="enugu">Enugu</option>
                                <option value="remote">Remote</option>
                            </select>
                            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                        </div>



                        {
                            form.course && (
                                <div className="bg-gray-600 p-3 rounded-md">
                                    <p className="text-md text-white py-2 ">Applied Discount :<span className="font-semibold">{discountPrice}</span>%</p>
                                    <p className="text-md text-white">Discount Price : <span className="font-semibold">₦{finalPrice.toLocaleString()}</span></p>
                                </div>
                            )
                        }


                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 ${loading ? 'bg-[#801d1a]' : 'bg-[#da2721]'}  text-white rounded-lg font-semibold shadow-md hover:scale-105 transition`}
                        >
                            {loading ? "Processing..." : "Enroll Now"}
                        </button>

                    </form>
                </div>





            </main>

            <SuccessModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}