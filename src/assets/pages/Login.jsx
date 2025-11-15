import React, { useState } from "react";
import heroImage from "../cabe.jpeg"; 

export default function Login({ onLogin, switchMode, authError }) {
  const [leaving, setLeaving] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [dismissed, setDismissed] = useState(false);

  const validate = () => {
    const next = { email: "", password: "" };
    if (!email.trim()) next.email = "Email is required.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    return !next.email && !next.password;
  };

  const handleSignUp = (e) => {
    if (e) e.preventDefault();
    setLeaving(true);
    setTimeout(() => {
      if (switchMode) switchMode();
    }, 300);
  };

  const handleSignIn = (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    if (onLogin) onLogin({ email, password });
  };

  return (
    <div className={`flex h-screen #F2F2ED transition-transform duration-300 ${leaving ? 'opacity-0 -translate-x-6' : 'opacity-100'}`}>
      {/* LEFT FORM */}
      {authError && !dismissed ? (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-3xl w-[90%] bg-red-600 text-white rounded-xl p-4 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-1 text-sm whitespace-pre-line">{authError}</div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigator.clipboard && navigator.clipboard.writeText(window.location.origin)}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded"
              >
                Copy origin
              </button>
              <button onClick={() => setDismissed(true)} className="text-white/80 underline text-sm">Dismiss</button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="w-1/2 flex flex-col justify-center px-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-10">Sign In</h1>

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
          placeholder="Enter Password"
        />
        {errors.password ? <p className="text-red-500 text-sm mb-2">{errors.password}</p> : null}

        <a className="text-gray-500 text-sm mb-6 hover:underline" href="#">
          Forgot Password?
        </a>

        <button onClick={handleSignIn} className="bg-black text-white py-3 rounded-lg w-full font-semibold tracking-wider hover:bg-gray-800 transition">
          SIGN IN
        </button>

        <p className="mt-8 text-gray-600">
          Don't have an account?
          <a href="/signup" onClick={handleSignUp} className="text-black font-semibold ml-1 hover:underline">
            Sign up
          </a>
        </p>
      </div>

      {/* RIGHT SIDE IMAGE */}
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
