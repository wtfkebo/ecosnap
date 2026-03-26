// TopAppBar — shared across all screens
// Matches Stitch header: logo + points pill

export default function TopAppBar({ points = '2,450 pts', showStarsIcon = false }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md flex justify-between items-center px-6 h-16">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span
          className="material-symbols-outlined text-[#a8d0b4]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          eco
        </span>
        <span className="text-xl font-bold tracking-tighter text-[#a8d0b4]">
          EcoSnap
        </span>
      </div>

      {/* Points */}
      {showStarsIcon ? (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-surface-container rounded-full border border-[#32457c]/15">
          <span
            className="material-symbols-outlined text-[#a8d0b4] text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            stars
          </span>
          <span className="text-[#E5E7EB] font-medium text-sm">{points}</span>
        </div>
      ) : (
        <div className="text-[#E5E7EB] font-medium text-sm">{points}</div>
      )}
    </header>
  )
}
