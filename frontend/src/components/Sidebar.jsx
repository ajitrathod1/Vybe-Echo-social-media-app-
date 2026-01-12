import React from "react";
import { Disc, Radio, TrendingUp, Settings, LogOut, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="hidden md:flex flex-col justify-between items-center w-24 py-8 border-r border-white/5 bg-[#050505]/50 backdrop-blur-md h-screen fixed left-0 top-0 z-50">
            <div className="flex flex-col gap-8 items-center">
                {/* Brand Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00f2ea] to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,234,0.3)] cursor-pointer" onClick={() => navigate('/feed')}>
                    <Disc className="text-black animate-spin-slow" size={24} />
                </div>

                {/* Navigation Items */}
                <NavIcon
                    icon={<Radio size={24} />}
                    active={isActive('/feed')}
                    onClick={() => navigate('/feed')}
                    label="Feed"
                />
                <NavIcon
                    icon={<TrendingUp size={24} />}
                    active={isActive('/trending')}
                    onClick={() => navigate('/trending')}
                    label="Trending"
                />
                <NavIcon
                    icon={<User size={24} />}
                    active={isActive('/profile')}
                    onClick={() => navigate('/profile')}
                    label="Profile"
                />
                <NavIcon
                    icon={<Settings size={24} />}
                    active={isActive('/settings')}
                    onClick={() => navigate('/settings')}
                    label="Settings"
                />
            </div>

            <button
                onClick={handleLogout}
                className="p-3 rounded-xl hover:bg-white/5 text-gray-500 hover:text-red-500 transition mb-6"
            >
                <LogOut size={22} />
            </button>
        </nav>
    );
}

function NavIcon({ icon, active, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 relative group`}
        >
            {active && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00f2ea] rounded-l-full shadow-[0_0_10px_#00f2ea]"></div>
            )}
            <div
                className={`${active ? "text-[#00f2ea]" : "text-gray-500 group-hover:text-white"
                    }`}
            >
                {icon}
            </div>
        </div>
    );
}
