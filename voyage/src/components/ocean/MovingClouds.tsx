import { motion } from 'framer-motion'
const clouds = [
  { top:'10%', dur:42, d:0 },
  { top:'26%', dur:58, d:9 },
  { top:'14%', dur:64, d:18 },
]
export default function MovingClouds(){
  return (
    <div className="absolute inset-0 pointer-events-none">
      {clouds.map((c,i)=>(
        <motion.div key={i} className="absolute opacity-70" style={{ top:c.top, left:'-22%' }}
          animate={{ x:['0vw','125vw'] }} transition={{ duration:c.dur, delay:c.d, repeat:Infinity, ease:'linear' }}>
          <svg width="98" height="28" viewBox="0 0 98 28" fill="none">
            <ellipse cx="18" cy="18" rx="16" ry="10" fill="white" opacity={0.95}/>
            <ellipse cx="38" cy="14" rx="22" ry="12" fill="white"/>
            <ellipse cx="62" cy="18" rx="18" ry="10" fill="white" opacity={0.98}/>
            <ellipse cx="80" cy="20" rx="14" ry="8" fill="white" opacity={0.9}/>
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
