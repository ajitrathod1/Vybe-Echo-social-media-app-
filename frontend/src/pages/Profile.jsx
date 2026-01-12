import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import AudioCard from "../components/AudioCard";
import { User, Mic, Settings, Calendar, Edit3, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-black text-white font-['Outfit'] overflow-x-hidden bg-halftone">

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <div className="flex-1 px-4 md:px-10 py-10 md:ml-24 max-w-5xl mx-auto w-full">

          {/* Profile Header Card */}
          <div className="relative w-full bg-[#111] border-2 border-[#333] rounded-[40px] p-10 mb-12 overflow-hidden group">

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F47521] rounded-bl-full opacity-20"></div>
            <Sparkles className="absolute top-10 right-10 text-[#F47521] w-8 h-8 animate-spin-slow" />

            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">

              {/* Avatar */}
              <div className="w-40 h-40 rounded-full border-4 border-[#F47521] p-1 bg-black shadow-[10px_10px_0_#222] transform group-hover:-rotate-3 transition-transform duration-500">
                <div className="w-full h-full rounded-full bg-[#222] flex items-center justify-center overflow-hidden">
                  <span className="text-6xl font-black text-white">{user.name[0]}</span>
                </div>
              </div>

              {/* User Info */}
              <div className="text-center md:text-left flex-1">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                  <h1 className="text-5xl font-extrabold text-white uppercase italic tracking-tighter">{user.name}</h1>
                  <span className="bg-[#F47521] text-black text-xs font-black px-3 py-1 rounded uppercase">Pro Member</span>
                </div>

                <p className="text-gray-400 font-medium text-lg mb-6">{user.email}</p>

                <div className="flex items-center justify-center md:justify-start gap-8">
                  <div className="text-center md:text-left">
                    <span className="block text-3xl font-black text-white">{myEchoes.length}</span>
                    <span className="text-xs font-bold text-[#F47521] uppercase tracking-wider">Echoes</span>
                  </div>
                  <div className="text-center md:text-left">
                    <span className="block text-3xl font-black text-white">1.2k</span>
                    <span className="text-xs font-bold text-[#F47521] uppercase tracking-wider">Followers</span>
                  </div>
                  <div className="text-center md:text-left">
                    <span className="block text-3xl font-black text-white">340</span>
                    <span className="text-xs font-bold text-[#F47521] uppercase tracking-wider">Following</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button className="px-8 py-3 rounded-full bg-white text-black font-black hover:bg-[#F47521] transition hover:scale-105 shadow-[4px_4px_0_#333]">Edit Profile</button>
                <button className="p-3 rounded-full bg-[#222] text-gray-400 hover:text-white border-2 border-[#333] hover:border-white transition"><Settings size={24} /></button>
              </div>

            </div>
          </div>

          {/* User's Echoes */}
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3 uppercase italic">
            <span className="w-3 h-10 bg-[#F47521] transform -skew-x-12"></span>
            My Broadcasts
          </h2>

          {loading ? (
            <div className="text-[#F47521] animate-pulse font-bold tracking-widest text-center py-20">LOADING...</div>
          ) : (
            <div className="flex flex-col gap-6">
              {myEchoes.length === 0 ? (
                <div className="text-gray-500 font-bold p-12 text-center border-2 border-dashed border-[#333] rounded-[30px] bg-[#111]">
                  <p className="text-xl mb-4">SILENCE IS BORING.</p>
                  <button
                    onClick={() => navigate('/feed')}
                    className="text-[#F47521] underline decoration-4 underline-offset-4 font-black text-lg hover:text-white"
                  >
                    RECORD SOMETHING NOW!
                  </button>
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
