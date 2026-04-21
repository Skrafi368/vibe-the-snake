/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="h-screen bg-[#050505] text-white font-sans flex flex-col p-4 md:p-6 space-y-6 overflow-hidden">
      <header className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end border-b border-white/10 pb-4 w-full shrink-0">
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase tracking-[0.4em] opacity-50">System Interface</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#00f2ff] drop-shadow-[0_0_8px_rgba(0,242,255,0.6)] uppercase m-0 leading-none">Synth-Snake v1.0</h1>
        </div>
        <div className="mt-4 sm:mt-0 text-left sm:text-right flex flex-col">
          <span className="text-[10px] uppercase tracking-widest opacity-50">Local Score</span>
          <div className="text-2xl font-mono font-bold leading-none">{score.toString().padStart(6, '0')}</div>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row gap-6 w-full items-center md:items-start min-h-0 overflow-auto md:overflow-visible">
        <div className="w-full md:w-64 shrink-0 h-auto md:h-full">
           <MusicPlayer />
        </div>

        <div className="flex-grow flex items-center justify-center w-full relative h-[400px] md:h-full">
           <div className="w-full max-w-[500px] h-full max-h-[500px] aspect-square border border-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.4)] p-1 bg-black overflow-hidden flex items-center justify-center">
             <SnakeGame setScore={setScore} />
           </div>
        </div>
        
        <div className="w-full md:w-64 shrink-0 flex flex-col space-y-4">
            <div className="p-4 border border-white/10 bg-white/5 space-y-4">
              <span className="text-[10px] uppercase tracking-widest opacity-50 block">Game Stats</span>
              <div className="flex justify-between items-baseline">
                <span className="text-xs opacity-60">Status</span>
                <span className="text-lg font-mono text-[#00f2ff]">ONLINE</span>
              </div>
            </div>
            <div className="p-4 border border-white/10 bg-white/5 flex-grow">
              <span className="text-[10px] uppercase tracking-widest opacity-50 mb-3 block">Controls</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-tighter opacity-80">
                <div className="p-2 border border-white/10 text-center">[W] UP</div>
                <div className="p-2 border border-white/10 text-center">[S] DOWN</div>
                <div className="p-2 border border-white/10 text-center">[A] LEFT</div>
                <div className="p-2 border border-white/10 text-center">[D] RIGHT</div>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}
