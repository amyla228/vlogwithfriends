import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Pause, RotateCcw, SkipForward, Check, CameraOff, Download } from 'lucide-react'
import { mockPrompts } from '../data/mockData'
import { Prompt, VideoClip } from '../types'

export default function GuidedTemplatePage() {
  const { promptId } = useParams<{ promptId: string }>()
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedClips, setRecordedClips] = useState<VideoClip[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [isCompiling, setIsCompiling] = useState(false)
  const [compiledVideoUrl, setCompiledVideoUrl] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    const foundPrompt = mockPrompts.find(p => p.id === promptId)
    setPrompt(foundPrompt || null)
  }, [promptId])

  useEffect(() => {
    if (prompt?.template?.steps && prompt.template.steps[currentStepIndex]) {
      const currentStep = prompt.template.steps[currentStepIndex]
      setTimeRemaining(currentStep?.duration || 0)
    }
  }, [currentStepIndex, prompt])

  // Initialize camera - only run once when component mounts
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
        
      } catch (error) {
        console.error('Error accessing camera:', error)
        setIsCameraReady(false)
      }
    }

    // Only initialize camera if we don't already have a stream
    if (!stream) {
      initCamera()
    }
  }, []) // Empty dependency array - only run once

  // Configure video element whenever stream or step changes
  useEffect(() => {
    if (stream && videoRef.current) {
      console.log('Configuring video element for step', currentStepIndex)
      
      // Set up video element - same as initial setup
      videoRef.current.srcObject = stream
      videoRef.current.muted = true
      videoRef.current.playsInline = true
      videoRef.current.autoplay = true
      
      // Event handlers - same as initial setup
      const handleLoadedMetadata = () => {
        console.log('Video metadata loaded for step', currentStepIndex)
        setIsCameraReady(true)
        // Force play after metadata is loaded - same as initial setup
        videoRef.current?.play().catch(error => {
          console.error('Error playing video after metadata:', error)
        })
      }
      
      const handleCanPlay = () => {
        console.log('Video can play for step', currentStepIndex)
        setIsCameraReady(true)
      }
      
      const handlePlay = () => {
        console.log('Video started playing for step', currentStepIndex)
        setIsCameraReady(true)
      }
      
      const handleError = (error: Event) => {
        console.error('Video error for step', currentStepIndex, ':', error)
        setIsCameraReady(false)
      }
      
      const handleLoadedData = () => {
        console.log('Video loaded data for step', currentStepIndex)
        setIsCameraReady(true)
      }
      
      // Remove existing event listeners
      videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata)
      videoRef.current.removeEventListener('canplay', handleCanPlay)
      videoRef.current.removeEventListener('play', handlePlay)
      videoRef.current.removeEventListener('error', handleError)
      videoRef.current.removeEventListener('loadeddata', handleLoadedData)
      
      // Add new event listeners
      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata)
      videoRef.current.addEventListener('canplay', handleCanPlay)
      videoRef.current.addEventListener('play', handlePlay)
      videoRef.current.addEventListener('error', handleError)
      videoRef.current.addEventListener('loadeddata', handleLoadedData)
      
      // Force play the video - same as initial setup
      const playVideo = async () => {
        try {
          await videoRef.current!.play()
          console.log('Video started playing for step', currentStepIndex)
        } catch (error) {
          console.error('Error playing video for step', currentStepIndex, ':', error)
        }
      }
      
      // Try to play immediately and also after a short delay - same as initial setup
      playVideo()
      setTimeout(playVideo, 200)
      
      // Cleanup function
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata)
          videoRef.current.removeEventListener('canplay', handleCanPlay)
          videoRef.current.removeEventListener('play', handlePlay)
          videoRef.current.removeEventListener('error', handleError)
          videoRef.current.removeEventListener('loadeddata', handleLoadedData)
        }
      }
    }
  }, [stream, currentStepIndex])

  // Compile all clips into a single video
  const compileVideo = useCallback(async () => {
    if (recordedClips.length === 0) return

    setIsCompiling(true)
    try {
      console.log('Compiling video from', recordedClips.length, 'clips')
      
      // Create a canvas to combine videos
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context not available')

      // Set canvas size (use the first clip's dimensions as reference)
      canvas.width = 1280
      canvas.height = 720

      // Create a video element for each clip
      const videoElements: HTMLVideoElement[] = []
      const loadPromises: Promise<void>[] = []

      for (const clip of recordedClips) {
        const video = document.createElement('video')
        video.src = clip.videoUrl
        video.muted = true
        video.playsInline = true
        
        const loadPromise = new Promise<void>((resolve) => {
          video.onloadedmetadata = () => resolve()
        })
        
        loadPromises.push(loadPromise)
        videoElements.push(video)
      }

      // Wait for all videos to load
      await Promise.all(loadPromises)

      // Create MediaRecorder to record the canvas
      const canvasStream = canvas.captureStream(30) // 30 FPS
      const mediaRecorder = new MediaRecorder(canvasStream, {
        mimeType: 'video/webm;codecs=vp9'
      })

      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const compiledBlob = new Blob(chunks, { type: 'video/webm' })
        const compiledUrl = URL.createObjectURL(compiledBlob)
        setCompiledVideoUrl(compiledUrl)
        setIsCompiling(false)
        console.log('Video compilation complete')
      }

      // Start recording
      mediaRecorder.start()

      // Play each clip sequentially
      for (let i = 0; i < videoElements.length; i++) {
        const video = videoElements[i]
        const clip = recordedClips[i]
        
        // Set video dimensions to fit canvas
        const aspectRatio = video.videoWidth / video.videoHeight
        const canvasAspectRatio = canvas.width / canvas.height
        
        let drawWidth = canvas.width
        let drawHeight = canvas.height
        let drawX = 0
        let drawY = 0

        if (aspectRatio > canvasAspectRatio) {
          // Video is wider than canvas
          drawHeight = canvas.width / aspectRatio
          drawY = (canvas.height - drawHeight) / 2
        } else {
          // Video is taller than canvas
          drawWidth = canvas.height * aspectRatio
          drawX = (canvas.width - drawWidth) / 2
        }

        // Play the video
        video.currentTime = 0
        await video.play()

        // Draw frames for the duration of the clip
        const startTime = Date.now()
        const clipDuration = clip.duration * 1000 // Convert to milliseconds

        while (Date.now() - startTime < clipDuration) {
          ctx.drawImage(video, drawX, drawY, drawWidth, drawHeight)
          await new Promise(resolve => setTimeout(resolve, 33)) // ~30 FPS
        }

        video.pause()
      }

      mediaRecorder.stop()
    } catch (error) {
      console.error('Error compiling video:', error)
      setIsCompiling(false)
    }
  }, [recordedClips])

  const handleStartRecording = useCallback(async () => {
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
    } catch (error) {
      console.error('Error starting recording:', error)
      // Fallback to mock recording
      setIsRecording(true)
      setIsPaused(false)
    }
  }, [stream])

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
    
    setIsRecording(false)
    setIsPaused(false)
    
    if (recordedBlob && prompt?.template?.steps && prompt.template.steps[currentStepIndex]) {
      const currentStep = prompt.template.steps[currentStepIndex]
      // Create video URL from blob
      const videoUrl = URL.createObjectURL(recordedBlob)
      
      const newClip: VideoClip = {
        id: `clip-${Date.now()}-${currentStepIndex}`,
        stepId: currentStep.id,
        promptId: prompt.id,
        userId: 'current-user',
        videoUrl: videoUrl,
        duration: currentStep.duration - timeRemaining,
        createdAt: new Date()
      }
      
      // Check if we already have a clip for this step and replace it
      setRecordedClips(prev => {
        const existingClipIndex = prev.findIndex(clip => clip.stepId === currentStep.id)
        if (existingClipIndex >= 0) {
          // Replace existing clip
          const updatedClips = [...prev]
          updatedClips[existingClipIndex] = newClip
          return updatedClips
        } else {
          // Add new clip
          return [...prev, newClip]
        }
      })
      
      setRecordedBlob(null)
    }
  }, [recordedBlob, prompt, currentStepIndex, timeRemaining, isRecording])

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

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleStopRecording()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording, isPaused, timeRemaining, handleStopRecording])

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  if (!prompt || !prompt.template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Template not found</h2>
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

  // At this point, we know prompt and prompt.template are defined
  const template = prompt.template!
  const currentStep = template.steps[currentStepIndex]
  const progress = ((currentStepIndex + 1) / template.steps.length) * 100
  const isLastStep = currentStepIndex === template.steps.length - 1

  const handleRerecord = () => {
    setTimeRemaining(currentStep.duration)
    setIsRecording(false)
    setIsPaused(false)
    setRecordedBlob(null)
    // Remove the last recorded clip
    setRecordedClips(prev => prev.slice(0, -1))
  }

  const handleNextStep = () => {
    if (currentStepIndex < template.steps.length - 1) {
      const nextStepIndex = currentStepIndex + 1
      setCurrentStepIndex(nextStepIndex)
      setTimeRemaining(template.steps[nextStepIndex].duration)
      setIsRecording(false)
      setIsPaused(false)
      setRecordedBlob(null)
      
      // Ensure camera is ready for the next step
      if (stream && videoRef.current) {
        console.log('Reinitializing camera for next step')
        videoRef.current.srcObject = stream
        videoRef.current.play().catch(error => {
          console.error('Error playing video for next step:', error)
        })
      }
    }
  }

  const handleSkipStep = () => {
    if (currentStepIndex < template.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handleFinish = async () => {
    if (recordedClips.length > 0) {
      await compileVideo()
    } else {
      // Navigate to completion page or save
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
            <h1 className="text-lg font-semibold text-gray-800">
              {template.title}
            </h1>
            <p className="text-gray-600 text-sm">
              Step {currentStepIndex + 1} of {template.steps.length}
            </p>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.header>

      {/* Content */}
      <div className="px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="text-center"
          >
            {/* Step Content */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-4xl">
                {currentStep.emoji}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {currentStep.title}
              </h2>
              <p className="text-gray-600 text-lg">
                {currentStep.description}
              </p>
            </div>

            {/* Camera Interface */}
            <div className="mb-8">
              <div className="relative w-80 h-80 mx-auto rounded-2xl overflow-hidden bg-black">
                {stream ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    controls={false}
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }} // Mirror the camera
                    key={`video-${currentStepIndex}`} // Add key to force re-render
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
                    {formatTime(timeRemaining)}
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

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4">
              {recordedClips.length > 0 && (
                <button
                  onClick={handleRerecord}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Rerecord</span>
                </button>
              )}
              
              {currentStep.isOptional && (
                <button
                  onClick={handleSkipStep}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Skip</span>
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {isLastStep ? (
            <button
              onClick={handleFinish}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <Check className="w-4 h-4" />
              <span>Finish</span>
            </button>
          ) : (
            <button
              onClick={handleNextStep}
              disabled={recordedClips.length === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next Step</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          )}
        </div>
      </div>

      {/* Compiled Video Display */}
      {compiledVideoUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
        >
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Your Compiled Video
              </h3>
              <button
                onClick={() => setCompiledVideoUrl(null)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="mb-4">
              <video
                src={compiledVideoUrl}
                controls
                className="w-full rounded-lg"
                autoPlay
              />
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = compiledVideoUrl
                  link.download = `vlog-${prompt?.title || 'video'}.webm`
                  link.click()
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download Video</span>
              </button>
              
              <button
                onClick={() => {
                  setCompiledVideoUrl(null)
                  navigate('/')
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Compiling Overlay */}
      {isCompiling && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Compiling Your Video
            </h3>
            <p className="text-gray-600">
              Combining {recordedClips.length} clips into one video...
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
