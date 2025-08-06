# VlogWithFriends 🎥

A mobile web app that lowers the barrier to daily vlogging by making it social, simple, and intentional.

## ✨ Core Concept

Users receive playful, low-stakes **video prompts** from friends — e.g.:
- "Justin wants to see your morning routine"
- "Amy wants to see your day at work" 
- "Maya wants to see your gym session"

In response, users can either:
- **Free Record**: Make a casual vlog however they like
- **Use a Guided Template**: A lightweight, step-by-step recording experience tailored to the prompt

## 🎯 Key Features

### Guided Templates
- **Step-by-step recording** with prompts and timing
- **Progress tracking** with visual indicators
- **Optional steps** that can be skipped
- **Rerecord functionality** for each step
- **Automatic timing** for consistent video lengths

### Free Recording
- **Unlimited recording time**
- **Pause/resume functionality**
- **Caption support** for context
- **Preview before saving**

### Social Features
- **Friend-based prompts** system
- **User profiles** with stats
- **Video sharing** and responses
- **Notification system**

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vlogwithfriends
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Mobile-First Design

The app is designed specifically for mobile devices with:
- **Touch-friendly interfaces**
- **Responsive design**
- **Mobile-optimized navigation**
- **Gesture support**
- **PWA-ready** for app-like experience

## 🎨 Design System

### Colors
- **Primary**: Purple gradient (`#ec4df5` to `#d926e8`)
- **Secondary**: Blue gradient (`#0ea5e9` to `#0284c7`)
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Animations**: Framer Motion for smooth transitions

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
│   ├── HomePage.tsx    # Main dashboard
│   ├── PromptPage.tsx  # Prompt details
│   ├── RecordingPage.tsx # Free recording
│   ├── GuidedTemplatePage.tsx # Step-by-step recording
│   └── ProfilePage.tsx # User profile
├── types/              # TypeScript type definitions
├── data/               # Mock data and templates
├── App.tsx             # Main app component
└── main.tsx           # Entry point
```

## 🎬 Example Guided Template

For "Justin wants to see your morning routine":

1. **"Show us what you look like when you wake up 😴"** (10s)
2. **"What's for breakfast? 🍳"** (15s)
3. **"OOTD — let's see the fit! 👗"** (12s)
4. **"Say one thing you're looking forward to today 💬"** (8s)

Each step appears one at a time with:
- **Visual prompts** with emojis
- **Countdown timer**
- **Progress indicator**
- **Skip option** (for optional steps)

## 🔮 Future Features

- [ ] **Real video recording** with MediaRecorder API
- [ ] **Video playback** and editing
- [ ] **Voiceover recording**
- [ ] **Text captions** overlay
- [ ] **Social sharing** to other platforms
- [ ] **Push notifications**
- [ ] **Offline support**
- [ ] **User authentication**
- [ ] **Backend integration**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design inspiration**: Modern mobile app patterns
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
