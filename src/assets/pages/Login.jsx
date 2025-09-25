import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";

const Login = ({ switchMode, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (onLogin) onLogin();
    } catch (err) {
      setError("Email atau password salah!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#a32116] px-4">
      {/* Welcome Title */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-white">WELCOME</h1>
      <p className="text-white mt-2 text-lg">Monitor your chilies with us</p>

      {/* Card Login */}
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-lg shadow-lg mt-10 w-full max-w-md p-8 text-center"
      >
        <h2 className="text-2xl font-bold mb-6">LOGIN</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-full bg-[#a32116] text-white placeholder-white outline-none mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-full bg-[#a32116] text-white placeholder-white outline-none mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-3 rounded-full bg-[#a32116] text-white font-semibold hover:bg-[#871c12] transition"
        >
          Login
        </button>

        <p className="mt-6 text-sm text-black">
          Doesn't have an account?{" "}
          <span
            className="text-[#a32116] font-semibold cursor-pointer hover:underline"
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
