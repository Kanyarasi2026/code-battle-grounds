# Code Battlegrounds

A real-time collaborative code editor where developers battle it out, practice for interviews, and write code together.

Built for **HackCU12** by **Sneha Nagaraju**, **Meghasrivardhan Pulakhandam**, and **Gunabhiram Aruru**.

---

## Features

- **Real-time collaborative editing** -- multiple users in the same room see each other's code changes live via Socket.IO
- **Multi-language code execution** -- run code in Python, JavaScript, C++, Java, and more through the Judge0 API
- **Custom stdin support** -- provide input to your programs before running them
- **AI-powered hints** -- tiered hints via Gemini API so you get nudges rather than answers
- **Mock interview mode** -- voice-based interview practice with ElevenLabs TTS/STT
- **Timed coding challenges** -- structured problem-solving sessions with countdowns
- **Role-based access** -- separate flows for students/professionals and faculty/academic users
- **Google OAuth authentication** -- sign in or sign up with your Google account via Supabase
- **Assessment creation** -- faculty can create and manage coding assessments
- **Live execution output** -- see stdout, stderr, and exit codes right in the editor
- **Room management** -- create or join rooms with unique IDs for pair/group coding sessions

---

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Monaco Editor (VS Code's editor in the browser)
- Socket.IO client
- Framer Motion + GSAP for animations
- SCSS with BEM methodology
- Supabase JS client

### Backend
- Node.js + Express (TypeScript)
- Socket.IO
- Supabase (PostgreSQL + Auth)
- Judge0 API for code execution
- Gemini API for AI hints
- ElevenLabs API for voice features
- Winston for structured logging
- Joi for request validation
- rate-limiter-flexible for rate limiting

### Testing
- Vitest + Testing Library (frontend)
- Vitest (backend)

---

## Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Judge0](https://judge0.com) instance (self-hosted or RapidAPI)
- A [Gemini API](https://aistudio.google.com) key
- A [ElevenLabs](https://elevenlabs.io) API key (for mock interview voice features)

---

### 1. Clone the repo

```bash
git clone https://github.com/Kanyarasi2026/code-battle-grounds.git
cd code-battle-grounds
```

---

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

---

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

---

### 4. Supabase setup

In your Supabase project:

1. Enable Google as an OAuth provider under **Authentication > Providers**.
2. Add `http://localhost:5173` to your allowed redirect URLs.
3. Run any database migrations found in the `backend/` directory if present.

---

## Testing

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

## Project Structure

```
code-battle-grounds/
  frontend/          React + Vite app
    src/
      components/    Reusable UI components and effects
      context/       Auth and socket context providers
      pages/         Route-level page components
      sections/      Large page sections (Hero, Features, etc.)
      services/      API and socket service layer
      styles/        Global SCSS variables and resets
  backend/           Express + Socket.IO server
    src/
      routes/        REST API routes
      services/      Judge0, Supabase, and room logic
      middleware/    Auth and rate limiting
      utils/         Logger and helpers
```

---
