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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Judul Welcome */}
      <h1 className="text-4xl font-bold text-red-800 mb-2">WELCOME</h1>
      <p className="text-gray-700 mb-6">Monitor your chilies with us</p>

      {/* Card Register */}
      <form
        onSubmit={handleRegister}
        className="bg-red-800 rounded-lg shadow-lg mt-10 w-full max-w-md p-8 text-center"
      >
        <h2 className="text-xl font-bold mb-4 text-center">REGISTER</h2>
        {error && <p className="text-yellow-300 text-sm mb-3">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded-full text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 rounded-full text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-white text-red-800 font-semibold p-2 rounded-full"
        >
          Register
        </button>
        <p className="text-sm mt-3 text-center text-white">
          Already have an account?{" "}
          <span
            className="text-yellow-300 cursor-pointer font-semibold"
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
