// src/components/AudioRecorder.jsx
import { useState, useRef, useEffect } from 'react'

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [time, setTime] = useState(0)
  const intervalRef = useRef(null)

  const start = () => {
    setIsRecording(true)
    setTime(0)
    intervalRef.current = setInterval(() => {
      setTime(t => t + 0.1)
    }, 100)
    setTimeout(stop, 15000) // 15s
  }

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsRecording(false)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="bg-gray-800 p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-4">🎤 Audio Recording</h3>
      <button
        onClick={start}
        disabled={isRecording}
        className="w-full bg-cyan-600 hover:bg-cyan-700 py-3 rounded-lg disabled:opacity-70"
      >
        {isRecording ? 'Recording...' : 'Start 15s Pink Noise'}
      </button>
      {isRecording && (
        <div className="mt-3">
          <div className="flex justify-between text-sm">
            <span>{time.toFixed(1)}s</span>
            <span>15s</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
            <div
              className="bg-cyan-500 h-2 rounded-full transition-all"
              style={{ width: `${(time / 15) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}