// BottomNavBar — shared across all screens
// Matches Stitch nav: 4 tabs, active tab highlighted in #a8d0b4 + scale-110

const TABS = [
  { id: 'scan',    icon: 'center_focus_strong', label: 'Scan'    },
  { id: 'market',  icon: 'storefront',           label: 'Market'  },
  { id: 'rewards', icon: 'redeem',               label: 'Rewards' },
  { id: 'profile', icon: 'person',               label: 'Profile' },
]

export default function BottomNavBar({ active = 'scan', onNavigate }) {
  return (
    <nav className="fixed bottom-0 w-full z-50 bg-black/80 backdrop-blur-md border-t border-[#32457c]/15">
      <div className="flex justify-around items-center h-20 px-4 max-w-5xl mx-auto">
        {TABS.map((tab) => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center transition-all duration-150 active:scale-90 ${
                isActive
                  ? 'text-[#a8d0b4] scale-110'
                  : 'text-[#98a093] opacity-70 hover:opacity-100'
              }`}
            >
              <span
                className="material-symbols-outlined mb-1"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {tab.icon}
              </span>
              <span className="text-[10px] font-medium tracking-wide uppercase">
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
