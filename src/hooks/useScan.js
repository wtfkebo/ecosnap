import { useState, useEffect, useRef } from 'react'
import API from '../services/api'

export default function useScan(captureFnRef) {
  const [scanState, setScanState] = useState('scanning')
  const [sheetVisible, setSheetVisible] = useState(false)
  const [detectedData, setDetectedData] = useState(null)
  
  const isMounted = useRef(true)

  useEffect(() => {
    async function triggerDetection() {
      // 1. Initial 2.5s scan of the scene
      await new Promise(r => setTimeout(r, 2500))
      
      const attempt = async () => {
        if (!isMounted.current || scanState === 'detected') return

        try {
          // 2. Capture and Start "Thinking"
          const base64 = captureFnRef.current?.()
          if (!base64) return
          
          setScanState('thinking')
          const { data } = await API.post('/scan/detect', { imageBase64: base64 })

          if (!isMounted.current) return

          // 3. Success!
          setDetectedData(data)
          setScanState('detected')
          setSheetVisible(true)
        } catch (err) {
          console.error('AI Scan Error, Retrying...', err)
          if (isMounted.current) {
            setScanState('scanning')
            // Wait 5 seconds before next attempt to avoid spamming the waking-up server
            setTimeout(attempt, 5000)
          }
        }
      }
      
      attempt()
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
