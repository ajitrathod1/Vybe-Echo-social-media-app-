import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Disc, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import "../index.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/feed");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert(`❌ Login error: ${err.message}`);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#050505] relative overflow-hidden font-['Space_Grotesk']">

      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/15 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#00f2ea]/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>

      <div className="flex flex-col lg:flex-row gap-20 items-center z-10 w-full max-w-6xl px-10">

        {/* Left Side: Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex flex-col gap-6 text-white flex-1"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00f2ea] to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,234,0.3)] mb-4"
          >
            <Disc className="text-black" size={32} />
          </motion.div>

          <h1 className="text-6xl font-bold leading-tight">
            Tune in to the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ea] to-purple-400">
              World's Frequency.
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
            The first voice-exclusive social network. Connect, listen, and share your thoughts through the power of sound.
          </p>
        </motion.div>

        {/* Right Side: Glass Card (Floating) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="p-10 rounded-3xl backdrop-blur-3xl bg-white/5 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-[450px] relative overflow-hidden group hover:border-[#00f2ea]/30 transition-all duration-500"
          >
            {/* Top Border Gradient */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-600 to-[#00f2ea]"></div>

            {/* Floating Glow Orb behind card */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00f2ea]/10 rounded-full blur-3xl pointer-events-none"></div>

            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-8 text-sm">Enter your credentials to access the stream.</p>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div>
                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">Email Address</label>
                <input
                  type="email"
                  className="w-full mt-2 p-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#00f2ea] focus:bg-[#00f2ea]/5 transition-all text-sm font-medium"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">Password</label>
                <input
                  type="password"
                  className="w-full mt-2 p-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#00f2ea] focus:bg-[#00f2ea]/5 transition-all text-sm font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-4 py-4 rounded-xl bg-white text-black font-bold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
              >
                Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="flex items-center gap-4 my-8">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-gray-600 text-xs font-mono">OR</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <Link to="/signup">
              <button className="w-full py-4 rounded-xl border border-white/10 text-gray-300 font-medium hover:bg-white/5 hover:text-white transition hover:border-[#00f2ea]/50">
                Create new account
              </button>
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
