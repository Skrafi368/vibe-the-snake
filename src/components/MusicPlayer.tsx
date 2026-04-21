import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Synthwave Alpha (AI)",
    artist: "Neural Net 1",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Cybernetic Pulse (AI)",
    artist: "Neural Net 2",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Neon Outrun (AI)",
    artist: "Neural Net 3",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="flex flex-col space-y-4 h-full w-full">
      <div className="p-4 border border-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.4)] bg-black/40">
        <span className="text-[10px] uppercase tracking-widest opacity-50 mb-3 block">Now Playing</span>
        <div className="aspect-square bg-gradient-to-br from-[#00f2ff]/20 to-[#ff007a]/20 mb-3 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
          <div className="w-16 h-16 border-2 border-[#00f2ff] rounded-full flex items-center justify-center z-10 bg-black/40">
            <div className={`w-2 h-2 ${isPlaying ? 'bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]' : 'bg-[#ff007a]'} rounded-full transition-colors`}></div>
          </div>
        </div>
        <h2 className="font-bold text-lg leading-tight text-white">{currentTrack.title}</h2>
        <p className="text-sm opacity-60 italic text-white">{currentTrack.artist}</p>
        
        <div className="flex space-x-2 mt-4 items-center">
          <button onClick={skipBack} className="w-8 h-8 flex items-center justify-center transition-all bg-transparent border border-white/10 hover:bg-[#00f2ff] hover:text-black hover:border-[#00f2ff]">
            <SkipBack size={14} className="fill-current stroke-current" />
          </button>
          <button onClick={togglePlay} className={`w-8 h-8 flex items-center justify-center transition-all border border-white/10 hover:bg-[#00f2ff] hover:text-black hover:border-[#00f2ff] ${isPlaying ? 'bg-white text-black' : ''}`}>
            {isPlaying ? <Pause size={14} className="fill-current stroke-current" /> : <Play size={14} className="fill-current stroke-current translate-x-[1px]" />}
          </button>
          <button onClick={skipForward} className="w-8 h-8 flex items-center justify-center transition-all bg-transparent border border-white/10 hover:bg-[#00f2ff] hover:text-black hover:border-[#00f2ff]">
            <SkipForward size={14} className="fill-current stroke-current" />
          </button>
          <div className="flex-grow"></div>
          <button onClick={toggleMute} className="w-8 h-8 flex items-center justify-center transition-all bg-transparent border border-transparent text-white/50 hover:text-white">
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col space-y-1 overflow-hidden min-h-[150px]">
        <span className="text-[10px] uppercase tracking-widest opacity-30 mb-2 mt-2">Queue</span>
        <div className="overflow-y-auto pr-1 flex flex-col space-y-1">
          {TRACKS.map((track, i) => (
            <div 
              key={track.id} 
              onClick={() => { setCurrentTrackIndex(i); setIsPlaying(true); }}
              className={`p-3 text-sm flex justify-between items-center cursor-pointer transition-all ${currentTrackIndex === i ? 'bg-gradient-to-r from-[#00f2ff]/20 to-transparent border-l-[3px] border-[#00f2ff]' : 'hover:bg-white/5 opacity-60 border-l-[3px] border-transparent'}`}
            >
              <span className="font-medium truncate pr-2">0{i+1}. {track.title}</span>
            </div>
          ))}
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        muted={isMuted}
        onEnded={handleEnded}
      />
    </div>
  );
}
