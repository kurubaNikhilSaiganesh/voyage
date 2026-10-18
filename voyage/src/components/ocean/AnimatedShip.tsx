import { motion } from 'framer-motion'

export default function AnimatedShip(){
  return (
    <motion.div
      className="absolute left-[48%] bottom-[40%]"
      style={{ x: '-50%' }}
      animate={{ y: [0,-4,0], x: ['-50%','-49%','-50%'] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Detailed tall ship like Concept 1 — centered large */}
      <svg width="96" height="78" viewBox="0 0 96 78" fill="none" aria-label="ship">
        {/* hull shadow */}
        <ellipse cx="48" cy="70" rx="30" ry="3" fill="black" opacity={0.18}/>
        {/* hull */}
        <path d="M12 52 L84 52 C 84 52, 80 62, 72 64 L24 64 C 16 64, 12 58, 12 52 Z" fill="#1a2a3a" stroke="#0f1e2e" strokeWidth="1"/>
        <path d="M14 52 L82 52 L84 52 L12 52 Z" fill="#0f1e2e"/>
        {/* hull planks */}
        <path d="M18 56 L78 56" stroke="#2a4a6b" strokeWidth="0.6" opacity={0.5}/>
        {/* stern cabin */}
        <path d="M28 38 L64 38 L64 52 L28 52 Z" fill="#e8dde0" stroke="#0f1e2e" strokeWidth="0.9"/>
        <rect x="31" y="42" width="5" height="5" rx="0.5" fill="#7fbcd6" stroke="#0f1e2e" strokeWidth="0.6"/>
        <rect x="38" y="42" width="5" height="5" rx="0.5" fill="#7fbcd6" stroke="#0f1e2e" strokeWidth="0.6"/>
        <rect x="45" y="42" width="5" height="5" rx="0.5" fill="#7fbcd6" stroke="#0f1e2e" strokeWidth="0.6"/>
        <rect x="54" y="42" width="5" height="5" rx="0.5" fill="#7fbcd6" stroke="#0f1e2e" strokeWidth="0.6"/>
        {/* masts */}
        <rect x="34.5" y="8" width="1.6" height="30" fill="#2b1d12"/>
        <rect x="47.2" y="4" width="1.6" height="34" fill="#2b1d12"/>
        <rect x="59.5" y="10" width="1.4" height="28" fill="#2b1d12"/>
        {/* sails — off-white with soft shading, like illustration */}
        {/* front mast sails */}
        <path d="M35.3 10 L26 22 L35.3 22 Z" fill="#faf7f0" stroke="#1a2a3a" strokeWidth="0.5"/>
        <path d="M35.3 22.5 L26 34 L35.3 34 Z" fill="#f2ece1" stroke="#1a2a3a" strokeWidth="0.5"/>
        <path d="M36.1 10 L45 22 L36.1 22 Z" fill="white" stroke="#1a2a3a" strokeWidth="0.5"/>
        <path d="M36.1 22.5 L45 34 L36.1 34 Z" fill="#faf7f0" stroke="#1a2a3a" strokeWidth="0.5"/>
        {/* main mast */}
        <path d="M48 6 L36 18 L48 18 Z" fill="#faf7f0" stroke="#1a2a3a" strokeWidth="0.5"/>
        <path d="M49.6 6 L62 18 L49.6 18 Z" fill="white" stroke="#1a2a3a" strokeWidth="0.5"/>
        <path d="M48 18.5 L36 30 L48 30 Z" fill="#f2ece1" stroke="#1a2a3a" strokeWidth="0.5"/>
        <path d="M49.6 18.5 L62 30 L49.6 30 Z" fill="#faf7f0" stroke="#1a2a3a" strokeWidth="0.5"/>
        {/* mizzen */}
        <path d="M60.2 12 L54 22 L60.2 22 Z" fill="#faf7f0" stroke="#1a2a3a" strokeWidth="0.5"/>
        <path d="M61.6 12 L68 22 L61.6 22 Z" fill="white" stroke="#1a2a3a" strokeWidth="0.5"/>
        <path d="M60.2 22.5 L54 32 L60.2 32 Z" fill="#f2ece1" stroke="#1a2a3a" strokeWidth="0.5"/>
        <path d="M61.6 22.5 L68 32 L61.6 32 Z" fill="#faf7f0" stroke="#1a2a3a" strokeWidth="0.5"/>
        {/* flags */}
        <path d="M48 4 L55 7 L48 10 Z" fill="#c0392b"/>
      </svg>
    </motion.div>
  )
}
