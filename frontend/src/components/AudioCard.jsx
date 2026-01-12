import React, { useState } from 'react';
import { Play, Pause, Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

const AudioCard = ({ user, time, duration, title, category, audioUrl, likesCount = 0 }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [liked, setLiked] = useState(false);
    const audioRef = React.useRef(new Audio(audioUrl));

    React.useEffect(() => {
        const audio = audioRef.current;

        // Reset state when audio finishes
        audio.onended = () => setIsPlaying(false);

        if (isPlaying) {
            audio.play().catch(e => {
                console.error("Audio play failed:", e);
                setIsPlaying(false);
            });
        } else {
            audio.pause();
        }

        return () => {
            audio.pause();
        };
    }, [isPlaying]);

    // Fake waveform bars
    const bars = Array.from({ length: 40 });

    const togglePlay = () => {
        // Create new audio object if URL changed (though typically won't in this list)
        if (audioRef.current.src !== audioUrl) {
            audioRef.current.src = audioUrl;
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="w-full max-w-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 mb-6 hover:bg-[rgba(255,255,255,0.05)] transition-all duration-300">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center">
                            <span className="text-lg font-bold text-white">{user[0]}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-lg hover:text-[#00f2ea] cursor-pointer">
                            {user}
                        </h3>
                        <p className="text-gray-400 text-xs flex items-center gap-2">
                            {time} • <span className="text-[#00f2ea]">{category}</span>
                        </p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-white">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Title */}
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                {title}
            </p>

            {/* Audio Player */}
            <div className="bg-black/30 rounded-xl p-4 flex items-center gap-4 mb-5 border border-white/5">
                <button
                    onClick={togglePlay}
                    className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${isPlaying
                            ? 'bg-[#00f2ea] text-black shadow-[0_0_15px_rgba(0,242,234,0.4)]'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                >
                    {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="white" className="ml-1" />}
                </button>

                {/* Waveform Visualization */}
                <div className="flex-1 h-12 flex items-center gap-[2px] overflow-hidden">
                    {bars.map((_, i) => (
                        <div
                            key={i}
                            className={`w-1 rounded-full transition-all duration-300 ${isPlaying ? 'wave-bar' : 'h-1 bg-gray-600'}`}
                            style={{
                                animationDelay: `${Math.random() * 0.5}s`,
                                height: isPlaying ? undefined : `${20 + Math.random() * 60}%` // Static random height when paused
                            }}
                        ></div>
                    ))}
                </div>

                <span className="text-xs text-gray-400 font-mono">{duration}</span>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between text-gray-400 pt-2 border-t border-white/5">
                <div className="flex gap-6">
                    <button
                        onClick={() => setLiked(!liked)}
                        className={`flex items-center gap-2 text-sm transition-colors ${liked ? 'text-[#ff0055]' : 'hover:text-white'}`}
                    >
                        <Heart size={18} fill={liked ? '#ff0055' : 'none'} />
                        <span>{liked ? '1.2k' : '1.2k'}</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                        <MessageCircle size={18} />
                        <span>48</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                        <Share2 size={18} />
                        <span>Share</span>
                    </button>
                </div>
                <span className="text-xs text-gray-500">248 listens</span>
            </div>
        </div>
    );
};

export default AudioCard;
