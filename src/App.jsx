// App.jsx — screen router using simple useState
// useScan hook resets automatically when ScanScreen remounts (via key prop)

import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import LoginScreen      from './screens/LoginScreen.jsx'
import ScanScreen       from './screens/ScanScreen.jsx'
import RewardFeedback   from './screens/RewardFeedback.jsx'
import RewardsDashboard from './screens/RewardsDashboard.jsx'
import ReuseMarket      from './screens/ReuseMarket.jsx'
import Profile          from './screens/Profile.jsx'

function MainApp() {
  const { user, loading } = useAuth()
  const [screen, setScreen]         = useState('scan')
  const [lastAction, setLastAction] = useState('reuse')
  const [scanKey, setScanKey]       = useState(0) // increment to remount ScanScreen → resets useScan

  if (loading) return null
  if (!user) return <LoginScreen />

  // Called by BottomNavBar tabs
  function navigate(tab) {
    if (tab === 'scan') setScreen('scan')
    else setScreen(tab)
  }

  function handleScanAction(action) {
    setLastAction(action)
    setScreen('reward')
  }

  function handleScanNext() {
    setScanKey((k) => k + 1) // remount ScanScreen → fresh useScan state
    setScreen('scan')
  }

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen relative overflow-x-hidden">
      {screen === 'scan' && (
        <ScanScreen
          key={scanKey}
          onAction={handleScanAction}
          onNavigate={navigate}
        />
      )}
      {screen === 'reward' && (
        <RewardFeedback
          action={lastAction}
          onScanNext={handleScanNext}
          onNavigate={navigate}
        />
      )}
      {screen === 'rewards' && (
        <RewardsDashboard onNavigate={navigate} />
      )}
      {screen === 'market' && (
        <ReuseMarket onNavigate={navigate} />
      )}
      {screen === 'profile' && (
        <Profile onNavigate={navigate} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}
