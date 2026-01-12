import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Briefcase,
  MessageCircle,
  Bell,
  X,
  Zap,
  Globe,
  Compass,
} from "lucide-react";
import "./Navbar.css"; // animation ke liye optional CSS

export default function Navbar({ setActivePage }) {
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("👋 Logged out successfully!");
    navigate("/");
  };

  return (
    <>
      <nav className="flex justify-between items-center bg-white shadow-md p-4 sticky top-0 z-20">
        <div
          onClick={() => setActivePage("home")}
          className="flex items-center gap-2 text-purple-600 font-bold text-lg cursor-pointer"
        >
          <Zap size={28} className="fill-current" />
          <span className="text-xl tracking-tight">Vybe</span>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setActivePage("home")}
            className="text-gray-700 hover:text-purple-600 flex items-center gap-1"
          >
            <Home size={18} /> Feed
          </button>

          <button
            onClick={() => setActivePage("network")}
            className="text-gray-700 hover:text-purple-600 flex items-center gap-1"
          >
            <Globe size={18} /> Circle
          </button>

          <button
            onClick={() => setActivePage("jobs")}
            className="text-gray-700 hover:text-purple-600 flex items-center gap-1"
          >
            <Compass size={18} /> Explore
          </button>

          <button
            onClick={() => setShowMessages(true)}
            className="text-gray-700 hover:text-purple-600 flex items-center gap-1"
          >
            <MessageCircle size={18} /> Messaging
          </button>

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-gray-700 hover:text-purple-600 flex items-center gap-1 relative"
          >
            <Bell size={18} /> Notifications
          </button>

          <button
            onClick={logoutUser}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Right Slide Message Panel */}
      {showMessages && (
        <div className="message-panel animate-slide-in">
          <div className="panel-header">
            <h3>Messages</h3>
            <X
              className="cursor-pointer"
              onClick={() => setShowMessages(false)}
            />
          </div>
          <div className="messages-list">
            <p><strong>Rohit Raj</strong>: Hey, welcome to AppDost team! 🎉</p>
            <p><strong>Arjun</strong>: Bro, check out this new post!</p>
            <p><strong>HR Bot</strong>: Your profile has been updated.</p>
          </div>
        </div>
      )}

      {/* Notification Popup */}
      {showNotifications && (
        <div className="notification-box animate-fade-in">
          <h4>🔔 Notifications</h4>
          <ul>
            <li>✅ New connection: <strong>Arjun Kumar</strong></li>
            <li>💬 New comment on your post</li>
            <li>👀 Someone viewed your profile</li>
          </ul>
        </div>
      )}
    </>
  );
}
