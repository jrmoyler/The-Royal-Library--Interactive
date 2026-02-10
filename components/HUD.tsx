import React, { useEffect } from 'react';
import { useGameStore } from '../store';
import { BookData } from '../types';

// We need to import the data to find the active book details
// In a larger app, this data might be in the store or a context
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
  '4': {
    id: '4',
    title: 'Quantum Render',
    description: 'WebGL Shader Optimization',
    content: 'Advanced GPU-accelerated rendering engine with custom shader pipelines. Optimizes draw calls and implements instancing for massive scene complexity while maintaining 60fps.',
    techStack: ['WebGL', 'GLSL', 'TypeScript', 'WebAssembly'],
    link: 'https://github.com',
    position: [-12, 1.5, 0],
    color: '#ffaa00'
  },
  '5': {
    id: '5',
    title: 'Void Protocols',
    description: 'GraphQL Federation',
    content: 'Distributed GraphQL architecture enabling microservices to expose a unified API. Features include schema stitching, federated tracing, and automatic documentation generation.',
    techStack: ['GraphQL', 'Apollo', 'Node.js', 'Docker'],
    link: 'https://github.com',
    position: [12, 1.5, 0],
    color: '#764abc'
  },
  '6': {
    id: '6',
    title: 'Cyber Forge',
    description: 'Rust WebAssembly Engine',
    content: 'High-performance computational engine compiled to WASM. Handles complex physics simulations and cryptographic operations with near-native speed in the browser.',
    techStack: ['Rust', 'WebAssembly', 'JavaScript'],
    link: 'https://github.com',
    position: [-5, 1.5, -12],
    color: '#ff3333'
  },
  '7': {
    id: '7',
    title: 'Plasma Network',
    description: 'Serverless Edge Functions',
    content: 'Global serverless infrastructure with edge computing capabilities. Sub-50ms response times worldwide using geo-distributed functions and intelligent request routing.',
    techStack: ['Cloudflare Workers', 'Deno', 'TypeScript'],
    link: 'https://github.com',
    position: [5, 1.5, -12],
    color: '#ccff00'
  },
  '8': {
    id: '8',
    title: 'Nexus Auth',
    description: 'Zero-Trust Authentication',
    content: 'Modern authentication system with passwordless login, biometric verification, and zero-trust architecture. Implements OAuth 2.0, WebAuthn, and JWT with automatic key rotation.',
    techStack: ['OAuth', 'WebAuthn', 'Redis', 'PostgreSQL'],
    link: 'https://github.com',
    position: [-10, 1.5, 5],
    color: '#00f0ff'
  },
  '9': {
    id: '9',
    title: 'Data Prism',
    description: 'Real-time Stream Processing',
    content: 'Event-driven data pipeline processing millions of events per second. Features include complex event processing, stream joins, and real-time analytics with minimal latency.',
    techStack: ['Kafka', 'Flink', 'Redis', 'TimescaleDB'],
    link: 'https://github.com',
    position: [10, 1.5, 5],
    color: '#ff0055'
  },
  '10': {
    id: '10',
    title: 'Holographic UI',
    description: 'AR/VR Interface Design',
    content: 'Cross-platform AR/VR framework supporting both immersive and mixed reality experiences. Includes hand tracking, spatial audio, and physics-based interactions.',
    techStack: ['WebXR', 'Three.js', 'A-Frame', 'Babylon.js'],
    link: 'https://github.com',
    position: [0, 1.5, -15],
    color: '#ffaa00'
  },
  '11': {
    id: '11',
    title: 'Cryptic Vault',
    description: 'End-to-End Encryption',
    content: 'Client-side encryption library with zero-knowledge architecture. Implements modern cryptographic primitives including AES-256-GCM, ChaCha20-Poly1305, and Ed25519 signatures.',
    techStack: ['Web Crypto API', 'libsodium', 'TypeScript'],
    link: 'https://github.com',
    position: [-15, 1.5, -5],
    color: '#764abc'
  },
  '12': {
    id: '12',
    title: 'Electron Mesh',
    description: 'Distributed Computing Grid',
    content: 'Decentralized computation network enabling browser-based distributed processing. Implements work-stealing scheduling, fault tolerance, and cryptographic verification of results.',
    techStack: ['WebRTC', 'IPFS', 'Rust', 'TypeScript'],
    link: 'https://github.com',
    position: [15, 1.5, -5],
    color: '#00f0ff'
  },
};

