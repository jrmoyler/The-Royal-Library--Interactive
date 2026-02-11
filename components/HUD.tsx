
import React, { useEffect } from 'react';
import { useGameStore } from '../store';
import { BookData } from '../types';

const BOOKS_LOOKUP: Record<string, BookData> = {
  '1': { 
    id: '1', 
    title: 'Neon Commerce', 
    description: 'Next.js 14 Headless Shopify Storefront',
    content: 'A high-performance e-commerce solution using Next.js App Router, Tailwind CSS, and Shopify Storefront API. Features include optimistic UI updates, edge caching, and AI-powered recommendations.',
    techStack: ['Next.js', 'TypeScript', 'Shopify', 'Tailwind'],
    link: 'https://github.com',
    position: [-8, 1.5, -8], 
    color: '#00f0ff' 
  },
  '2': { 
    id: '2', 
    title: 'Neural Dashboard', 
    description: 'Real-time AI Analytics Platform',
    content: 'Visualizing heavy data streams using WebGL and D3.js. Integrated with Python backend for real-time inference. Used by data scientists to track model drift in production environments.',
    techStack: ['React', 'Three.js', 'Python', 'FastAPI'],
    link: 'https://github.com',
    position: [8, 1.5, -8], 
    color: '#ff0055' 
  },
  '3': { 
    id: '3', 
    title: 'Aether State', 
    description: 'Distributed State Management Library',
    content: 'An open-source library for managing state across iframe micro-frontends. Uses a custom event bus and Proxy objects to ensure strict type safety and zero-lag synchronization.',
    techStack: ['TypeScript', 'RxJS', 'Web Workers'],
    link: 'https://github.com',
    position: [0, 1.5, 8], 
    color: '#764abc' 
  },
};

