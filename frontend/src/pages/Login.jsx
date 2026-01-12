import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import "../index.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e, customEmail, customPassword, isRetry = false) {
    if (e) e.preventDefault();

    const loginEmail = customEmail || email;
    const loginPassword = customPassword || password;

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/feed");
      } else {
        // If guest login fails with 404, try to create account
        if (res.status === 404 && loginEmail === "guest@vybe.com" && !isRetry) {
          console.log("Guest not found. Auto-creating...");
          await handleGuestSignup(loginEmail, loginPassword);
          return;
        }
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert(`❌ Login error: ${err.message}`);
    }
  }

  const handleGuestSignup = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Guest User", email, password }),
      });

      if (res.ok) {
        // Now login again with retry flag
        handleLogin(null, email, password, true);
      } else {
        const data = await res.json();
        alert("Could not create Guest Account: " + data.message);
      }
    } catch (err) {
      alert("Guest Signup Error: " + err.message);
    }
  };

  const handleGuestLogin = () => {
    const guestEmail = "guest@vybe.com";
    const guestPass = "vybe123";
    setEmail(guestEmail);
    setPassword(guestPass);
    handleLogin(null, guestEmail, guestPass);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black relative overflow-hidden font-['Outfit'] bg-halftone">

      {/* 🟠 Floating Orange Stars (Decorations) */}
      <Sparkles className="absolute top-20 left-20 text-[#F47521] w-12 h-12 star-icon" />
      <Sparkles className="absolute bottom-40 right-40 text-[#F47521] w-8 h-8 star-icon" style={{ animationDelay: '1s' }} />
      <Sparkles className="absolute top-40 right-[20%] text-white w-6 h-6 star-icon" style={{ animationDelay: '2s' }} />

      <div className="flex flex-col lg:flex-row gap-20 items-center z-10 w-full max-w-6xl px-10">

        {/* Left Side: Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col gap-4 text-white flex-1"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-[#F47521] flex items-center justify-center">
              <span className="text-black font-black text-2xl tracking-tighter">Vy</span>
            </div>
            <span className="text-[#F47521] font-black text-3xl tracking-tight">VYBE ECHO</span>
          </div>

          <h1 className="text-7xl font-extrabold leading-[0.9] tracking-tight">
            UNLEASH <br />
            <span className="text-[#F47521]">YOUR VOICE.</span>
          </h1>
          <p className="text-2xl font-bold text-white mt-4">
            Join the <span className="text-[#F47521] underline decoration-4 underline-offset-4">loudest</span> community.
          </p>
          <p className="text-gray-400 text-lg max-w-md">
            Stream thoughts, share stories, and amplify your frequency. No text, just vibes.
          </p>
        </motion.div>

        {/* Right Side: Bold Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-full max-w-[420px]"
        >
          <div className="bg-[#111] p-8 rounded-[32px] border-2 border-[#333] shadow-[0_0_0_10px_rgba(30,30,30,0.5)] relative">

            {/* Orange Badge */}
            <div className="absolute -top-6 -right-6 bg-[#F47521] text-black font-black text-sm px-4 py-2 rounded-full rotate-12 shadow-lg border-2 border-white">
              LOGIN NOW!
            </div>

            <h2 className="text-3xl font-extrabold text-white mb-2">WELCOME BACK!</h2>
            <div className="w-16 h-2 bg-[#F47521] rounded-full mb-8"></div>

            {/* Main Login Form */}
            <form onSubmit={(e) => handleLogin(e)} className="flex flex-col gap-5">
              <div>
                <label className="text-white text-sm font-bold uppercase tracking-wider ml-1">Email</label>
                <input
                  type="email"
                  className="w-full mt-2 p-4 rounded-xl bg-black border-2 border-[#333] text-white outline-none focus:border-[#F47521] transition-all font-bold placeholder:text-gray-700 hover:border-gray-500"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-white text-sm font-bold uppercase tracking-wider ml-1">Password</label>
                <input
                  type="password"
                  className="w-full mt-2 p-4 rounded-xl bg-black border-2 border-[#333] text-white outline-none focus:border-[#F47521] transition-all font-bold placeholder:text-gray-700 hover:border-gray-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#F47521] text-black font-black text-xl hover:bg-white hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-[0_10px_0_#d6641a] hover:shadow-[0_10px_0_#ccc] active:translate-y-[5px] active:shadow-none"
                >
                  LOG IN <ArrowRight size={24} strokeWidth={3} />
                </button>

                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="w-full py-4 rounded-full bg-[#222] text-white font-bold text-lg border-2 border-[#333] hover:bg-[#333] flex items-center justify-center gap-2 transition-all"
                >
                  <UserCheck size={20} /> Guest Access
                </button>
              </div>
            </form>

            <div className="mt-8 text-center bg-[#222] py-3 rounded-xl">
              <span className="text-gray-400 font-bold text-sm">New here? </span>
              <Link to="/signup" className="text-[#F47521] font-black hover:underline uppercase">
                Create Account
              </Link>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
