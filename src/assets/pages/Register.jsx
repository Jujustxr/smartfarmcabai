import React, { useState } from "react";
import heroImage from "../cabe.jpeg";

export default function Signup({ onRegister, switchMode }) {
  const [leaving, setLeaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ fullName: "", email: "", password: "" });

  const validate = () => {
    const next = { fullName: "", email: "", password: "" };
    if (!fullName.trim()) next.fullName = "Full name is required.";
    if (!email.trim()) next.email = "Email is required.";
    // simple email pattern
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    return !next.fullName && !next.email && !next.password;
  };

  const handleCreate = (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    if (onRegister) onRegister({ fullName, email, password });
    setLeaving(true);
    setTimeout(() => {
      if (switchMode) switchMode();
    }, 300);
  };

  const handleSignIn = (e) => {
    if (e) e.preventDefault();
    setLeaving(true);
    setTimeout(() => {
      if (switchMode) switchMode();
    }, 300);
  };

  return (
    <div className={`flex h-screen #F2F2ED transition-transform duration-300 ${leaving ? 'opacity-0 translate-x-6' : 'opacity-100'}`}>
      {/* LEFT FORM */}
      <div className="w-1/2 flex flex-col justify-center px-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-10">Sign Up</h1>

        {/* Name */}
        <label className="text-gray-700 font-medium">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={`border mt-2 mb-2 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-800 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Your Name"
        />
        {errors.fullName ? <p className="text-red-500 text-sm mb-2">{errors.fullName}</p> : null}

        {/* Email */}
        <label className="text-gray-700 font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`border mt-2 mb-2 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-800 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter Email"
        />
        {errors.email ? <p className="text-red-500 text-sm mb-2">{errors.email}</p> : null}

        {/* Password */}
        <label className="text-gray-700 font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`border mt-2 mb-2 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-800 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Create Password"
        />
        {errors.password ? <p className="text-red-500 text-sm mb-2">{errors.password}</p> : null}

        <button onClick={handleCreate} className="bg-black text-white py-3 rounded-lg w-full font-semibold tracking-wider hover:bg-gray-800 transition">
          CREATE ACCOUNT
        </button>

        <p className="mt-8 text-gray-600">
          Already have an account?
          <a href="/login" onClick={handleSignIn} className="text-black font-semibold ml-1 hover:underline">
            Sign in
          </a>
        </p>
      </div>

      {/* RIGHT IMAGE */}
      <div className="w-1/2 h-full relative">
        <img
          src={heroImage}
          className="w-full h-full object-cover"
          alt="Hero"
        />
        <div className="absolute inset-0 bg-white/10"></div>

        <div className="absolute top-1/3 left-16 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
          <h2 className="text-2xl font-light max-w-sm">
            SmartFarm:Cabai, Start to track your chilies with us.
          </h2>
          <a
            href="#"
            className="underline mt-4 inline-block text-white font-medium"
          >
            LEARN MORE
          </a>
        </div>
      </div>
    </div>
  );
}
