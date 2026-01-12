import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mic, Search, X, Sparkles, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AudioCard from "../components/AudioCard";
import Sidebar from "../components/Sidebar";
import "../index.css";

export default function Feed() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Thoughts");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) navigate("/");
    else setUser(userData);

    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch posts");
      setLoading(false);
    }
  };

  // 🎙️ Recording Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
        setAudioBlob(audioBlob);
        setShowUploadModal(true);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied!");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const handleUpload = async () => {
    if (!title) return alert("Please add a title!");
    setUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result;

      try {
        await axios.post(
          "http://localhost:5000/api/posts",
          {
            title,
            category,
            audioUrl: base64Audio,
            duration: "0:45",
            text: "Voice Note"
          },
          { headers: { "x-auth-token": localStorage.getItem("token") } }
        );

        setShowUploadModal(false);
        setUploading(false);
        setTitle("");
        setAudioBlob(null);
        fetchPosts(); // Refresh feed
      } catch (err) {
        alert("Upload Failed");
        setUploading(false);
      }
    };
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#F47521] selection:text-black overflow-x-hidden font-['Outfit'] bg-halftone">

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <main className="flex-1 flex flex-col items-center px-4 pt-10 pb-32 w-full md:ml-24 max-w-5xl mx-auto">

          {/* Header Banners */}
          <div className="w-full mb-10 bg-[#111] border-2 border-[#333] rounded-[32px] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <Sparkles className="text-[#F47521] w-10 h-10 animate-spin-slow" />
            </div>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 uppercase italic">
                Live <span className="text-[#F47521]">LOUD.</span>
              </h1>
              <p className="text-gray-400 font-bold max-w-lg">
                Discover the rawest voices from around the globe. No filters, just frequency.
              </p>
            </div>
            {/* Decorative Circles */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#F47521] rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mb-10 flex gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#F47521] transition-colors" size={24} strokeWidth={3} />
              <input
                type="text"
                placeholder="FIND YOUR VIBE..."
                className="w-full pl-14 pr-4 py-4 rounded-full bg-[#111] border-2 border-[#333] text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-[#F47521] transition-all uppercase tracking-wide"
              />
            </div>
            <button className="px-6 rounded-full bg-[#F47521] text-black font-black hover:bg-white transition-colors">
              FILTER
            </button>
          </div>

          {/* Posts Grid */}
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-20">
              <div className="w-16 h-16 border-8 border-[#222] border-t-[#F47521] rounded-full animate-spin"></div>
              <p className="text-[#F47521] font-bold uppercase tracking-widest text-sm animate-pulse">Loading Stream...</p>
            </div>
          ) : (
            <div className="w-full max-w-2xl flex flex-col gap-6">
              {Array.isArray(posts) && posts.length > 0 ? (
                posts.map(post => (
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
              ) : (
                <div className="text-gray-500 font-bold text-center border-2 border-dashed border-[#222] p-10 rounded-2xl uppercase tracking-widest">
                  No signals detected yet. <br />
                  <span className="text-[#F47521]">Broadcast yours!</span>
                </div>
              )}
            </div>
          )}

        </main>

        {/* 🎤 Floating Record Button (Crunchyroll Orange) */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={toggleRecording}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-[4px_4px_0_#000] border-4 border-black transition-transform active:translate-y-1 active:shadow-none ${isRecording ? 'bg-white' : 'bg-[#F47521] hover:scale-105 btn-orange-pulse'}`}
          >
            {isRecording ? (
              <div className="w-8 h-8 bg-red-600 rounded-sm animate-pulse"></div>
            ) : (
              <Mic size={32} className="text-black" strokeWidth={3} />
            )}
          </button>
        </div>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] p-4"
            >
              <motion.div
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.8, rotate: 5 }}
                className="bg-[#111] border-4 border-[#333] rounded-[40px] p-8 w-full max-w-lg shadow-[0_0_0_10px_rgba(244,117,33,0.2)] relative overflow-hidden"
              >
                <button onClick={() => setShowUploadModal(false)} className="absolute top-6 right-6 p-2 bg-[#222] hover:bg-white hover:text-black rounded-full transition text-white">
                  <X size={24} strokeWidth={3} />
                </button>

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#F47521] text-black rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-black shadow-[0_0_20px_rgba(244,117,33,0.5)]">
                    <Mic size={32} strokeWidth={3} />
                  </div>
                  <h2 className="text-3xl font-extrabold text-white uppercase italic">Broadcast This!</h2>
                </div>

                <div className="flex flex-col gap-6">
                  <div>
                    <label className="text-gray-500 font-bold uppercase text-xs ml-4 mb-2 block">Episode Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="WHAT'S HAPPENING?!"
                      className="w-full p-5 rounded-2xl bg-black border-2 border-[#333] text-white font-bold text-lg focus:border-[#F47521] outline-none placeholder:text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="text-gray-500 font-bold uppercase text-xs ml-4 mb-2 block">Tag It</label>
                    <div className="flex gap-3 flex-wrap">
                      {['Rant', 'Story', 'Music', 'Joke', 'News'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`px-5 py-2 rounded-xl text-sm font-black uppercase transform transition-all ${category === cat ? 'bg-[#F47521] text-black -rotate-2 border-2 border-white' : 'bg-[#222] text-gray-400 border-2 border-transparent hover:border-white'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="mt-4 py-5 rounded-full bg-white text-black font-black text-xl hover:bg-[#F47521] hover:text-white transition-all flex items-center justify-center gap-2 shadow-[0_5px_0_#999] active:shadow-none active:translate-y-[5px]"
                  >
                    {uploading ? 'UPLOADING...' : 'GO LIVE NOW'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
