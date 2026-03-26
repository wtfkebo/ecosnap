import { useRef, useEffect, useState } from 'react'

export default function CameraView({ onStreamStateChange, onCapture }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          onStreamStateChange?.(true)
        }
      } catch (err) {
        console.error('Camera Access Error:', err)
        setError('Camera permission denied')
        onStreamStateChange?.(false)
      }
    }
    setupCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Expose capture method to parent
  useEffect(() => {
    if (onCapture) {
      onCapture.current = () => {
        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas) return null

        const context = canvas.getContext('2d')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        return canvas.toDataURL('image/jpeg', 0.8)
      }
    }
  }, [onCapture])

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#020617] text-[#ee7d77] text-xs px-12 text-center p-6 z-50">
        <p>{error}. Please enable camera access in your browser settings to use EcoSnap scanning features.</p>
      </div>
    )
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <canvas ref={canvasRef} className="hidden" />
    </>
  )
}
