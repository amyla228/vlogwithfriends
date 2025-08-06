import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Settings, Bell, Heart, Camera, Share2 } from 'lucide-react'
import { mockUsers } from '../data/mockData'

export default function ProfilePage() {
  const navigate = useNavigate()
  const currentUser = mockUsers[1] // Amy as current user for demo

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
            <h1 className="text-lg font-semibold text-gray-800">Profile</h1>
            <p className="text-gray-600 text-sm">Your account settings</p>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </motion.header>

      {/* Content */}
      <div className="px-6 py-8">
        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-8 text-center"
        >
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {currentUser.name}
          </h2>
          <p className="text-gray-600 mb-4">@{currentUser.username}</p>
          
          {/* Stats */}
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">12</div>
              <div className="text-sm text-gray-500">Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">8</div>
              <div className="text-sm text-gray-500">Friends</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">24</div>
              <div className="text-sm text-gray-500">Days</div>
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button className="w-full card p-4 text-left hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">My Videos</h3>
                  <p className="text-gray-600 text-sm">View your recorded responses</p>
                </div>
              </div>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button className="w-full card p-4 text-left hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Liked Videos</h3>
                  <p className="text-gray-600 text-sm">Videos you've liked from friends</p>
                </div>
              </div>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button className="w-full card p-4 text-left hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Invite Friends</h3>
                  <p className="text-gray-600 text-sm">Share the app with friends</p>
                </div>
              </div>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button className="w-full card p-4 text-left hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  <p className="text-gray-600 text-sm">Manage your notification preferences</p>
                </div>
              </div>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button className="w-full card p-4 text-left hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Settings</h3>
                  <p className="text-gray-600 text-sm">App preferences and account settings</p>
                </div>
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
