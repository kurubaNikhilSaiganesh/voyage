import { motion } from 'framer-motion'

export default function AnimatedWaves(){
  return (
    <div className="absolute inset-x-0 bottom-0 h-[44%] overflow-hidden pointer-events-none">
      {/* far distant water — slowest */}
      <motion.div className="absolute inset-x-0 bottom-0 h-full"
        animate={{ x: ['0%','-22%'] }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-[150%]">
          <path d="M0 48 C 120 68, 280 20, 420 45 S 640 70, 820 42 S 1000 14, 1200 46 L1200 120 L0 120 Z" fill="#1a4f6b" opacity={0.9}/>
        </svg>
      </motion.div>
      {/* mid layer — medium */}
      <motion.div className="absolute inset-x-0 bottom-0 h-[82%]"
        animate={{ x: ['-18%','0%'] }} transition={{ duration: 10.5, repeat: Infinity, ease: 'linear' }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-[150%]">
          <path d="M0 62 C 160 92, 360 18, 560 58 S 860 94, 1040 52 S 1160 24, 1200 60 L1200 120 L0 120 Z" fill="#1e6a8a" opacity={0.95}/>
        </svg>
      </motion.div>
      {/* close wave — fastest, top highlight */}
      <motion.div className="absolute inset-x-0 bottom-0 h-[66%]"
        animate={{ x: ['0%','-16%'] }} transition={{ duration: 7.2, repeat: Infinity, ease: 'linear' }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-[150%]">
          <path d="M0 78 C 140 102, 320 42, 520 76 S 780 110, 960 74 S 1120 48, 1200 78 L1200 120 L0 120 Z" fill="#2a8ab0" opacity={1}/>
          {/* white foam line */}
          <path d="M0 78 C 140 102, 320 42, 520 76 S 780 110, 960 74 S 1120 48, 1200 78" fill="none" stroke="white" strokeWidth="1.8" opacity={0.55} strokeLinecap="round"/>
        </svg>
      </motion.div>
    </div>
  )
}
