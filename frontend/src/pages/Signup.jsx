import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Account created successfully!");
        navigate("/");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      alert("❌ Signup failed: " + err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black relative overflow-hidden font-['Outfit'] bg-halftone">

      {/* 🟠 Decorations */}
      <Sparkles className="absolute top-10 right-10 text-[#F47521] w-16 h-16 star-icon" />
      <Sparkles className="absolute bottom-20 left-20 text-white w-10 h-10 star-icon" style={{ animationDelay: '1.5s' }} />

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
            JOIN THE <br />
            <span className="text-white bg-[#F47521] px-4 -rotate-2 inline-block transform mt-2">REVOLUTION.</span>
          </h1>
          <p className="text-xl font-bold text-gray-400 mt-6 max-w-lg">
            Don't just listen. Be heard. Create your account and start broadcasting your frequency to the world.
          </p>

          <div className="flex gap-4 mt-4">
            <div className="bg-[#222] px-6 py-3 rounded-xl border border-[#333] font-bold text-white">
              🔥 Trending Topics
            </div>
            <div className="bg-[#222] px-6 py-3 rounded-xl border border-[#333] font-bold text-white">
              🎙️ High Quality Audio
            </div>
          </div>
        </motion.div>

        {/* Right Side: Bold Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-full max-w-[450px]"
        >
          <div className="bg-[#111] p-8 rounded-[32px] border-2 border-[#333] shadow-[0_0_0_10px_rgba(30,30,30,0.5)] relative">

            {/* Decoration Circle */}
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#F47521] rounded-full blur-[40px] opacity-20 pointer-events-none"></div>

            <h2 className="text-3xl font-extrabold text-white mb-2">CREATE ACCOUNT</h2>
            <div className="w-16 h-2 bg-[#F47521] rounded-full mb-8"></div>

            <form onSubmit={handleSignup} className="flex flex-col gap-5">
              <div>
                <label className="text-white text-sm font-bold uppercase tracking-wider ml-1">Full Name</label>
                <input
                  type="text"
                  className="w-full mt-2 p-4 rounded-xl bg-black border-2 border-[#333] text-white outline-none focus:border-[#F47521] transition-all font-bold placeholder:text-gray-700 hover:border-gray-500"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-white text-sm font-bold uppercase tracking-wider ml-1">Email Address</label>
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
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className="mt-6 w-full py-4 rounded-full bg-[#F47521] text-black font-black text-xl hover:bg-white hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-[0_10px_0_#d6641a] hover:shadow-[0_10px_0_#ccc] active:translate-y-[5px] active:shadow-[0_5px_0_#ccc]"
              >
                SIGN UP <ArrowRight size={24} strokeWidth={3} />
              </button>
            </form>

            <div className="mt-8 text-center bg-[#222] py-3 rounded-xl">
              <span className="text-gray-400 font-bold text-sm">Already a member? </span>
              <Link to="/" className="text-[#F47521] font-black hover:underline uppercase">
                Log In
              </Link>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
