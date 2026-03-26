import { useState, useEffect, useRef } from 'react'
import API from '../services/api'

export default function useScan(captureFnRef) {
  const [scanState, setScanState] = useState('scanning')
  const [sheetVisible, setSheetVisible] = useState(false)
  const [detectedData, setDetectedData] = useState(null)
  
  const isMounted = useRef(true)

  useEffect(() => {
    async function triggerDetection() {
      // 1. Wait 2 seconds of scanning before taking the picture
      await new Promise(r => setTimeout(r, 2000))
      
      if (!isMounted.current || scanState !== 'scanning') return

      try {
        // 2. Capture frame from video view
        const base64 = captureFnRef.current?.()
        if (!base64) return

        // 3. Call backend Gemini Vision
        const { data } = await API.post('/scan/detect', { imageBase64: base64 })

        if (!isMounted.current) return

        // 4. Update state with real AI results
        setDetectedData(data)
        setScanState('detected')
        setSheetVisible(true)
      } catch (err) {
        console.error('Detection failed', err)
        // Retry after a failure
        if (isMounted.current) triggerDetection()
      }
    }

    triggerDetection()

    return () => { isMounted.current = false }
  }, [])

  return {
    scanState,
    sheetVisible,
    detectedData,
    setSheetVisible
  }
}
