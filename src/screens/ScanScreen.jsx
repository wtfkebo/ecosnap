import { useRef } from 'react'
import API from '../services/api'
import TopAppBar    from '../components/TopAppBar.jsx'
import BottomNavBar from '../components/BottomNavBar.jsx'
import ScanReticle  from '../components/ScanReticle.jsx'
import BottomSheet  from '../components/BottomSheet.jsx'
import CameraView   from '../components/CameraView.jsx'
import useScan      from '../hooks/useScan.js'

const HUD = {
  scanning: { sub: 'Analyzing Environment', main: 'Scanning…'      },
  thinking: { sub: 'Consulting Gemini AI',   main: 'Analyzing…'     },
  detected: { sub: 'Object Identified',     main: 'Detected'       },
}

export default function ScanScreen({ onAction, onNavigate }) {
  const captureFnRef = useRef(null)
  const { scanState, sheetVisible, detectedData, setSheetVisible } = useScan(captureFnRef)
  const detected = scanState === 'detected'

  async function handleAction(type) {
    try {
      // Points/History persist in backend
      const { data } = await API.post('/scan/action', {
        item_label: detectedData.label,
        action: type,
        co2_saved_kg: 0.4
      })
      onAction(type) // Switches to RewardFeedback
    } catch (err) {
      console.error('Action failed', err)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col overflow-hidden screen-enter">
      <TopAppBar />

      {/* Real Camera viewport */}
      <main className="flex-grow relative flex items-center justify-center bg-black">
        
        {/* Real Camera Stream */}
        <CameraView onCapture={captureFnRef} />

        {/* Scan reticle */}
        <ScanReticle scanning={!detected} />

        {/* HUD overlay */}
        <div className="absolute top-24 left-6 z-20">
          <div key={scanState} className="bg-black/40 backdrop-blur-sm px-4 py-2 border-l-2 border-[#a8d0b4] hud-enter">
            <p className="text-[10px] text-[#98a093] tracking-widest uppercase">
              {HUD[scanState].sub}
            </p>
            <p className="text-sm font-medium text-[#dfe4ff]">
              {detected ? detectedData.label : HUD[scanState].main}
            </p>
          </div>
        </div>

        {/* Confidence badge */}
        {detected && (
          <div className="absolute top-24 right-6 z-20 badge-enter">
            <div className="bg-[#a8d0b4]/20 backdrop-blur-sm border border-[#a8d0b4]/40 px-3 py-1.5 rounded-full">
              <span className="text-[10px] text-[#a8d0b4] font-bold uppercase tracking-widest">
                {detectedData.confidence} match
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Bottom sheet */}
      <BottomSheet
        visible={sheetVisible}
        item={detected ? detectedData.label : 'Analyzing...'}
        confidence={detected ? detectedData.confidence : ''}
        onReuse={()   => handleAction('reuse')}
        onRecycle={()  => handleAction('recycle')}
        onDispose={()  => handleAction('dispose')}
      />

      <BottomNavBar active="scan" onNavigate={onNavigate} />
    </div>
  )
}
