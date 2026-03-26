// RewardPopup — with reward-spring + points-enter animations
import Button from './Button.jsx'

export default function RewardPopup({
  points = 30,
  action = 'Good choice',
  impact = '0.4kg CO2 Saved',
  type = 'Glass Recycle',
  milestoneLabel = '75% Complete',
  milestoneText = 'Earn 120 more points to unlock the "Eco Warrior" badge and 15% off at Sustainable Goods.',
}) {
  return (
    <>
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 w-full max-w-md mx-auto">
        <div className="relative w-full aspect-square flex items-center justify-center mb-12">
          {/* Ambient glow */}
          <div className="absolute inset-0 rounded-full bg-[#a8d0b4]/5 scale-150 blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            {/* Check icon — springs in */}
            <div className="mb-8 p-6 rounded-full bg-surface-container-low border border-[#a8d0b4]/10 reward-pop">
              <span
                className="material-symbols-outlined text-6xl text-[#a8d0b4]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>

            {/* Points — drifts up */}
            <h1 className="text-5xl font-extrabold tracking-tighter text-[#a8d0b4] mb-4 points-enter">
              +{points} EcoPoints
            </h1>

            <p className="text-xl font-medium text-[#E5E7EB] tracking-wide opacity-90 points-enter">
              {action}
            </p>

            {/* Stats grid */}
            <div className="mt-12 grid grid-cols-2 gap-4 w-full opacity-60">
              <div className="text-left border-l border-[#32457c]/20 pl-4">
                <p className="text-[10px] uppercase tracking-widest text-[#98a093] mb-1">
                  Impact
                </p>
                <p className="text-sm font-semibold">{impact}</p>
              </div>
              <div className="text-left border-l border-[#32457c]/20 pl-4">
                <p className="text-[10px] uppercase tracking-widest text-[#98a093] mb-1">
                  Type
                </p>
                <p className="text-sm font-semibold">{type}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Milestone card */}
      <section className="w-full px-8 pb-4 pt-4">
        <div className="bg-surface-container rounded-2xl p-6 border border-[#32457c]/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold tracking-tight text-[#E5E7EB]">
              Next Milestone
            </h3>
            <span className="text-xs font-medium text-[#a8d0b4]">
              {milestoneLabel}
            </span>
          </div>
          {/* Animated progress bar */}
          <div className="w-full h-1 bg-surface-container-highest overflow-hidden">
            <div className="h-full bg-[#a8d0b4] w-3/4 progress-bar" />
          </div>
          <p className="mt-3 text-[10px] text-[#98a093] leading-relaxed">
            {milestoneText}
          </p>
        </div>
      </section>
    </>
  )
}
