import React from 'react';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,500&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .font-ink { font-family: 'Lora', serif; color: #1c1917; }
    .font-sans-clean { font-family: 'Inter', sans-serif; }

    .bg-canvas {
      background-color: #fdfbf7;
      background-image: 
        repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,0.02) 1px, rgba(0,0,0,0.02) 3px),
        url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
    }
    .wet-paint {
      box-shadow: 
        0 10px 20px -5px rgba(0,0,0,0.15),
        inset 0 2px 4px rgba(255,255,255,0.8),
        inset 0 -2px 4px rgba(0,0,0,0.05);
      border: 1px solid rgba(255,255,255,0.3);
    }
    .wet-paint-active:active { transform: scale(0.98); box-shadow: 0 5px 10px -2px rgba(0,0,0,0.1), inset 0 4px 8px rgba(0,0,0,0.05); }

    .high-contrast { filter: contrast(1.1) brightness(0.95); }
    .high-contrast .text-stone-400 { color: #57534e !important; } 
    
    @keyframes squish-breathe { 0%, 100% { transform: scale(0.96); } 50% { transform: scale(0.98); } }
    .animate-squish-breathe { animation: squish-breathe 4s ease-in-out infinite; }
    
    @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.05); opacity: 1; } }
    .animate-breathe { animation: breathe 6s ease-in-out infinite; }

    @keyframes ripple-effect { 0% { transform: scale(0); opacity: 0.4; } 100% { transform: scale(4); opacity: 0; } }
    .animate-ripple { animation: ripple-effect 1.2s cubic-bezier(0, 0, 0.2, 1) forwards; }
    
    @keyframes melt-expand {
        0% { transform: scale(0.1); opacity: 0; }
        40% { opacity: 0.9; } /* Reduced opacity from 1.0 to 0.9 */
        100% { transform: scale(50); opacity: 0.9; }
    }
    /* SLOWED DOWN: 3s animation for deeper feel */
    .animate-melt { 
        animation: melt-expand 3.0s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; 
        filter: blur(100px); 
        will-change: transform, opacity;
    }

    /* Meditative Slide Up - Slower & Softer (1.8s) */
    @keyframes slide-up-fade {
        0% { transform: translateY(40px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-up { 
        animation: slide-up-fade 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; 
        will-change: transform, opacity;
    }

    @keyframes floatPath {
      0% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(40px, -60px) rotate(10deg); } 
      66% { transform: translate(-30px, -40px) rotate(-5deg); }
      100% { transform: translate(0, 0) rotate(0deg); }
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

// THIS WAS MISSING
export default GlobalStyles;