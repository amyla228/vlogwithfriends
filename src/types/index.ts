export interface User {
  id: string
  name: string
  avatar: string
  username: string
}

export interface Prompt {
  id: string
  title: string
  description: string
  fromUser: User
  toUser: User
  createdAt: Date
  expiresAt?: Date
  isCompleted: boolean
  template?: GuidedTemplate
}

export interface GuidedTemplate {
  id: string
  title: string
  steps: TemplateStep[]
  estimatedDuration: number // in seconds
}

export interface TemplateStep {
  id: string
  order: number
  title: string
  description: string
  emoji: string
  duration: number // in seconds
  isOptional: boolean
}

export interface VideoClip {
  id: string
  stepId?: string
  promptId: string
  userId: string
  videoUrl: string
  thumbnailUrl?: string
  duration: number
  caption?: string
  voiceoverUrl?: string
  createdAt: Date
}

export interface VlogResponse {
  id: string
  promptId: string
  userId: string
  clips: VideoClip[]
  isGuided: boolean
  templateId?: string
  totalDuration: number
  createdAt: Date
  sharedAt?: Date
}
