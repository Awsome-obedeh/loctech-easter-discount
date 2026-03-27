"use client";
import { useEffect, useState } from "react";

export default function Countdown({ onExpire }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [expired, setExpired] = useState(false);

    const targetDate = new Date("April 18, 2026 23:59:59").getTime();

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance <= 0) {
                clearInterval(timer);
                setExpired(true);
                if (onExpire) onExpire(); // Notify parent Home
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((distance / (1000 * 60)) % 60);
            const seconds = Math.floor((distance / 1000) % 60);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // EXPIRED VIEW
    if (expired) {
        return (
            <div className="text-center mt-8">
                <p className="text-red-600 font-semibold text-lg">
                    Offer Expired
                </p>
            </div>
        );
    }

    // ACTIVE COUNTDOWN
    return (
        <div className="flex justify-center gap-4 mt-8">
            {["days", "hours", "minutes", "seconds"].map((unit) => (
                <div
                    key={unit}
                    className="bg-black text-white rounded-xl px-4 py-3 w-20 text-center shadow-md"
                >
                    <p className="text-2xl font-bold text-center">
                        {String(timeLeft[unit]).padStart(2, "0")}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-white/70 text-center">
                        {unit}
                    </p>
                </div>
            ))}
        </div>
    );
}