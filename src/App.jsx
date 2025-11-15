"use client"

import { useState, useEffect } from "react"
import { supabase } from "./lib/supabaseClient"

import Navbar from "./assets/components/Navbar"
import PageTransition from "./assets/components/PageTransition"
import Dashboard from "./assets/pages/Dashboard"
import Monitor from "./assets/pages/Monitor"
import KontrolAkuator from "./assets/pages/KontrolAkuator"
import Riwayat from "./assets/pages/Riwayat"
import SmartFarmLanding from "./assets/components/SmartFarmLanding"

import useDarkMode from "./assets/hooks/useDarkMode"

// import halaman auth
import Login from "./assets/pages/Login.jsx"
import Register from "./assets/pages/Register.jsx"

const App = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [user, setUser] = useState(null); // 🔑 auth state
  const [mode, setMode] = useState("login");
  const [showLanding, setShowLanding] = useState(true);
  const [authError, setAuthError] = useState("");
  const [transitionType, setTransitionType] = useState('fade');
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    // cek session pertama kali
    const getUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data?.session?.user || null)
    }
    getUser()

    // listen perubahan auth
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard isDarkMode={isDarkMode} />
      case "monitor":
        return <Monitor isDarkMode={isDarkMode} />
      case "kontrol":
        return <KontrolAkuator isDarkMode={isDarkMode} />
      case "riwayat":
        return <Riwayat isDarkMode={isDarkMode} />
      default:
        return <Dashboard isDarkMode={isDarkMode} />
    }
  }

  //🔐 kalau belum login
  if (!user) {
    if (showLanding) {
      return (
        <SmartFarmLanding
          onLoginClick={() => { setShowLanding(false); setMode("login"); setTransitionType('fade'); }}
          onRegisterClick={() => { setShowLanding(false); setMode("register"); setTransitionType('blink'); }}
        />
      );
    }
    return mode === "login" ? (
      <Login
        onLogin={async (creds) => {
          // If credentials are provided, try to sign in with Supabase
          try {
            if (creds && creds.email && creds.password) {
              const { data, error } = await supabase.auth.signInWithPassword({
                email: creds.email,
                password: creds.password,
              });
              if (error) {
                // network or auth error
                console.error("Supabase signIn error:", error);
                // Better message for network issues
                const msg = error.message || String(error);
                if (msg.toLowerCase().includes("failed to fetch") || msg.toLowerCase().includes("network")) {
                  setAuthError("Network error while contacting Supabase. Check your internet and that your Supabase project allows requests from this origin (Auth > Settings > Allowed origins / Site URL).\nOrigin: " + window.location.origin);
                } else {
                  setAuthError(msg);
                }
                return;
              }
              setAuthError("");
              setUser(data.user || null);
              // slide animation into dashboard
              setTransitionType('slide');
              setCurrentPage("dashboard");
              return;
            }

            // Fallback: try to read current session
            const { data } = await supabase.auth.getUser();
            setAuthError("");
            setUser(data?.user || null);
            setTransitionType('slide');
            setCurrentPage("dashboard");
          } catch (err) {
            console.error("Login error:", err);
            // If fetch failed due to CORS or network, surface clearer guidance
            if (err instanceof TypeError && err.message === 'Failed to fetch') {
              setAuthError("Network error: could not reach Supabase. Make sure VITE_SUPABASE_URL is correct and that your Supabase project's Allowed Origins include " + window.location.origin + ".");
            } else {
              setAuthError("Login failed. Please try again.");
            }
          }
        }}
        authError={authError}
        switchMode={() => { setMode("register"); setTransitionType('blink'); }}
      />
    ) : (
      <Register
        onRegister={() => {
          supabase.auth.getUser().then(({ data }) => setUser(data.user))
        }}
        switchMode={() => { setMode("login"); setTransitionType('fade'); }}
      />
    )
  }

  // ✅ kalau sudah login
  return (
    <div className="min-h-screen transition-colors duration-500 bg-stone-50 dark:bg-slate-900">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onLogout={() => supabase.auth.signOut()}
      />
      <PageTransition key={currentPage} type={transitionType}>{renderPage()}</PageTransition>
    </div>
  )
}

export default App
