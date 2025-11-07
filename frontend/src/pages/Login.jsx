import React from "react";

export default function Login() {
  async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("https://linkedin-clone-appdost-m3go.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert(`Welcome back ${data.user.name}!`);
        window.location.href = "/feed";
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert(`❌ Login error: ${err.message}`);
    }
  }

  return (
    <div className="login-container">
      <h2>Sign In</h2>
      <form onSubmit={handleLogin}>
        <input type="email" id="email" placeholder="Email address" required />
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>
        Don’t have an account?{" "}
        <a href="/create">Create new account</a>
      </p>
    </div>
  );
}
