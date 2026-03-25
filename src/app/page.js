"use client";
import { useState, useEffect } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Image from "next/image";

export default function Home() {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [discount, setDiscount] = useState(null);

  const eggs = [
    { img: "/egg-gold.png", name: "GET TRAINED", glow: "#da2721" },
    { img: "/egg-purple.png", name: "GET CERTIFIED", glow: "#d9e716" },
    { img: "/egg-cyan.png", name: "GET AHEAD", glow: "#ffffff" },
  ];

  
  useEffect(() => {
    const saved = localStorage.getItem("loctech-easter");

    if (saved) {
      const data = JSON.parse(saved);
      setSelected(data.selected);
      setDiscount(data.discount);
      setRevealed(true);
    }
  }, []);

  const handlePick = (i) => {
    
    if (selected !== null || revealed) return;

    setSelected(i);

    setTimeout(() => {
      
      // confetti
      const value = Math.floor(Math.random() * 11) + 30;
      setDiscount(value);
      setRevealed(true);

      // 
      localStorage.setItem(
        "loctech-easter",
        JSON.stringify({
          selected: i,
          discount: value,
        })
      );

      const end = Date.now() + 5000;
      (function frame() {
        confetti({ particleCount: 3, angle: 60, spread: 70, origin: { x: 0 } });
        confetti({ particleCount: 3, angle: 120, spread: 70, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }, 1400);
  };

  return (
    <main className="min-h-screen bg-gray-100 text-black px-6 py-6">

      <div className="flex justify-between items-center">
        {/* <img src="/images-removebg-preview.png" className="h-6" /> */}
        <Image src="/images-removebg-preview.png" width={200} height={100} alt="logog" className="h-3 w-4 object-center"></Image>
        <p className="text-2xl tracking-widest text-black">EASTER 2026</p>
      </div>

      <div className="text-center mt-20">
        <div className="inline-block px-4 py-1 text-xs border border-black/20 rounded-full text-black/80 mb-6">
          LIMITED TIME OFFER
        </div>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Unlock Your <br />
          Easter <span className="text-[#da2721]">Surprise</span>
        </h1>

        <p className="text-black/70 mt-4 max-w-md mx-auto">
          Pick one egg and get an exclusive discount on our IT courses.
        </p>
      </div>

      {/* EGGS */}
      <div className="flex justify-center gap-12 mt-16 text-black">

        {/*  OPTIONAL MESSAGE */}
        {revealed && (
          <p className="absolute mt-[-40px] text-sm text-black/60">
            You’ve already claimed your Easter reward 🎉
          </p>
        )}

        <AnimatePresence>
          {!revealed &&
            eggs.map((egg, i) => {
              if (selected !== null && selected !== i) return null;

              return (
                <motion.div
                  key={i}
                  onClick={() => handlePick(i)}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="flex flex-col items-center gap-3 cursor-pointer"
                >
                  <div className="relative group">

                    <div
                      className="absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition duration-300"
                      style={{ background: egg.glow }}
                    />

                    {selected !== i && (
                      <motion.img
                        src={egg.img}
                        className="w-28 relative z-10"
                        whileHover={{ scale: 1.1 }}
                      />
                    )}

                    {selected === i && (
                      <motion.div
                        className="relative w-28 h-36 z-10"
                        animate={{ rotate: [0, -8, 8, -6, 6, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        <motion.div
                          initial={{ x: 0, rotate: 0 }}
                          animate={{ x: -60, rotate: -35 }}
                          transition={{ duration: 0.9 }}
                          className="absolute inset-0 overflow-hidden"
                          style={{
                            clipPath: "polygon(0 0, 50% 0, 40% 100%, 0% 100%)",
                          }}
                        >
                          <img src={egg.img} className="w-full" />
                        </motion.div>

                        <motion.div
                          initial={{ x: 0, rotate: 0 }}
                          animate={{ x: 60, rotate: 35 }}
                          transition={{ duration: 0.9 }}
                          className="absolute inset-0 overflow-hidden"
                          style={{
                            clipPath: "polygon(50% 0, 100% 0, 100% 100%, 60% 100%)",
                          }}
                        >
                          <img src={egg.img} className="w-full" />
                        </motion.div>
                      </motion.div>
                    )}

                  </div>

                  {selected === null && (
                    <p className="text-xs text-black/60 tracking-widest">
                      {egg.name}
                    </p>
                  )}
                </motion.div>
              );
            })}
        </AnimatePresence>

      </div>

      {/* RESULT CARD */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-16"
          >
            <div className="rounded-xl">
              <div className="relative bg-gray-200 rounded-xl px-8 py-6 text-center max-w-sm">

                <h2 className="text-3xl font-bold text-[#da2721]">
                  Your discount is {discount}%
                </h2>

                <p className="mt-3 text-black/80">
                  You got {discount}% OFF!
                </p>

                <p className="text-sm text-black/60 mt-2">
                  Use this limited Easter discount to enroll in our IT program today.
                </p>

                <a href={`/enroll?d=${discount}`}>
                  <button className="mt-5 px-6 py-3 bg-[#da2721] rounded-lg hover:scale-105 transition">
                    Enroll Now
                  </button>
                </a>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center text-xs text-black/50 mt-20">
        © 2026 Loctech. All rights reserved.
      </div>

    </main>
  );
}