import { motion } from 'framer-motion'
const birds = [
  { top:'18%', dur:15, delay:0 },
  { top:'24%', dur:19, delay:2.4 },
  { top:'21%', dur:17, delay:5.2 },
  { top:'28%', dur:22, delay:7.8 },
  { top:'16%', dur:14, delay:9.5 },
]
export default function FlyingBirds(){
  return (
    <div className="absolute inset-0 pointer-events-none">
      {birds.map((b,i)=>(
        <motion.div key={i} className="absolute" style={{ top:b.top, left:'-6%' }}
          animate={{ x:['0vw','120vw'] }} transition={{ duration:b.dur, delay:b.delay, repeat:Infinity, ease:'linear' }}>
          <svg width="18" height="9" viewBox="0 0 18 9" fill="none">
            <path d="M0 5 C4 0,6 0,9 5 C12 0,14 0,18 5" stroke="#4a6b8a" strokeWidth="1" fill="none" strokeLinecap="round" opacity={0.9}/>
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
