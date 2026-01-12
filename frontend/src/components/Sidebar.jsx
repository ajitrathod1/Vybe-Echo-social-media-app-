import React from "react";
import { Disc, Radio, TrendingUp, Settings, LogOut, User, Compass } from "lucide-react";
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
        <nav className="hidden md:flex flex-col justify-between items-center w-24 py-8 border-r-2 border-[#333] bg-black h-screen fixed left-0 top-0 z-50">
            <div className="flex flex-col gap-10 items-center w-full">
                {/* Brand Icon */}
                <div className="w-14 h-14 rounded-full bg-[#F47521] border-2 border-white flex items-center justify-center shadow-[4px_4px_0_#222] cursor-pointer hover:scale-110 transition-transform" onClick={() => navigate('/feed')}>
                    <Disc className="text-black animate-spin-slow" size={32} strokeWidth={2.5} />
                </div>

                {/* Navigation Items */}
                <div className="flex flex-col gap-4 w-full px-3">
                    <NavIcon
                        icon={<Radio size={28} strokeWidth={2.5} />}
                        active={isActive('/feed')}
                        onClick={() => navigate('/feed')}
                        label="Feed"
                    />
                    <NavIcon
                        icon={<Compass size={28} strokeWidth={2.5} />}
                        active={isActive('/trending')}
                        onClick={() => navigate('/trending')}
                        label="Explore"
                    />
                    <NavIcon
                        icon={<User size={28} strokeWidth={2.5} />}
                        active={isActive('/profile')}
                        onClick={() => navigate('/profile')}
                        label="Profile"
                    />
                    <NavIcon
                        icon={<Settings size={28} strokeWidth={2.5} />}
                        active={isActive('/settings')}
                        onClick={() => navigate('/settings')}
                        label="Settings"
                    />
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="p-4 rounded-xl hover:bg-[#222] text-[#666] hover:text-red-500 transition mb-6 border-2 border-transparent hover:border-[#333]"
            >
                <LogOut size={28} strokeWidth={2.5} />
            </button>
        </nav>
    );
}

function NavIcon({ icon, active, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 flex justify-center group relative ${active ? 'bg-[#222] border-2 border-[#333]' : 'hover:bg-[#111]'}`}
        >
            {active && (
                <div className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-2 h-8 bg-[#F47521] rounded-r-md"></div>
            )}
            <div
                className={`${active ? "text-[#F47521]" : "text-[#555] group-hover:text-white"
                    }`}
            >
                {icon}
            </div>
        </div>
    );
}
