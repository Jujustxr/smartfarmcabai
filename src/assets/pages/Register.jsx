import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";

const Register = ({ onRegister, switchMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onRegister(); // update user di App.jsx
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email sudah terdaftar!");
      } else if (err.code === "auth/invalid-email") {
        setError("Format email tidak valid!");
      } else if (err.code === "auth/weak-password") {
        setError("Password minimal 6 karakter!");
      } else {
        setError("Gagal membuat akun! (" + err.message + ")");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      {/* Welcome Title */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-[#a32116]">WELCOME</h1>
      <p className="text-[#a32116] mt-2 text-lg">Monitor your chilies with us</p>

      {/* Card Register */}
      <form
        onSubmit={handleRegister}
        className="bg-[#a32116] rounded-lg shadow-lg mt-10 w-full max-w-md p-8 text-center"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">REGISTER</h2>
        {error && <p className="text-yellow-300 text-sm mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-full bg-white text-[#a32116] placeholder-[#a32116] outline-none mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-full bg-white text-[#a32116] placeholder-[#a32116] outline-none mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-3 rounded-full bg-white text-[#a32116] font-semibold hover:bg-gray-100 transition"
        >
          Register
        </button>

        <p className="mt-6 text-sm text-white">
          Already have an account?{" "}
          <span
            className="text-yellow-300 font-semibold cursor-pointer hover:underline"
            onClick={switchMode}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