export const HUD: React.FC = () => {
  const { energy, activeBookId, discoveredBooks, xp, level, notification, clearNotification } = useGameStore();
  
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => clearNotification(), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  const activeProject = activeBookId ? BOOKS_LOOKUP[activeBookId] : null;

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-8 font-sans z-10">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
            <div className="bg-tech-surface backdrop-blur-md border border-tech-border p-4 rounded-sm max-w-xs">
            <h1 className="text-tech-cyan text-sm font-bold tracking-widest mb-1">AETHERIA PORTFOLIO</h1>
            <p className="text-gray-400 text-xs">SYS_ONLINE // NET_ID: 0x892</p>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className={`
                    bg-slate-900/90 border-l-4 p-4 rounded-sm shadow-lg max-w-sm animate-fade-in-right
                    ${notification.type === 'achievement' ? 'border-yellow-400' : 'border-tech-cyan'}
                `}>
                    <h3 className={`font-bold text-sm mb-1 ${notification.type === 'achievement' ? 'text-yellow-400' : 'text-tech-cyan'}`}>
                        {notification.title}
                    </h3>
                </div>
            )}
        </div>
        
        <div className="bg-tech-surface backdrop-blur-md border border-tech-border p-4 rounded-sm min-w-[200px]">
           <div className="text-right">
             <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Clearance Level</div>
             <div className="text-3xl font-mono text-white font-bold mb-2">LVL {level}</div>
             <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-yellow-400" 
                    style={{ width: `${(xp % 500) / 5}%` }}
                />
             </div>
             <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
                <span>{xp} XP</span>
                <span>NEXT: {(Math.floor(xp / 500) + 1) * 500}</span>
             </div>
           </div>
        </div>
      </div>

      {/* Center Reticle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-white/20 rounded-full flex items-center justify-center">
        <div className="w-0.5 h-0.5 bg-white rounded-full" />
      </div>

      {/* Interaction Modal / Project Card */}
      {activeProject && (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-8 max-w-lg w-full pointer-events-auto">
            <div 
                className="bg-tech-slate/95 backdrop-blur-xl border border-tech-cyan p-0 shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden"
                style={{ borderColor: activeProject.color }}
            >
               {/* Header of Card */}
               <div className="p-6 pb-4 border-b border-white/10" style={{ backgroundColor: `${activeProject.color}11` }}>
                   <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-white text-xl font-bold uppercase tracking-wider mb-1">
                                {activeProject.title}
                            </h2>
                            <p className="text-tech-cyan text-xs font-mono">{activeProject.description}</p>
                        </div>
                        <div className="text-xs font-mono text-gray-400 border border-gray-700 px-2 py-1 rounded">
                            ID: {activeProject.id}
                        </div>
                   </div>
               </div>

               {/* Body */}
               <div className="p-6">
                   <p className="text-sm text-gray-300 leading-relaxed mb-4">
                      {activeProject.content}
                   </p>
                   
                   <div className="flex flex-wrap gap-2 mb-6">
                       {activeProject.techStack?.map(tech => (
                           <span key={tech} className="text-xs text-white bg-white/10 px-2 py-1 rounded-sm border border-white/5">
                               {tech}
                           </span>
                       ))}
                   </div>

                   <div className="flex items-center justify-between mt-4">
                       <button className="bg-tech-cyan/20 hover:bg-tech-cyan/30 text-tech-cyan text-xs font-bold py-2 px-4 border border-tech-cyan/50 transition-colors uppercase tracking-widest">
                           View Source Code
                       </button>
                       <span className="text-[10px] text-gray-500 font-mono">PRESS [E] TO COLLECT DATA</span>
                   </div>
               </div>
            </div>
         </div>
      )}

      {/* Footer / Status */}
      <div className="flex justify-between items-end">
        {/* Energy Bar */}
        <div className="flex flex-col gap-2 w-64">
           <div className="flex justify-between text-xs uppercase tracking-wider text-tech-cyan">
             <span>Suit Integrity</span>
             <span>{Math.round(energy)}%</span>
           </div>
           <div className="h-2 w-full bg-slate-800 border border-slate-700 relative overflow-hidden clip-path-slant">
             <div 
                className={`h-full transition-all duration-300 ease-out shadow-[0_0_10px_currentColor] ${energy < 30 ? 'bg-red-500 text-red-500' : 'bg-tech-cyan text-tech-cyan'}`}
                style={{ width: `${energy}%` }}
             />
           </div>
        </div>

        {/* Collection Status */}
        <div className="flex flex-col gap-2">
          <div className="text-xs text-gray-400 uppercase tracking-wider text-right">
            Archive Collection: {discoveredBooks.size}/12
          </div>
          <div className="flex gap-1">
              {Object.values(BOOKS_LOOKUP).map((book) => {
                  const isFound = discoveredBooks.has(book.id);
                  return (
                      <div
                          key={book.id}
                          className={`w-6 h-10 border transition-all ${isFound ? 'border-tech-cyan shadow-[0_0_10px_#00f0ff]' : 'border-gray-700 opacity-30'}`}
                          style={isFound ? { backgroundColor: book.color + '40', borderColor: book.color } : {}}
                      >
                          {isFound && <div className="w-full h-full opacity-50 animate-pulse" style={{ backgroundColor: book.color }} />}
                      </div>
                  )
              })}
          </div>
        </div>

        {/* Controls Hint */}
        <div className="text-xs text-gray-500 font-mono text-right opacity-50">
           <div>WASD / ARROWS :: NAVIGATE</div>
           <div>SHIFT :: SPRINT</div>
           <div>SPACE :: JUMP</div>
        </div>
      </div>
    </div>
  );
};
