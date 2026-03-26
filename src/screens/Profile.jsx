import { useState, useEffect } from 'react'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'
import TopAppBar from '../components/TopAppBar.jsx'
import BottomNavBar from '../components/BottomNavBar.jsx'

export default function Profile({ onNavigate }) {
  const { logout } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await API.get('/profile')
        setProfile(data)
      } catch (err) {
        console.error('Failed to fetch profile', err)
      }
    }
    fetchProfile()
  }, [])

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#070d1f]">
        <span className="material-symbols-outlined text-[#a8d0b4] text-5xl animate-pulse">account_circle</span>
      </div>
    )
  }

  const { user, scans, badges } = profile

  return (
    <div className="min-h-screen bg-[#070d1f] text-[#dfe4ff] pb-32 screen-enter">
      <TopAppBar />

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        <section className="mb-12">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#32457c]/15 p-1 bg-[#101931]">
              <span className="material-symbols-outlined text-4xl w-full h-full flex items-center justify-center text-[#a8d0b4]">person</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#dfe4ff]">{user.username}</h2>
              <p className="text-[#98a093] text-sm">Eco-Contributor since {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#09122b] p-6 rounded-xl border border-[#32457c]/15">
              <span className="text-[#98a093] text-xs uppercase tracking-widest font-semibold block mb-2">Impact Score</span>
              <div className="text-3xl font-bold tracking-tighter text-[#a8d0b4]">{user.total_points}</div>
            </div>
            <div className="bg-[#09122b] p-6 rounded-xl border border-[#32457c]/15">
              <span className="text-[#98a093] text-xs uppercase tracking-widest font-semibold block mb-2">Badges Won</span>
              <div className="text-3xl font-bold tracking-tighter text-[#dfe4ff]">{badges.length}</div>
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <div>
            <h3 className="text-[#98a093] text-[10px] font-bold uppercase tracking-[0.2em] mb-4 px-1">Scan History</h3>
            <div className="bg-black rounded-xl p-2 space-y-1">
              {scans.map((h) => (
                <div key={h.id} className="p-4 flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#a8d0b4]">{h.action === 'recycle' ? 'recycling' : 'center_focus_strong'}</span>
                  <div className="flex-1">
                    <div className="text-[#dfe4ff] text-sm font-semibold">{h.item_label}</div>
                    <div className="text-[#98a093] text-xs">+{h.points_earned} pts • {new Date(h.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={logout} className="w-full py-4 text-center text-[#ee7d77] font-semibold text-sm hover:bg-[#7f2927]/10 rounded-xl transition-colors border border-[#32457c]/5">
            Log out
          </button>
        </section>
      </main>

      <BottomNavBar active="profile" onNavigate={onNavigate} />
    </div>
  )
}
