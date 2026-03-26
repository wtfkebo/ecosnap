// RewardFeedback — screen-enter on mount
import TopAppBar    from '../components/TopAppBar.jsx'
import BottomNavBar from '../components/BottomNavBar.jsx'
import RewardPopup  from '../components/RewardPopup.jsx'
import Button       from '../components/Button.jsx'

const rewardMap = {
  reuse:   { points: 30, action: 'Good choice',    impact: '0.4kg CO2 Saved', type: 'Reuse'        },
  recycle: { points: 10, action: 'Nice recycling',  impact: '0.2kg CO2 Saved', type: 'Glass Recycle' },
  dispose: { points: 0,  action: 'Could do better', impact: '0.0kg CO2 Saved', type: 'Disposal'      },
}

export default function RewardFeedback({ action = 'reuse', onScanNext, onNavigate }) {
  const reward = rewardMap[action] || rewardMap.reuse

  return (
    <div className="min-h-screen flex flex-col justify-between overflow-hidden bg-black screen-enter">
      <TopAppBar points="2,450 pts" />

      <div className="pt-16 flex flex-col flex-1">
        <RewardPopup
          points={reward.points}
          action={reward.action}
          impact={reward.impact}
          type={reward.type}
          milestoneLabel="75% Complete"
          milestoneText='Earn 120 more points to unlock the "Eco Warrior" badge and 15% off at Sustainable Goods.'
        />

        {/* CTAs */}
        <div className="w-full space-y-4 px-8 pb-28">
          <Button variant="primary" icon="center_focus_strong" onClick={onScanNext}>
            Scan Next
          </Button>
          <Button variant="ghost" onClick={() => onNavigate('rewards')}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      <BottomNavBar active="scan" onNavigate={onNavigate} />
    </div>
  )
}
