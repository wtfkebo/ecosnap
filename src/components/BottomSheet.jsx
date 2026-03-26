// BottomSheet — slide-up action panel on Scan Screen
// Matches Stitch scan-screen.html section#bottom-sheet exactly

import Button from './Button.jsx'

export default function BottomSheet({
  item = 'Plastic Bottle',
  confidence = '98.4%',
  onReuse,
  onRecycle,
  onDispose,
  visible = true,
}) {
  if (!visible) return null

  return (
    <section className="relative z-40 px-6 pb-24 sheet-enter">
      <div className="bg-[#5F7F76] rounded-[16px] p-6 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {item}
            </h2>
            <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-widest mt-1">
              Confidence: {confidence}
            </p>
          </div>
          <div className="bg-white/10 p-2 rounded-xl">
            <span className="material-symbols-outlined text-white">
              center_focus_strong
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            variant="primary"
            icon="cycle"
            pointsBadge="+30 pts"
            onClick={onReuse}
          >
            REUSE
          </Button>

          <Button
            variant="secondary"
            icon="recycling"
            pointsBadge={<span className="text-sm text-[#AEB6A8]">+10 pts</span>}
            onClick={onRecycle}
          >
            RECYCLE
          </Button>

          <Button variant="ghost" onClick={onDispose}>
            DISPOSE
          </Button>
        </div>

        {/* Impact info */}
        <div className="mt-6 flex items-center gap-3 bg-black/10 p-4 rounded-xl border border-white/5">
          <span className="material-symbols-outlined text-[#a8d0b4] text-lg">
            info
          </span>
          <p className="text-[#9CA3AF] text-xs leading-relaxed">
            Reuse avoids ~120g waste. Choosing to reuse significantly lowers
            your carbon footprint for this item.
          </p>
        </div>
      </div>
    </section>
  )
}
