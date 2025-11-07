import React, { useState } from "react";
import axios from "axios";

const API_BASE = "https://linkedin-clone-appdost-m3go.onrender.com/api/auth";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("❌ Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/signup`, { name, email, password }, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 201 || res.status === 200) {
        alert("✅ Account created successfully! Please login.");
        window.location.href = "/"; // redirect to login page
      } else {
        alert(res.data?.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      const msg = err.response?.data?.message || err.message || "Server error";
      alert("❌ " + msg);
    }
  };

  return (
    <div className="login-page">
      <h2>Create your LinkedIn Clone Account</h2>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="btn-primary">Create Account</button>
      </form>
      <p>
        Already registered?{" "}
        <span className="link" onClick={() => (window.location.href = "/")}>
          Login
        </span>
      </p>
    </div>
  );
}
