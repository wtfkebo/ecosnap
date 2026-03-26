import { useState, useEffect } from 'react'
import API from '../services/api'
import TopAppBar from '../components/TopAppBar.jsx'
import BottomNavBar from '../components/BottomNavBar.jsx'
import BadgeCard from '../components/BadgeCard.jsx'
import LeaderboardItem from '../components/LeaderboardItem.jsx'

const RAINFOREST_BG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEQei-rShNRc6gtGLUWQnj-6IcvkHXVM8ViY9Ep-IJYicVRmgG1-00raZkTJcx40tY2MRiC3kTTpD4zOTeCzVq8jxh_qStM95ZktwXsyer5IElHldGa88HInSaroRdmKmz_tuqSHEF6LBC4_5fSjJG8SzYzJqgfDh5qcn9ZCOmMW7m5eKENzhFmScW2ZuLISbpT4B5itjkpK7GXSh5zrQg9AkoJjMGMQ8D8UOyq-dM1x1Z5FM0tOUwtlhDSOWi51iWL6c6IaJj1bYP'

export default function RewardsDashboard({ onNavigate }) {
  const [summary, setSummary] = useState({ total_points: 0, level_label: 'Eco Starter', points_to_next: 500 })
  const [badges, setBadges] = useState([])
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [sumRes, badgeRes, leadRes] = await Promise.all([
          API.get('/rewards/summary'),
          API.get('/rewards/badges'),
          API.get('/rewards/leaderboard')
        ])
        setSummary(sumRes.data)
        setBadges(badgeRes.data.badges)
        setLeaderboard(leadRes.data.leaderboard)
      } catch (err) {
        console.error('Failed to fetch rewards data', err)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-black pb-32 screen-enter">
      <TopAppBar points={`${summary.total_points} pts`} showStarsIcon />

      <main className="pt-24 px-6 max-w-5xl mx-auto space-y-12">
        <section className="flex flex-col items-center text-center space-y-6 py-8">
          <div className="space-y-1">
            <p className="text-[#98a093] uppercase tracking-[0.2em] text-[10px] font-bold">Total Impact Balance</p>
            <h1 className="text-7xl font-black tracking-tighter text-[#a8d0b4]">{summary.total_points}</h1>
          </div>
          <div className="w-full max-w-md space-y-3">
            <div className="flex justify-between items-end text-xs font-medium">
              <span className="text-[#96a9e6]">LEVEL {summary.level}: {summary.level_label}</span>
              <span className="text-[#a8d0b4]">{summary.points_to_next} PTS TO NEXT LEVEL</span>
            </div>
            <div className="h-1 w-full bg-[#020617] overflow-hidden">
              <div className="h-full bg-[#a8d0b4] progress-bar" style={{ width: '65%' }} />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-[#E5E7EB]">Active Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((b) => (
              <div key={b.key} className="card-lift"><BadgeCard {...b} /></div>
            ))}
          </div>
        </section>

        <div className="grid md:grid-cols-5 gap-8">
          <section className="md:col-span-3 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-[#E5E7EB]">Community Leaders</h2>
            <div className="bg-[#020617] border border-[#3e5d55]/30 rounded-xl overflow-hidden divide-y divide-[#32457c]/15">
              {leaderboard.map((l) => (
                <LeaderboardItem key={l.rank} {...l} />
              ))}
            </div>
          </section>

          <section className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-[#E5E7EB]">Real Impact</h2>
            <div className="bg-surface-container rounded-xl p-8 flex flex-col justify-between h-[300px] border border-[#32457c]/10">
              <span className="text-[#a8d0b4] text-4xl material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              <h3 className="text-5xl font-black text-[#E5E7EB] tracking-tighter">12.4kg</h3>
              <p className="text-[#98a093] text-xs uppercase tracking-[0.1em] font-medium">CO2 Offset This Month</p>
            </div>
          </section>
        </div>

        <section className="pb-12">
          <div className="relative h-60 rounded-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <img src={RAINFOREST_BG} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end items-start space-y-2">
              <h3 className="text-3xl font-black text-white tracking-tight">Protect 1 Acre of Amazon</h3>
              <p className="text-white/70 text-sm max-w-sm">Use 5,000 points to directly fund habitat preservation.</p>
              <button className="mt-4 bg-[#a8d0b4] text-[#234733] font-bold text-sm px-6 py-2.5 rounded-xl">Pledge Points</button>
            </div>
          </div>
        </section>
      </main>

      <BottomNavBar active="rewards" onNavigate={onNavigate} />
    </div>
  )
}
