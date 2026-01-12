import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Heart, MessageCircle, Share2, MoreHorizontal, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const AudioCard = ({ user = "Anonymous", time, duration, title, category, audioUrl, likesCount = 0 }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [liked, setLiked] = useState(false);
    const audioRef = useRef(new Audio(audioUrl));

    useEffect(() => {
        const audio = audioRef.current;

        const handleEnded = () => setIsPlaying(false);
        audio.addEventListener('ended', handleEnded);

        if (isPlaying) {
            audio.play().catch(e => {
                console.error("Audio play failed:", e);
                setIsPlaying(false);
            });
        } else {
            audio.pause();
        }

        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
        };
    }, [isPlaying]);

    const togglePlay = () => {
        if (audioRef.current.src !== audioUrl) {
            audioRef.current.src = audioUrl;
        }
        setIsPlaying(!isPlaying);
    };

    const userName = user || "Anonymous";
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#111] border-2 border-[#333] rounded-[24px] p-6 hover:border-[#F47521] transition-all duration-300 relative group overflow-hidden"
        >
            <div className="absolute inset-0 bg-halftone opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#333] border-2 border-[#F47521] flex items-center justify-center text-white font-black text-xl shadow-[2px_2px_0_#F47521]">
                        {userInitial}
                    </div>
                    <div>
                        <h3 className="font-extrabold text-white text-lg leading-tight uppercase tracking-tight">{userName}</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{time}</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-white p-2 hover:bg-[#222] rounded-full transition">
                    <MoreHorizontal size={24} />
                </button>
            </div>

            {/* Content */}
            <div className="mb-4 relative z-10">
                <h4 className="text-xl font-bold text-white leading-snug">{title}</h4>
                {category && (
                    <span className="inline-block mt-2 px-3 py-1 bg-[#F47521] text-black text-[10px] font-black uppercase tracking-wider rounded-md transform -skew-x-12">
                        {category}
                    </span>
                )}
            </div>

            {/* Audio Player Block */}
            <div className="bg-black/80 rounded-2xl p-4 flex items-center gap-4 border border-[#333] group-hover:border-[#555] transition-colors relative z-10">
                <button
                    onClick={togglePlay}
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all border-2 border-transparent ${isPlaying
                        ? 'bg-[#F47521] text-white shadow-[0_0_15px_rgba(244,117,33,0.6)] animate-pulse'
                        : 'bg-[#222] text-white hover:bg-white hover:text-black hover:border-white'
                        }`}
                >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </button>

                {/* Waveform Visualization */}
                <div className="flex-1 flex items-center justify-center gap-[3px] h-8 overflow-hidden">
                    {[...Array(35)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-[4px] rounded-full transition-all duration-300 ${isPlaying ? 'wave-bar bg-[#F47521]' : 'bg-[#333] h-[4px]'}`}
                            style={isPlaying ? { animationDelay: `${i * 0.05}s` } : {}}
                        ></div>
                    ))}
                </div>

                <span className="text-xs font-black text-[#F47521] font-mono whitespace-nowrap bg-[#222] px-2 py-1 rounded">
                    {duration || "0:00"}
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#333] relative z-10">
                <div className="flex gap-6">
                    <button
                        onClick={() => setLiked(!liked)}
                        className={`flex items-center gap-2 text-sm font-bold transition-transform active:scale-90 ${liked ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Heart size={22} fill={liked ? "currentColor" : "none"} strokeWidth={2.5} />
                        <span>{likesCount + (liked ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">
                        <MessageCircle size={22} strokeWidth={2.5} />
                        <span>Comment</span>
                    </button>
                </div>
                <button className="text-gray-400 hover:text-[#F47521] transition-colors p-2 hover:bg-[#222] rounded-full">
                    <Share2 size={22} strokeWidth={2.5} />
                </button>
            </div>
        </motion.div>
    );
};

export default AudioCard;
