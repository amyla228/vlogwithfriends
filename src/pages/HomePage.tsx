import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Camera, User, Bell, Heart } from 'lucide-react'
import { mockPrompts } from '../data/mockData'
import { Prompt } from '../types'

export default function HomePage() {
  const [prompts] = useState<Prompt[]>(mockPrompts)
  const navigate = useNavigate()

  const handlePromptClick = (prompt: Prompt) => {
    navigate(`/prompt/${prompt.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-8 bg-white/80 backdrop-blur-lg border-b border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              VlogWithFriends
            </h1>
            <p className="text-gray-600 text-sm">Your daily video prompts</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="px-6 py-8">
        {prompts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No prompts yet!</h3>
            <p className="text-gray-600">Your friends will send you video prompts here.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Prompts ({prompts.length})
            </h2>
            {prompts.map((prompt, index) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handlePromptClick(prompt)}
                className="card p-6 cursor-pointer hover:shadow-xl transition-all duration-300 active:scale-98"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center relative">
                    {prompt.fromUser.avatar ? (
                      <img 
                        src={prompt.fromUser.avatar} 
                        alt={prompt.fromUser.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Hide the image and show fallback
                          e.currentTarget.style.display = 'none'
                          const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback')
                          if (fallback) {
                            fallback.classList.remove('hidden')
                          }
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center text-lg font-semibold text-primary-600 avatar-fallback ${prompt.fromUser.avatar ? 'hidden' : ''}`}>
                      {prompt.fromUser.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {prompt.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {prompt.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {prompt.fromUser.name}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {new Date(prompt.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {prompt.template && (
                          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                            Guided
                          </span>
                        )}
                        <Camera className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
