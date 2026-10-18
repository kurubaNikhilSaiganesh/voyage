import AnimatedShip from './AnimatedShip'
import AnimatedWaves from './AnimatedWaves'
import FlyingBirds from './FlyingBirds'
import MovingClouds from './MovingClouds'

export default function OceanScene({ compact=false, overlayCard }: { compact?: boolean, overlayCard?: React.ReactNode }){
  return (
    <div className={`relative w-full overflow-hidden ${compact ? 'h-[280px] lg:h-[380px]' : 'h-[320px] lg:h-[420px]'} bg-[#eaf2f8]`}>
      {/* sky — pale like Concept 1 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#eaf3fb] via-[#d6e8f5] to-[#b8d4ec]" />
      {/* distant mountains — faded */}
      <svg className="absolute inset-x-0 top-[38%] h-[28%]" viewBox="0 0 600 80" preserveAspectRatio="none">
        <path d="M0 62 L80 22 L140 48 L200 18 L280 56 L340 28 L410 54 L470 20 L540 58 L600 40 L600 80 L0 80 Z" fill="#c6d8ea" opacity={0.9}/>
        <path d="M0 66 L100 34 L180 54 L240 30 L320 60 L380 38 L450 62 L520 32 L600 52 L600 80 L0 80 Z" fill="#b3c9df" opacity={0.95}/>
      </svg>
      {/* sun subtle */}
      <div className="absolute right-[18%] top-[16%] w-14 h-14 rounded-full bg-white/70 blur-[0.5px] border border-white/40" />

      <MovingClouds />
      <FlyingBirds />
      <AnimatedWaves />
      <AnimatedShip />

      {/* optional overlay card at bottom like Concept 1 Upcoming Mission */}
      {overlayCard && (
        <div className="absolute left-3 right-3 bottom-3">
          {overlayCard}
        </div>
      )}
    </div>
  )
}
