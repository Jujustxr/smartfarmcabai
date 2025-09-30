import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";

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
  const [user, setUser] = useState(null); // 🔑 auth state
  const [mode, setMode] = useState("login");
  const [showLanding, setShowLanding] = useState(true);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    // cek session pertama kali
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
    };
    getUser();

    // listen perubahan auth
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
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
        onLogin={() => {
          supabase.auth.getUser().then(({ data }) => setUser(data.user));
        }}
        switchMode={() => setMode("register")}
      />
    ) : (
      <Register
        onRegister={() => {
          supabase.auth.getUser().then(({ data }) => setUser(data.user));
        }}
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
        onLogout={() => supabase.auth.signOut()}
      />
      <PageTransition key={currentPage}>{renderPage()}</PageTransition>
    </div>
  );
};

export default App;
