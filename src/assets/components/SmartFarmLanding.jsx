import React from "react";
import chili from "../Chili.png";

export default function SmartFarmLanding({ onLoginClick, onRegisterClick }) {
  return (
    <div className="w-screen h-screen min-h-screen bg-white flex items-center justify-center p-0 overflow-x-hidden">
      <div className="w-full h-full flex flex-col lg:flex-row items-stretch">
        {/* LEFT - Title + CTA */}
        <div className="flex-1 flex flex-col justify-center items-center lg:items-end px-8 py-12 z-10">
          <div className="bg-white rounded-2xl shadow-md p-8 w-80 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight text-center">SMARTFARM: Cabai</h1>
            <p className="mt-3 text-md text-[#b83a2f] text-center">Monitor your chilies with us</p>
            <div className="mt-10 flex flex-col gap-4 w-full">
              <button
                className="bg-[#8f1f18] hover:bg-[#7b1a15] text-white font-semibold py-3 px-7 rounded-2xl shadow-md w-full text-lg"
                onClick={onLoginClick}
              >
                LOGIN
              </button>
              <button
                className="bg-[#8f1f18] hover:bg-[#7b1a15] text-white font-semibold py-3 px-7 rounded-2xl shadow-md w-full text-lg"
                onClick={onRegisterClick}
              >
                REGISTER
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE - tall red band with chili image overlapping */}
        <div className="relative flex-1 flex items-center justify-center min-h-[400px]">
          {/* colored vertical band */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-32 bg-[#8f1f18] rounded-md shadow-inner z-0"></div>
          {/* chili image - placed absolute so it overlaps the band and casts shadow */}
          <img
            src={chili}
            alt="cabai"
            className="absolute left-1/2 top-0 -translate-x-1/2 z-10 w-[420px] lg:w-[700px] drop-shadow-2xl object-contain"
            style={{ filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.25))" }}
          />
        </div>

        {/* RIGHT - About Us box */}
        <div className="flex-1 flex justify-center items-center px-8 py-12">
          <div className="bg-white rounded-2xl shadow-md p-8 w-80 flex flex-col items-center">
            <div className="bg-[#8f1f18] rounded-2xl shadow-md px-6 py-3 text-white text-2xl font-bold mb-2 w-full text-center">
              ABOUT US
            </div>
            <div className="mt-6 text-left text-sm leading-6">
              <p className="font-semibold">SmartFarm: Cabai is a modern farming initiative dedicated to optimizing chili cultivation through technology, innovation, and sustainable practices. We combine traditional agricultural knowledge with smart solutions—such as automated monitoring, data-driven insights, and eco-friendly techniques—to improve productivity, quality, and efficiency in chili farming.</p>
              <p className="mt-4 font-semibold">Our mission is to empower farmers, support food security, and bring high-quality cabai (chili) to the market while reducing environmental impact. With SmartFarm: Cabai, farming is not just about growing crops, but also about building a smarter, greener, and more resilient future for agriculture.</p>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12h18" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 3v18" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#2563EB" strokeWidth="1.5" />
                <path d="M14 8h1.5V5.5H14c-1.72 0-3 1.3-3 3.1V11H9v2h2v6h2v-6h1.6l.4-2H13V9.2c0-.3.2-.6.5-.6z" fill="#2563EB" />
              </svg>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="#ff7a59" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="3" stroke="#ff7a59" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          img { max-width: 280px }
        }
      `}</style>
    </div>
  );
}
