import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Play, Pause, RotateCcw, Save, Mic, Type } from 'lucide-react'
import { mockPrompts } from '../data/mockData'
import { Prompt, VideoClip } from '../types'

export default function RecordingPage() {
  const { promptId } = useParams<{ promptId: string }>()
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedClip, setRecordedClip] = useState<VideoClip | null>(null)
  const [showCaptionModal, setShowCaptionModal] = useState(false)
  const [caption, setCaption] = useState('')

  useEffect(() => {
    const foundPrompt = mockPrompts.find(p => p.id === promptId)
    setPrompt(foundPrompt || null)
  }, [promptId])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording, isPaused])

  if (!prompt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Prompt not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    setIsPaused(false)
    setRecordingTime(0)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
    // Simulate recording a clip
    const newClip: VideoClip = {
      id: `clip-${Date.now()}`,
      promptId: prompt.id,
      userId: 'current-user',
      videoUrl: 'mock-video-url',
      duration: recordingTime,
      createdAt: new Date()
    }
    setRecordedClip(newClip)
  }

  const handlePauseRecording = () => {
    setIsPaused(!isPaused)
  }

  const handleRerecord = () => {
    setIsRecording(false)
    setIsPaused(false)
    setRecordingTime(0)
    setRecordedClip(null)
    setCaption('')
  }

  const handleSave = () => {
    if (recordedClip) {
      // Save the clip with caption
      const finalClip = {
        ...recordedClip,
        caption: caption.trim() || undefined
      }
      console.log('Saving clip:', finalClip)
      navigate('/')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-6 bg-white/80 backdrop-blur-lg border-b border-gray-100"
      >
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-800">Free Record</h1>
            <p className="text-gray-600 text-sm">Record however you like</p>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </motion.header>

      {/* Content */}
      <div className="px-6 py-8">
        {!recordedClip ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Recording Area */}
            <div className="mb-8">
              <div className="w-64 h-64 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Tap to start recording</p>
                </div>
              </div>
            </div>

            {/* Timer */}
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8"
              >
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {formatTime(recordingTime)}
                </div>
                <div className="text-gray-500">
                  {isPaused ? 'Paused' : 'Recording...'}
                </div>
              </motion.div>
            )}

            {/* Recording Controls */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </button>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePauseRecording}
                    className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    {isPaused ? (
                      <Play className="w-5 h-5 text-gray-600 ml-0.5" />
                    ) : (
                      <Pause className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={handleStopRecording}
                    className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <div className="w-4 h-4 bg-white rounded-sm" />
                  </button>
                </div>
              )}
            </div>

            {/* Prompt Info */}
            <div className="card p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                {prompt.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {prompt.description}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Preview */}
            <div className="mb-8">
              <div className="w-64 h-64 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Preview your recording</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {formatTime(recordedClip.duration)}
                  </p>
                </div>
              </div>
            </div>

            {/* Caption Input */}
            <div className="mb-8">
              <div className="card p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Add a caption (optional)</h3>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What's happening in this video?"
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleRerecord}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Rerecord</span>
              </button>
              
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <Save className="w-4 h-4" />
                <span>Save & Share</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
