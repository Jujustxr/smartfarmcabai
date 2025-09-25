import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";


const Login = ({ switchMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(); 
    } catch (err) {
      setError("Email atau password salah!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-2xl p-6 w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
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
          Login
        </button>
        <p className="text-sm mt-3 text-center">
          Belum punya akun?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={switchMode}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
