import { useState, useEffect } from "react";
import { auth } from "./lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import Navbar from "./assets/components/Navbar";
import PageTransition from "./assets/components/PageTransition";
import Dashboard from "./assets/pages/Dashboard";
import Monitor from "./assets/pages/Monitor";
import KontrolAkuator from "./assets/pages/KontrolAkuator";
import Riwayat from "./assets/pages/Riwayat";
import SmartFarmLanding from "./assets/components/SmartFarmLanding";

import useDarkMode from "./assets/hooks/useDarkMode";

// import halaman auth
import Login from "./assets/pages/Login.jsx";
import Register from "./assets/pages/Register.jsx";


const App = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  // 🔑 auth state
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");
  const [showLanding, setShowLanding] = useState(true);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard isDarkMode={isDarkMode} />;
      case "monitor":
        return <Monitor isDarkMode={isDarkMode} />;
      case "kontrol":
        return <KontrolAkuator isDarkMode={isDarkMode} />;
      case "riwayat":
        return <Riwayat isDarkMode={isDarkMode} />;
      default:
        return <Dashboard isDarkMode={isDarkMode} />;
    }
  };


  // 🔐 kalau belum login
  if (!user) {
    if (showLanding) {
      return (
        <SmartFarmLanding
          onLoginClick={() => { setShowLanding(false); setMode("login"); }}
          onRegisterClick={() => { setShowLanding(false); setMode("register"); }}
        />
      );
    }
    return mode === "login" ? (
      <Login
        onLogin={() => setUser(auth.currentUser)}
        switchMode={() => setMode("register")}
      />
    ) : (
      <Register
        onRegister={() => setUser(auth.currentUser)}
        switchMode={() => setMode("login")}
      />
    );
  }

  // ✅ kalau sudah login
  return (
    <div className="min-h-screen transition-colors duration-500 bg-pink-200 dark:bg-gray-900">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onLogout={() => signOut(auth)}
      />
      <PageTransition key={currentPage}>{renderPage()}</PageTransition>
    </div>
  );
};

export default App;
