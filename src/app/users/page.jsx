"use client";
import { useState, useEffect } from "react";
import Logout from "../components/Logout";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/enroll?location=${filter}&page=${page}&limit=20`);
            const data = await res.json();
            if (res.ok) {
                setUsers(data.users);
                setTotalPages(data.pagination.pages);
            }
        } catch (err) {
            console.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filter, page]);

    const handleExportCSV = async () => {
        try {
            // 1. Fetch ALL data based on current filter
            const res = await fetch(`/api/enroll/export?location=${filter}`);
            const data = await res.json();
            const allUsers = data.users;

            if (allUsers.length === 0) return alert("No data to export");


            const headers = ["Full Name", "Email", "Phone", "Course", "Discount", "Price To Pay", "Mode Of Learning", "Date Enrolled"];

            const csvRows = allUsers.map(user => [
                `"${user.username}"`,
                `"${user.email}"`,
                `"${user.phone}"`,
                `"${user.course}"`,
                `"${user.discount}"`,
                `"${user.finalPrice}"`,
                `"${user.modeOfLearning}"`,
                `"${user.location}"`,
                `"${new Date(user.createdAt).toLocaleDateString()}"`
            ].join(","));

            // 4. Combine headers and rows
            const csvContent = [headers.join(","), ...csvRows].join("\n");

            // 5. Create a download link and click it programmatically
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `loctech-easter-discount${filter}_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Export Error:", err);
            alert("Could not export data");
        }
    };

    return (

        <div className="overflow-hidden">
            <Logout />

            <div className="px-3 flex flex-col md:flex-row justify-between items-center mb-8 gap-4  md:px-4">
                <h1 className="text-2xl font-bold text-gray-800">Leads</h1>

                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                </button>

                {/* Filter Dropdown */}
                <select
                    value={filter}
                    onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                    className="p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                >
                    <option value="all">All Locations</option>
                    <option value="portHarcourt">portharcourt</option>
                    <option value="enugu">enugu</option>
                    {/* You can also filter by specific city if your schema stores city data */}
                </select>
            </div>
            <div className="hidden md:block p-8 max-w-10xl mx-auto">


                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left scroll-auto">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Course</th>
                                <th className="px-6 py-4">Discount</th>
                                <th className="px-6 py-4">Price To Pay</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Mode of learning</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-10 text-gray-400">Loading leads...</td></tr>
                            ) : users.map((user) => (
                                <tr key={user._id} className="transition odd:bg-gray-200">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.username}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.course}</td>
                                    <td className="px-6 py-4 font-semibold text-green-700 ">-{user.discountPrice}%</td>
                                    <td className="px-6 py-4 text-gray-600">{user.finalPrice ? `₦${Number(user.finalPrice).toLocaleString()}` : 'N/A'}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.location}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.modeOfLearning === 'online' ? 'bg-blue-400 text-white' : 'bg-green-400 text-white -700'
                                            }`}>
                                            {user.modeOfLearning}
                                        </span>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>






            </div>

<div className="md:hidden divide-y divide-gray-100">
  {users.map((user) => (
    <div key={user._id} className="p-5 space-y-3 active:bg-gray-50 bg-slate-300 mt-3 ring-1 border-gray-700 rounded-lg">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm font-bold text-gray-900">{user.username}</p>
          <p className="text-xs text-gray-600">{user.email}</p>
          <p className="text-xs text-gray-600">{user.phone}</p>
        </div>
        
        {/* Dynamic Badge Color Logic */}
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
          user.modeOfLearning?.toLowerCase() === 'online' 
            ? 'bg-blue-400 text-white' 
            : 'bg-green-600 text-white'
        }`}>
          {user.modeOfLearning}
        </span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-400">
        <span className="text-xs">Enrolled Course:</span>
        <span className="text-xs font-medium text-black">{user.course}</span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-400">
        <span className="text-xs">Price To Pay:</span>
        <span className="text-xs font-bold text-black">
          {user.finalPrice 
            ? Number(user.finalPrice).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }) 
            : 'N/A'}
        </span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-400">
        <span className="text-xs">Discount:</span>
        <span className="text-sm font-semibold  text-green-700">-{user.discountPrice}%</span>
      </div>
    </div>
  ))}
</div>


            {!loading && users.length === 0 && (
                <div className="p-10 text-center text-gray-400">No leads found.</div>
            )}


            <div className="mt-6 flex justify-center gap-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2 text-gray-600">Page {page} of {totalPages}</span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
                >
                    Next
                </button>
            </div>



        </div>



    );
}