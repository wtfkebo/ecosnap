// BadgeCard — achievement badge tile
// Matches Stitch rewards-dashboard.html badge grid items exactly

export default function BadgeCard({ icon, label, subtext, locked = false }) {
  return (
    <div className="bg-[#3e5d55]/20 border border-[#3e5d55] rounded-xl p-6 flex flex-col items-center text-center gap-4">
      {/* Icon ring */}
      <div
        className={`w-16 h-16 rounded-full bg-[#3e5d55] flex items-center justify-center ${
          locked ? 'opacity-40 grayscale' : ''
        }`}
      >
        <span
          className="material-symbols-outlined text-[#a8d0b4] text-3xl"
          style={!locked ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          {icon}
        </span>
      </div>

      {/* Text */}
      <div>
        <h3
          className={`font-bold text-sm text-[#E5E7EB] ${
            locked ? 'opacity-60' : ''
          }`}
        >
          {label}
        </h3>
        <p className="text-[10px] text-[#98a093] mt-1">{subtext}</p>
      </div>
    </div>
  )
}
