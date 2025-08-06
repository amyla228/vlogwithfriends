import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Pause, RotateCcw, Save, CameraOff } from 'lucide-react'
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
  const [caption, setCaption] = useState('')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    const foundPrompt = mockPrompts.find(p => p.id === promptId)
    setPrompt(foundPrompt || null)
  }, [promptId])

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        console.log('Initializing camera...')
        
        // Check if getUserMedia is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('getUserMedia not supported')
        }
        
        // Mobile-optimized constraints
        const constraints = {
          video: {
            facingMode: 'user',
            width: { ideal: 1280, min: 640 },
            height: { ideal: 720, min: 480 },
            aspectRatio: { ideal: 16/9 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        }
        
        console.log('Requesting camera with constraints:', constraints)
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
        console.log('Camera stream obtained:', mediaStream)
        setStream(mediaStream)
        
        // Wait for video element to be available
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded, dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight)
            setIsCameraReady(true)
          }
          videoRef.current.onerror = (error) => {
            console.error('Video error:', error)
            setIsCameraReady(false)
          }
          videoRef.current.oncanplay = () => {
            console.log('Video can play')
            setIsCameraReady(true)
          }
          videoRef.current.onplay = () => {
            console.log('Video started playing')
            setIsCameraReady(true)
          }
        } else {
          console.error('Video ref not available')
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
        setIsCameraReady(false)
      }
    }

    // Small delay to ensure component is mounted
    const timer = setTimeout(() => {
      initCamera()
    }, 100)

    return () => {
      clearTimeout(timer)
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

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

  const handleStartRecording = async () => {
    if (!stream) return

    try {
      chunksRef.current = []
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      })
      
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        setRecordedBlob(blob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)
    } catch (error) {
      console.error('Error starting recording:', error)
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
    
    setIsRecording(false)
    setIsPaused(false)
    
    if (recordedBlob) {
      const videoUrl = URL.createObjectURL(recordedBlob)
      const newClip: VideoClip = {
        id: `clip-${Date.now()}`,
        promptId: prompt.id,
        userId: 'current-user',
        videoUrl: videoUrl,
        duration: recordingTime,
        createdAt: new Date()
      }
      setRecordedClip(newClip)
    }
  }

  const handlePauseRecording = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
      } else {
        mediaRecorderRef.current.pause()
      }
    }
    setIsPaused(!isPaused)
  }

  const handleRerecord = () => {
    setIsRecording(false)
    setIsPaused(false)
    setRecordingTime(0)
    setRecordedClip(null)
    setRecordedBlob(null)
    setCaption('')
  }

  const handleSave = () => {
    if (recordedClip) {
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
            {/* Camera Interface */}
            <div className="mb-8">
              <div className="relative w-80 h-80 mx-auto rounded-2xl overflow-hidden bg-black">
                {stream ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    onLoadedMetadata={() => {
                      console.log('Video loaded metadata')
                      setIsCameraReady(true)
                    }}
                    onCanPlay={() => {
                      console.log('Video can play')
                      setIsCameraReady(true)
                    }}
                    onPlay={() => {
                      console.log('Video started playing')
                      setIsCameraReady(true)
                    }}
                    onError={(e) => {
                      console.error('Video error:', e)
                      setIsCameraReady(false)
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <CameraOff className="w-12 h-12 mx-auto mb-2" />
                      <p>Camera not available</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Requesting camera access...
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Recording indicator */}
                {isRecording && (
                  <div className="absolute top-4 right-4 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                )}
                
                {/* Timer overlay */}
                {isRecording && (
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full">
                    {formatTime(recordingTime)}
                  </div>
                )}
              </div>
            </div>

            {/* Recording Controls */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  disabled={!isCameraReady}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="relative w-80 h-80 mx-auto rounded-2xl overflow-hidden bg-black">
                <video
                  src={recordedClip.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
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
