import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Play, Clock, User } from 'lucide-react'
import { mockPrompts } from '../data/mockData'
import { Prompt } from '../types'

export default function PromptPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState<Prompt | null>(null)

  useEffect(() => {
    const foundPrompt = mockPrompts.find(p => p.id === id)
    setPrompt(foundPrompt || null)
  }, [id])

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

  const handleFreeRecord = () => {
    navigate(`/record/${prompt.id}`)
  }

  const handleGuidedRecord = () => {
    navigate(`/guided/${prompt.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-6 bg-white/80 backdrop-blur-lg border-b border-gray-100"
      >
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Video Prompt</h1>
            <p className="text-gray-600 text-sm">Choose how to respond</p>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-8"
        >
          <div className="flex items-start space-x-4 mb-6">
            <img 
              src={prompt.fromUser.avatar} 
              alt={prompt.fromUser.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {prompt.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {prompt.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{prompt.fromUser.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {prompt.template && (
            <div className="bg-primary-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-primary-800 mb-2">
                ✨ Guided Template Available
              </h3>
              <p className="text-primary-700 text-sm mb-3">
                {prompt.template.title} • {prompt.template.estimatedDuration}s
              </p>
              <div className="flex flex-wrap gap-2">
                {prompt.template.steps.slice(0, 3).map((step) => (
                  <span 
                    key={step.id}
                    className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                  >
                    {step.emoji} {step.title}
                  </span>
                ))}
                {prompt.template.steps.length > 3 && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                    +{prompt.template.steps.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Recording Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            How would you like to respond?
          </h3>

          {/* Guided Template Option */}
          {prompt.template && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              onClick={handleGuidedRecord}
              className="w-full card p-6 text-left hover:shadow-xl transition-all duration-300 active:scale-98"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    Use Guided Template
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Step-by-step recording with prompts and timing
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{prompt.template.steps.length} steps</span>
                    <span>•</span>
                    <span>~{prompt.template.estimatedDuration}s</span>
                  </div>
                </div>
              </div>
            </motion.button>
          )}

          {/* Free Record Option */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleFreeRecord}
            className="w-full card p-6 text-left hover:shadow-xl transition-all duration-300 active:scale-98"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">
                  Free Record
                </h4>
                <p className="text-gray-600 text-sm mb-2">
                  Record however you like - no structure required
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Unlimited time</span>
                  <span>•</span>
                  <span>Your style</span>
                </div>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  )
}
