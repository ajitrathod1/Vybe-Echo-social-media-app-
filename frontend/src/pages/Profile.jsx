import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import AudioCard from "../components/AudioCard";
import { User, Mic, Settings, Calendar } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myEchoes, setMyEchoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(userData);
    fetchUserEchoes(userData.id);
  }, []);

  const fetchUserEchoes = async (userId) => {
    try {
      // Fetching all posts and filtering (can be optimized with a backend route)
      const res = await axios.get("http://localhost:5000/api/posts");
      const userPosts = res.data.filter((post) => post.userId === userId);
      setMyEchoes(userPosts);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user echoes", err);
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Space_Grotesk'] overflow-x-hidden">

      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <div className="flex-1 px-4 md:px-10 py-10 md:ml-24 max-w-5xl mx-auto w-full">

          {/* Profile Header Card */}
          <div className="relative w-full bg-white/5 border border-white/10 rounded-3xl p-8 mb-10 overflow-hidden">
            {/* Decorative Gradient Bar */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#00f2ea] to-purple-600"></div>

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">

              {/* Avatar */}
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-[#00f2ea] to-purple-600 shadow-[0_0_40px_rgba(0,242,234,0.2)]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                  <span className="text-5xl font-bold text-white">{user.name[0]}</span>
                </div>
              </div>

              {/* User Info */}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl font-bold mb-2 text-white">{user.name}</h1>
                <p className="text-gray-400 mb-4">{user.email}</p>

                <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mic size={16} className="text-[#00f2ea]" />
                    <span>{myEchoes.length} Echoes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Joined recently</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition text-sm">Edit Profile</button>
                <button className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition"><Settings size={20} /></button>
              </div>

            </div>
          </div>

          {/* User's Echoes */}
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-[#00f2ea] rounded-full"></span>
            My Echoes
          </h2>

          {loading ? (
            <div className="text-[#00f2ea] animate-pulse">Loading vibrations...</div>
          ) : (
            <div className="flex flex-col gap-4">
              {myEchoes.length === 0 ? (
                <div className="text-gray-500 italic p-10 text-center border border-dashed border-white/10 rounded-2xl">
                  No echoes captured yet. Use the mic to record your first thought.
                </div>
              ) : (
                myEchoes.map(post => (
                  <AudioCard
                    key={post._id}
                    user={post.name}
                    time={new Date(post.timestamp).toLocaleDateString()}
                    title={post.title}
                    category={post.category}
                    audioUrl={post.audioUrl}
                    duration={post.duration}
                    likesCount={post.likes}
                  />
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
