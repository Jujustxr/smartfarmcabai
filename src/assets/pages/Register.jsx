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
      // Tampilkan pesan error sesuai kode error dari Firebase
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
    <div className="flex items-center justify-center min-h-screen bg-pink-100">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-md rounded-2xl p-6 w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-pink-400 text-white p-2 rounded"
        >
          Register
        </button>
        <p className="text-sm mt-3 text-center">
          Sudah punya akun?{" "}
          <span
            className="text-blue-500 cursor-pointer"
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
