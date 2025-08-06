import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Pause, RotateCcw, SkipForward, Check } from 'lucide-react'
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

  useEffect(() => {
    const foundPrompt = mockPrompts.find(p => p.id === promptId)
    setPrompt(foundPrompt || null)
  }, [promptId])

  useEffect(() => {
    if (prompt?.template) {
      const currentStep = prompt.template.steps[currentStepIndex]
      setTimeRemaining(currentStep?.duration || 0)
    }
  }, [currentStepIndex, prompt])

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
  }, [isRecording, isPaused, timeRemaining])

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

  const currentStep = prompt.template.steps[currentStepIndex]
  const progress = ((currentStepIndex + 1) / prompt.template.steps.length) * 100
  const isLastStep = currentStepIndex === prompt.template.steps.length - 1

  const handleStartRecording = () => {
    setIsRecording(true)
    setIsPaused(false)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
    // Simulate recording a clip
    const newClip: VideoClip = {
      id: `clip-${Date.now()}`,
      stepId: currentStep.id,
      promptId: prompt.id,
      userId: 'current-user',
      videoUrl: 'mock-video-url',
      duration: currentStep.duration - timeRemaining,
      createdAt: new Date()
    }
    setRecordedClips([...recordedClips, newClip])
  }

  const handlePauseRecording = () => {
    setIsPaused(!isPaused)
  }

  const handleRerecord = () => {
    setTimeRemaining(currentStep.duration)
    setIsRecording(false)
    setIsPaused(false)
    // Remove the last recorded clip
    setRecordedClips(recordedClips.slice(0, -1))
  }

  const handleNextStep = () => {
    if (currentStepIndex < prompt.template.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
      setTimeRemaining(prompt.template.steps[currentStepIndex + 1].duration)
    }
  }

  const handleSkipStep = () => {
    if (currentStepIndex < prompt.template.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handleFinish = () => {
    // Navigate to completion page or save
    navigate('/')
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
              {prompt.template.title}
            </h1>
            <p className="text-gray-600 text-sm">
              Step {currentStepIndex + 1} of {prompt.template.steps.length}
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

            {/* Timer */}
            <div className="mb-8">
              <div className="text-6xl font-bold text-gray-800 mb-2">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-gray-500">
                {isRecording ? (isPaused ? 'Paused' : 'Recording...') : 'Ready to record'}
              </div>
            </div>

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
    </div>
  )
}
