# ⚔️ Code Battlegrounds

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

> A real-time collaborative code editor where developers battle it out, practice for interviews, and write code together

> Built for **HackCU12** by **Sneha Nagaraju**, **Meghasrivardhan Pulakhandam**, and **Gunabhiram Aruru**

[🌐 Live Demo](https://code-battle-grounds.vercel.app) • [💻 Quick Start](#-getting-started) • [📚 Documentation](#-project-structure) • [🚀 Deploy](#-deployment)

---

## ✨ Try it Live!

🌐 **https://code-battle-grounds.vercel.app/**

### Features You Can Explore

- ⚔️ **Real-time Collaborative Coding** — Write code together with live cursor presence via Socket.IO
- 🏫 **Classrooms** — Faculty create sessions, students join with a room code
- 📝 **Assessment Mode** — Timed coding assessments with integrity tracking
- 🧠 **AI-Powered Hints** — Gemini-driven tiered hints that nudge, not spoil
- 🎙️ **Mock Interviews** — Voice-based interview practice with ElevenLabs TTS
- 🗣️ **Voice & Text Chatbot** — Conversational AI assistant powered by ElevenLabs for natural speech interaction
- 🏋️ **Algorithm Challenges** — Curated DSA problem sets (Blind 75, NeetCode, etc.)
- 🔐 **Secure Auth** — Google OAuth via Supabase
- 📱 **Fully Responsive** — Works seamlessly on desktop, tablet, and mobile
- 🪄 **Antigravity Effects** — Fluid UI animations powered by the Antigravity library, bringing the interface to life

---

## 🎯 Features

| Feature                         | Description                                                                                                                                                            |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔄 **Real-time Collaboration**  | Multiple users edit the same file live — code changes sync instantly via Socket.IO                                                                                     |
| 🏫 **Classrooms**               | Faculty create rooms, share codes with students — everyone sees the same editor in real-time                                                                           |
| 📝 **Assessment Mode**          | Faculty create timed assessments; students take them with transparent integrity tracking                                                                               |
| 🛡️ **Integrity Insights**       | Factual session timeline — tab switches, copy/paste events, neutral activity log for faculty review                                                                    |
| 💡 **AI Hints**                 | Tiered hints via Gemini API + ElevenLabs TTS read-aloud — nudges, not answers                                                                                          |
| 🗣️ **Voice & Text Chatbot**     | Full-featured conversational chatbot with both voice and text input/output — powered by ElevenLabs, one of the best speech-to-text and text-to-speech models available |
| 🎙️ **Mock Interviews**          | Voice-based interview simulation with AI-powered speech                                                                                                                |
| 🏋️ **Algorithm Challenges**     | Curated problem sets — Blind 75, NeetCode 150, topic-based collections                                                                                                 |
| 🪄 **Antigravity Effects**      | Smooth, physics-inspired UI animations via Antigravity — dramatically improved user experience and visual polish                                                       |
| ⚡ **Multi-Language Execution** | Run Python, JavaScript, C++, Java, and C                                                                                                                               |
| 🎚️ **Custom stdin**             | Provide input to your programs before execution                                                                                                                        |
| 👥 **Role-Based Access**        | Separate flows for students vs. faculty, professionals vs. academic users                                                                                              |
| 📊 **Progress Tracking**        | Track solved problems, streaks, and challenge completion                                                                                                               |
| 🌙 **Dark Mode**                | Sleek dark grayscale theme with glassmorphism UI                                                                                                                       |

---

## 🏗️ Architecture

```
┌─────────────────────────────┐
│      User Browser           │
│  (React 19 + TypeScript)    │
│  Monaco Editor · GSAP · FM  │
└──────────┬──────────────────┘
           │ HTTP/REST + WebSocket
           ▼
┌─────────────────────────────────┐     ┌─────────────────────────────┐
│   Backend API                   │────▶│   Supabase                  │
│  (Node.js + Express + TS)       │◀────│  PostgreSQL + Auth + OAuth  │
│  - Socket.IO (real-time sync)   │     └─────────────────────────────┘
│  - Room Manager (in-memory)     │
│  - Rate Limiting + Validation   │     ┌─────────────────────────────┐
│                                 │────▶│   Judge0 API                │
└─────────────────────────────────┘     │  (Code Execution Engine)    │
                                        └─────────────────────────────┘
                                        ┌─────────────────────────────┐
                                   ────▶│   Gemini API (AI Hints)     │
                                        │   ElevenLabs (Voice TTS)    │
                                        └─────────────────────────────┘
```

**User Flow:**

1. User visits Code Battlegrounds and authenticates with Google OAuth
2. Selects role — Academic (Student/Faculty) or Professional
3. Chooses a feature — Classrooms, Assessments, Challenges, Interviews, Practice Sets
4. Faculty creates a classroom → shares the room code → students join
5. Code changes sync in real-time across all connected clients
6. Execute code against Judge0, get AI hints from Gemini, hear hints read aloud

---

## 📊 Core Pages & Features

| Page                  | Route                    | Description                                             |
| --------------------- | ------------------------ | ------------------------------------------------------- |
| Landing               | `/login`                 | Animated landing page with Google OAuth                 |
| Role Selection        | `/role`                  | Choose Academic or Professional pathway                 |
| Academic Features     | `/features/academic`     | Classrooms, Assessments, Integrity (faculty)            |
| Professional Features | `/features/professional` | Challenges, Interviews, Pair Programming, Practice Sets |
| Classrooms            | `/classrooms`            | Faculty creates rooms, students join with code          |
| Code Editor           | `/editor/:roomId`        | Monaco editor with real-time sync, execution, AI hints  |
| Assessment Mode       | `/assess`                | Faculty creates / student takes timed assessments       |
| Algorithm Challenges  | `/practice`              | DSA problems by topic and difficulty                    |
| Curated Practice Sets | `/sets`                  | Blind 75, NeetCode 150, and more                        |
| Mock Interviews       | `/interview`             | Voice-based interview simulation                        |
| Progress Tracking     | `/progress`              | Stats, streaks, solved problems                         |
| Integrity Timeline    | `/integrity`             | Session activity log for faculty                        |

---

## 🔧 Tech Stack

| Category                 | Technology                                                                 |
| ------------------------ | -------------------------------------------------------------------------- |
| **Frontend**             | React 19, TypeScript, Vite 5, SCSS (BEM)                                   |
| **Editor**               | Monaco Editor (VS Code engine in browser)                                  |
| **Real-time**            | Socket.IO (WebSocket transport)                                            |
| **Animations**           | Framer Motion, GSAP, Antigravity                                           |
| **Auth**                 | Supabase (Google OAuth)                                                    |
| **Styling**              | SCSS, CSS Variables, Glassmorphism dark theme                              |
| **State**                | React Context + Hooks                                                      |
| **Backend**              | Node.js, Express, TypeScript                                               |
| **Database**             | Supabase (PostgreSQL)                                                      |
| **Code Execution**       | Judge0 API                                                                 |
| **AI Hints**             | Gemini API (gemini-3-flash)                                                |
| **Voice & Text Chatbot** | ElevenLabs (industry-leading STT + TTS) + Browser SpeechSynthesis fallback |
| **Antigravity**          | Antigravity — physics-based animation library for fluid UI interactions    |
| **Validation**           | Joi                                                                        |
| **Rate Limiting**        | rate-limiter-flexible                                                      |
| **Logging**              | Winston                                                                    |
| **Testing**              | Vitest + Testing Library                                                   |
| **Deployment**           | Vercel (frontend), Docker (backend)                                        |

---

## 📈 Performance Metrics

| Metric                   | Value             |
| ------------------------ | ----------------- |
| Page Load Time           | < 2 seconds       |
| First Contentful Paint   | < 1.2 seconds     |
| Lighthouse Score         | 90+ (Performance) |
| WebSocket Latency        | < 50ms (local)    |
| Code Execution Roundtrip | < 3 seconds       |
| Bundle Size              | ~150KB (gzipped)  |
| Max Clients per Room     | 50                |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and **npm 9+**
- A [Supabase](https://supabase.com) project
- A [Judge0](https://judge0.com) instance (self-hosted or RapidAPI)
- A [Gemini API](https://aistudio.google.com) key
- _(Optional)_ An [ElevenLabs](https://elevenlabs.io) API key for voice features

### 1. Clone the repo

```bash
git clone https://github.com/Kanyarasi2026/code-battle-grounds.git
cd code-battle-grounds
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=3001
CORS_ORIGINS=http://localhost:5173

SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

JUDGE0_URL=your_judge0_base_url
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

VITE_SOCKET_URL=http://localhost:3001

VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Supabase setup

In your Supabase project:

1. Enable **Google** as an OAuth provider under **Authentication > Providers**.
2. Add `http://localhost:5173` to your allowed redirect URLs.
3. Run any database migrations found in `backend/migrations/`.

---

## 🧪 Testing

### Frontend tests

```bash
cd frontend
npm test
```

For coverage:

```bash
npm run test:coverage
```

### Backend tests

```bash
cd backend
npm test
```

For coverage:

```bash
npm run test:coverage
```

---

## 📚 Project Structure

```
code-battle-grounds/
├── frontend/                  React + Vite app
│   ├── src/
│   │   ├── components/        Reusable UI (Button, Card, Input, Avatar, etc.)
│   │   │   ├── ai/            AI hint components
│   │   │   ├── editor/        Monaco editor integration
│   │   │   ├── effects/       ParticleField, visual effects
│   │   │   ├── integrity/     Integrity tracking components
│   │   │   ├── layout/        AuthLayout, navigation
│   │   │   ├── output/        Code execution output display
│   │   │   └── ui/            Button, Card, Input, Avatar, Kbd
│   │   ├── context/           AuthContext, RoomContext, NavigationStack
│   │   ├── pages/             Route-level page components
│   │   │   ├── classrooms/    Faculty create / student join classrooms
│   │   │   ├── assessment/    Student & faculty assessment views
│   │   │   ├── challenges/    Algorithm challenge browser & solver
│   │   │   ├── code-editor/   Main collaborative editor page
│   │   │   ├── curated-practice/  Blind 75, NeetCode, practice sets
│   │   │   ├── features/      Mock interview, pair programming, etc.
│   │   │   └── landing/       Landing page with OAuth
│   │   ├── sections/          Hero, Features, CTA sections
│   │   ├── services/          API service layer
│   │   ├── socket/            Socket.IO client + actions
│   │   ├── styles/            Global SCSS variables
│   │   └── types/             TypeScript type definitions
│   └── public/                Static assets
│
├── backend/                   Express + Socket.IO server
│   ├── src/
│   │   ├── controllers/       Route handlers
│   │   ├── middleware/        Auth, validation, rate limiting, error handling
│   │   ├── routes/            REST API routes
│   │   ├── services/          Business logic (profiles, etc.)
│   │   ├── utils/             RoomManager, Logger, RoleManager
│   │   └── types/             TypeScript type definitions
│   └── migrations/            SQL migration files
│
└── README.md
```

---

## 🌐 Deployment

### Currently Deployed on Vercel ✅

- 🌐 **Live URL:** [https://code-battle-grounds.vercel.app](https://code-battle-grounds.vercel.app)
- 🔄 Auto-deploys on push to `main` branch
- ⚡ Global CDN for optimal performance
- 📊 Built-in analytics and monitoring

### Backend

The backend can be deployed via **Docker** using the included `Dockerfile`, or on platforms like **Railway**, **Render**, or **Fly.io**.

---

## 🔗 API Integration

The frontend communicates with the backend for:

- **Real-time collaboration** — Socket.IO WebSocket events (code sync, presence)
- **Code execution** — REST endpoint → Judge0 API
- **Room management** — Create/join/validate rooms
- **Authentication** — Supabase OAuth + JWT tokens
- **AI hints** — Gemini API via frontend (with ElevenLabs TTS or browser fallback)
- **Assessments** — CRUD operations for faculty assessment management

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how you can help:

1. **Fork** the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a **Pull Request**

---

## 👥 Authors

| Name                            | Links                                                                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sneha Nagaraju**              | [Portfolio](https://www.snehaa.me) · [LinkedIn](https://www.linkedin.com/in/snehan-raju/) · [GitHub](https://github.com/snna2069)                       |
| **Meghasrivardhan Pulakhandam** | [Portfolio](https://www.meghan31.me) · [LinkedIn](https://linkedin.com/in/meghan31) · [GitHub](https://github.com/Meghan31)                             |
| **Gunabhiram Aruru**            | [Portfolio](https://aruru-gunabhiram.netlify.app) · [LinkedIn](https://www.linkedin.com/in/gunabhiram-aruru/) · [GitHub](https://github.com/gunabhiram) |

---

Made for **HackCU12**

⭐ If you find Code Battlegrounds useful, give it a star!

[🌐 Try Live Demo](https://code-battle-grounds.vercel.app)
