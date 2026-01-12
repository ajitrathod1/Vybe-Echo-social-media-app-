import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Mic, Search, X, Radio
} from "lucide-react";
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
  const [audioDuration, setAudioDuration] = useState("0:00");
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

        // Calculate fake duration based on blob size (approx) or use Audio element to check
        // For now, let's just mock duration or handle it properly later
        setAudioDuration("0:XX");
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
            duration: "0:45", // Mock duration for now
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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#00f2ea] selection:text-black overflow-x-hidden font-['Space_Grotesk']">

      {/* 🔮 Background Glow Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#00f2ea]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex h-screen overflow-hidden">

        {/* 🛸 Sidebar Navigation (Left) */}
        <Sidebar />

        {/* 🌊 Main Feed Stream */}
        <main className="flex-1 flex flex-col items-center overflow-y-auto px-4 pt-10 pb-32 scrollbar-hide w-full md:ml-24">

          {/* Header / Search */}
          <div className="w-full max-w-2xl mb-12 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1"><span className="text-[#00f2ea]">Echo</span> Stream</h1>
              <p className="text-gray-400 text-sm">Listen to the world's thoughts.</p>
            </div>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00f2ea] transition" size={18} />
              <input
                type="text"
                placeholder="Find a voice..."
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00f2ea]/50 w-32 focus:w-64 transition-all"
              />
            </div>
          </div>

          {/* Echoes List */}
          {loading ? (
            <div className="text-[#00f2ea] animate-pulse">Tuning in...</div>
          ) : (
            <div className="w-full flex flex-col items-center gap-6">
              {posts.length === 0 && <p className="text-gray-500">No echoes yet. Be the first to speak.</p>}
              {posts.map((post, i) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-full flex justify-center"
                >
                  <AudioCard
                    user={post.name}
                    time={new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    title={post.title}
                    category={post.category}
                    audioUrl={post.audioUrl}
                    duration={post.duration}
                  />
                </motion.div>
              ))}
            </div>
          )}

        </main>

        {/* 🎙️ Floating Action Button (Record) */}
        <div className="fixed bottom-10 right-10 z-50">
          <button
            onClick={toggleRecording}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isRecording ? 'bg-red-500 scale-110' : 'bg-[#00f2ea] hover:scale-110 hover:shadow-[0_0_30px_#00f2ea]'}`}
          >
            {isRecording && <div className="absolute inset-0 rounded-full border-4 border-red-500 recording-pulse"></div>}
            <Mic size={28} className={isRecording ? 'text-white' : 'text-black'} fill={isRecording ? 'white' : 'none'} />
          </button>
        </div>

        {/* 📤 Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Share Echo</h2>
                  <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Title / Thought</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What's on your mind?"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f2ea] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Category</label>
                    <div className="flex gap-2 flex-wrap">
                      {['Thoughts', 'Music', 'Humor', 'Story', 'Tech'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${category === cat ? 'bg-[#00f2ea] text-black border-[#00f2ea]' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="mt-4 w-full bg-gradient-to-r from-[#00f2ea] to-purple-600 text-black font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {uploading ? 'Broadcasting...' : (
                      <>
                        Broadcast Echo <Radio size={20} />
                      </>
                    )}
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