export const HUD: React.FC = () => {
  const { energy, activeBookId, discoveredBooks, xp, level, notification, clearNotification, playerAvatar, playerColor, setActiveBook } = useGameStore();
  
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => clearNotification(), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  const activeProject = activeBookId ? BOOKS_LOOKUP[activeBookId] : null;

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-8 md:p-12 font-mono z-50 overflow-hidden">
      
      {/* --- TOP HEADER --- */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-4">
            <div className="bg-tech-surface/80 backdrop-blur-xl border-l-2 border-tech-cyan p-5 max-w-xs shadow-2xl">
               <h1 className="text-tech-cyan text-[10px] font-black tracking-[0.3em] mb-1">AETHERIA_LINK_ACTIVE</h1>
               <p className="text-gray-500 text-[8px] tracking-widest uppercase">SECURE_LINK // SECTOR_07</p>
            </div>

            {notification && (
                <div className={`
                    bg-slate-900/95 backdrop-blur-md border-l-4 p-5 shadow-2xl max-w-sm animate-fade-in-right transition-all
                    ${notification.type === 'achievement' ? 'border-yellow-400' : 'border-tech-cyan'}
                `}>
                    <h3 className={`font-black text-[10px] tracking-widest mb-1 ${notification.type === 'achievement' ? 'text-yellow-400' : 'text-tech-cyan'}`}>
                        {notification.title}
                    </h3>
                    <p className="text-[9px] text-gray-500 uppercase">Archive synced successfully.</p>
                </div>
            )}
        </div>
        
        <div className="text-right text-[7px] text-gray-500 uppercase tracking-[0.4em] space-y-1 opacity-50">
           <div>COORDS: 42.09.81</div>
           <div>LATENCY: 12MS</div>
           <div className="text-tech-cyan animate-pulse">AES_ENCRYPTED</div>
        </div>
      </div>

      {/* --- PROJECT INTERFACE CARD --- */}
      {activeProject && (
         <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto p-4">
            <div 
                className="max-w-xl w-full bg-black/95 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden animate-zoom-in"
                style={{ borderTop: `4px solid ${activeProject.color}` }}
            >
               <div className="p-8 pb-4 border-b border-white/5 bg-white/5">
                   <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-white text-2xl font-black uppercase tracking-tighter italic mb-1">
                                {activeProject.title}
                            </h2>
                            <p className="text-[10px] font-mono opacity-80" style={{ color: activeProject.color }}>{activeProject.description}</p>
                        </div>
                        <button 
                          onClick={() => setActiveBook(null)}
                          className="p-2 text-white/40 hover:text-white transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                   </div>
               </div>

               <div className="p-8">
                   <p className="text-sm text-gray-400 leading-relaxed mb-8 font-sans">
                      {activeProject.content}
                   </p>
                   
                   <div className="flex flex-wrap gap-2 mb-10">
                       {activeProject.techStack?.map(tech => (
                           <span key={tech} className="text-[8px] font-black text-white/50 bg-white/5 px-3 py-1.5 border border-white/10 uppercase tracking-widest">
                               {tech}
                           </span>
                       ))}
                   </div>

                   <div className="flex items-center justify-between border-t border-white/5 pt-6">
                       <a 
                        href={activeProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative px-6 py-3 border transition-all pointer-events-auto"
                        style={{ borderColor: `${activeProject.color}66`, color: activeProject.color }}
                       >
                           <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.3em]">VIEW_SOURCE</span>
                           <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                       </a>
                       <div className="flex flex-col items-end gap-1">
                          <span className="text-[8px] text-gray-500 font-mono tracking-widest uppercase">SYMBOLS_DETECTED</span>
                          <span className="text-[9px] text-gray-400 font-black tracking-widest uppercase">PRESS [E] TO CLOSE</span>
                       </div>
                   </div>
               </div>
            </div>
         </div>
      )}

      {/* --- BOTTOM DASHBOARD --- */}
      <div className="flex justify-between items-end">
        
        {/* PLAYER STATISTICS COMPONENT */}
        <div className="flex flex-col gap-4 w-64 md:w-80 pointer-events-auto">
          <div className="flex items-center gap-3 bg-tech-slate/90 backdrop-blur-md p-3 border border-tech-border shadow-lg">
             <div className="relative w-12 h-12 flex items-center justify-center border-2" style={{ borderColor: playerColor }}>
                <div className="absolute inset-0 opacity-20" style={{ backgroundColor: playerColor }} />
                <span className="text-lg font-black italic" style={{ color: playerColor }}>L{level}</span>
             </div>
             <div className="flex flex-col">
                <span className="text-white text-sm font-black tracking-[0.1em] uppercase italic">{playerAvatar}</span>
                <span className="text-[8px] text-gray-400 tracking-[0.3em] uppercase">NEURAL_SYNC_STABLE</span>
             </div>
          </div>

          <div className="bg-black/80 backdrop-blur-xl border border-tech-border p-5 space-y-5 shadow-2xl">
             {/* Energy / Sync Integrity Bar */}
             <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px] tracking-[0.2em] font-black uppercase">
                   <span className="text-gray-500">INTEGRITY</span>
                   <span style={{ color: energy < 20 ? '#ff0033' : playerColor }}>{Math.round(energy)}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 relative overflow-hidden">
                   <div 
                      className="h-full transition-all duration-300" 
                      style={{ 
                        width: `${energy}%`, 
                        backgroundColor: energy < 20 ? '#ff0033' : playerColor, 
                        boxShadow: `0 0 12px ${energy < 20 ? '#ff0033' : playerColor}` 
                      }} 
                    />
                </div>
             </div>

             {/* XP Progress Bar */}
             <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px] tracking-[0.2em] font-black uppercase">
                   <span className="text-gray-500">ARCHIVE_XP</span>
                   <span className="text-white">{xp} / {level * 500}</span>
                </div>
                <div className="h-1 w-full bg-white/5 relative overflow-hidden">
                   <div 
                      className="h-full bg-white/40 transition-all duration-1000" 
                      style={{ width: `${(xp % 500) / 5}%` }} 
                    />
                </div>
             </div>
          </div>
        </div>

        {/* Fragment Repository Tracking */}
        <div className="flex flex-col items-center gap-3">
            <span className="text-[8px] text-gray-600 tracking-[0.4em] uppercase">DATA_COLLECTED</span>
            <div className="flex gap-2">
                {Object.values(BOOKS_LOOKUP).map((book) => {
                    const isFound = discoveredBooks.has(book.id);
                    return (
                        <div 
                            key={book.id}
                            className={`w-6 h-9 border transition-all duration-700 relative ${isFound ? 'border-tech-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'border-white/5 bg-white/5 opacity-20'}`}
                        >
                            {isFound && <div className="absolute inset-0 bg-tech-cyan/20 animate-pulse" />}
                            <div className={`absolute bottom-1 left-1 right-1 h-0.5 ${isFound ? 'bg-tech-cyan' : 'bg-transparent'}`} />
                        </div>
                    )
                })}
            </div>
        </div>

        {/* System Legend */}
        <div className="text-[8px] text-gray-600 font-mono text-right space-y-1.5 uppercase tracking-widest italic opacity-50 hidden md:block">
           <div>W_A_S_D :: VECTOR_MOVE</div>
           <div>SHIFT :: ENERGETIC_BURST</div>
           <div>SPACE :: KINETIC_LIFT</div>
           <div>E :: DATA_HARVEST</div>
           <div className="text-tech-cyan mt-4 font-black">AETHERIA_PROTOCOL_V.0.9.1</div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes zoom-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-right { animation: fade-in-right 0.5s ease-out forwards; }
        .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};
