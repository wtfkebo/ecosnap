import { useState, useEffect } from 'react'
import API from '../services/api'
import TopAppBar from '../components/TopAppBar.jsx'
import BottomNavBar from '../components/BottomNavBar.jsx'
import ItemCard from '../components/ItemCard.jsx'

const FILTERS = ['All Items', 'Electronics', 'Home Goods', 'Clothing']

export default function ReuseMarket({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('All Items')
  const [items, setItems] = useState([])

  useEffect(() => {
    async function fetchItems() {
      try {
        const { data } = await API.get(`/market/items?category=${activeFilter}`)
        setItems(data.items)
      } catch (err) {
        console.error('Failed to fetch market items', err)
      }
    }
    fetchItems()
  }, [activeFilter])

  return (
    <div className="min-h-screen bg-black pb-24 screen-enter">
      <TopAppBar points="2,450 pts" showStarsIcon />

      <main className="pt-24 px-6 max-w-5xl mx-auto">
        <section className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 text-[#dfe4ff]">Reuse Market</h1>
          <p className="text-[#98a093] max-w-md leading-relaxed">Give your pre-loved items a second life. Trade, sell, or donate within the community.</p>
        </section>

        <div className="flex gap-3 mb-8 overflow-x-auto hide-scrollbar pb-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeFilter === f ? 'bg-[#a8d0b4] text-[#234733]' : 'bg-surface-container-highest text-[#98a093]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {items.map((item) => (
            <div key={item.id} className="card-lift">
              <ItemCard
                title={item.title}
                image={item.image_url}
                condition={item.condition}
                points={`${item.points_cost} pts`}
                description={item.description}
                onList={() => {}}
              />
            </div>
          ))}
        </div>
      </main>

      <BottomNavBar active="market" onNavigate={onNavigate} />
    </div>
  )
}
