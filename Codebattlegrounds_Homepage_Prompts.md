# code battelgrounds  — Homepage Frontend Prompts
# All prompts are frontend-only. No backend, no API calls, no socket connections.
# Stack: React 18.3 + Vite 6.0 + SASS (or CSS modules) + React Router DOM v6

---

## HOW TO USE
- Run prompts in order (1 → 9) for a clean build
- Each prompt is self-contained but references the design tokens from Prompt 1
- All data is static/mock — no API calls anywhere
- Final prompt assembles everything into one page

---

---
## PROMPT 1 — Design Tokens & Global Styles
---

```
You are building the design system for code battelgrounds , an AI-powered coding 
practice and assessment platform for students and faculty.

Aesthetic direction: "Terminal Noir Academia" — dark arena meets university editorial.
Deep near-black backgrounds, electric teal for student-side features, warm amber for 
faculty-side features, violet as a collaborative accent for pair programming.
Monospace typography for all code/technical elements. Sharp geometric display font 
for headings. No purple gradients. No Inter. No generic SaaS look.

Create the following CSS/SASS design tokens and global styles.
Frontend only — no backend, no API, no data fetching.

FILE: src/styles/_tokens.scss  (or as a <style> block if single-file)

────────────────────────────────────────
COLOR TOKENS
────────────────────────────────────────
--bg-base:       #080c10   (deepest background)
--bg-surface:    #0d1117   (cards, terminals)
--bg-elevated:   #161b22   (headers, navbar on scroll)
--bg-hover:      rgba(255,255,255,0.03)

--accent-teal:   #00e5cc   (student / solo mode)
--accent-amber:  #f5a623   (faculty / assessment mode)
--accent-violet: #a78bfa   (pair programming / collaborative)
--accent-red:    #ff4444   (danger, warnings)
--accent-green:  #28c840   (success, submitted)

--text-primary:  #e2e8f0
--text-secondary:#9ca3af
--text-muted:    #6b7280
--text-faint:    #4a5568
--text-ghost:    #2d3748

--border-subtle: rgba(255,255,255,0.06)
--border-light:  rgba(255,255,255,0.1)

────────────────────────────────────────
TYPOGRAPHY
────────────────────────────────────────
Import from Google Fonts:
  - "Syne" weights 400, 600, 700, 800  → display headings, logo
  - "JetBrains Mono" weights 300, 400, 500, 600 → all code, labels, badges, nav links
  - "DM Sans" weights 300, 400, 500 → body text, descriptions, buttons

Font scale:
  --font-display-xl: Syne 800, 66px, line-height 1.05
  --font-display-lg: Syne 800, 52px, line-height 1.08
  --font-display-md: Syne 700, 42px, line-height 1.1
  --font-display-sm: Syne 700, 28px, line-height 1.15
  --font-display-xs: Syne 700, 22px, line-height 1.2

  --font-body-lg: DM Sans 400, 17px, line-height 1.7
  --font-body-md: DM Sans 400, 15px, line-height 1.65
  --font-body-sm: DM Sans 400, 14px, line-height 1.6
  --font-body-xs: DM Sans 400, 13px

  --font-mono-md: JetBrains Mono 400, 13px, line-height 1.6
  --font-mono-sm: JetBrains Mono 400, 11px
  --font-mono-xs: JetBrains Mono 400, 10px, letter-spacing 0.1em

────────────────────────────────────────
SPACING & LAYOUT
────────────────────────────────────────
Base unit: 4px
Spacing scale: 4 8 12 16 20 24 32 40 48 64 80 100 120

Section padding: 100px top/bottom, 32px left/right
Max content width: 1200px, centered

Border radius: 
  --radius-sm: 6px
  --radius-md: 10px
  --radius-lg: 14px
  --radius-xl: 20px
  --radius-pill: 999px

────────────────────────────────────────
SHADOWS
────────────────────────────────────────
--shadow-card:     0 4px 24px rgba(0,0,0,0.4)
--shadow-terminal: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,229,204,0.05)
--shadow-teal-lg:  0 12px 40px rgba(0,229,204,0.35)
--shadow-teal-sm:  0 4px 24px rgba(0,229,204,0.2)

────────────────────────────────────────
ANIMATIONS (keyframes)
────────────────────────────────────────
@keyframes fadeUp      → opacity 0→1, translateY 24px→0
@keyframes blink       → opacity 1→0→1 at 1s step-end (cursor)
@keyframes pulse       → opacity 0.6→1, scale 1→1.05
@keyframes gridFloat   → translateY 0→-8px→0 at 8s ease-in-out infinite
@keyframes shimmer     → background-position sweep left to right
@keyframes rotateSlow  → 360deg infinite linear

────────────────────────────────────────
GLOBAL RESETS
────────────────────────────────────────
- box-sizing: border-box on everything
- ::selection: background rgba(0,229,204,0.25)
- Custom scrollbar: 4px width, #1e2d3d thumb, #080c10 track
- Smooth scroll on html
- No body margin/padding
- overflow-x: hidden on body
```

---

---
## PROMPT 2 — Navbar Component
---

```
Build the Navbar component for code battelgrounds  homepage.
Frontend only — no backend, no auth calls, no real login logic.
Stack: React 18.3, CSS modules or inline styles, React Router DOM v6.

Design system reference (from Prompt 1):
  bg-base: #080c10, bg-elevated: #161b22
  accent-teal: #00e5cc, accent-amber: #f5a623
  font: Syne for logo, JetBrains Mono for nav links, DM Sans for CTA

FILE: src/components/layout/Navbar.jsx

────────────────────────────────────────
BEHAVIOR
────────────────────────────────────────
- Fixed top, full width, z-index 100
- Transparent on load
- On scroll past 40px: 
    background becomes rgba(8,12,16,0.95)
    backdropFilter: blur(12px)
    bottom border: 1px solid rgba(0,229,204,0.08)
    transition: all 0.3s ease
- useEffect + window scroll listener for scroll detection
- Active route highlighting via useLocation() from React Router

────────────────────────────────────────
LEFT — Logo
────────────────────────────────────────
- Hexagon icon (⬡ unicode or SVG) in a 36x36 rounded box
  Box: background rgba(0,229,204,0.1), border 1px solid rgba(0,229,204,0.3)
  Icon color: #00e5cc
- "code battelgrounds " in Syne 700 15px, color #e2e8f0
- "Arena" below in JetBrains Mono 9px, color #00e5cc, letter-spacing 0.2em
- Side by side with the icon

────────────────────────────────────────
CENTER — Nav Links
────────────────────────────────────────
Links: ["Practice", "Pair", "Assess", "Replay"]
- Font: JetBrains Mono, 12px, letter-spacing 0.08em
- Default color: #6b7280
- Hover color: #00e5cc
- Transition: color 0.2s
- Hidden on mobile (< 768px)
- These are anchor links to page sections (href="#practice" etc), not routes

────────────────────────────────────────
RIGHT — Role Pills + CTA
────────────────────────────────────────
Two role pills side by side:
  "Student" pill:
    background: rgba(0,229,204,0.08)
    border: 1px solid rgba(0,229,204,0.2)
    color: #00e5cc
    font: JetBrains Mono 10px, letter-spacing 0.1em
    padding: 4px 10px, border-radius 999px
    cursor: pointer

  "Faculty" pill:
    background: rgba(245,166,35,0.08)
    border: 1px solid rgba(245,166,35,0.2)
    color: #f5a623
    (same sizing as Student pill)

CTA Button: "Sign in with Google"
    background: #00e5cc
    color: #080c10
    font: DM Sans 500, 13px
    padding: 8px 16px, border-radius 8px
    border: none, cursor: pointer

────────────────────────────────────────
MOBILE (< 768px)
────────────────────────────────────────
- Hide center nav links
- Hide role pills
- Show hamburger icon (3 lines) on right
- On hamburger click: show full-screen drawer
    background: #0d1117
    All nav links stacked vertically
    Role pills below links
    CTA button at bottom
    Close button top-right
    Slide-in from right (translateX animation)

────────────────────────────────────────
PROPS
────────────────────────────────────────
None. Fully self-contained.
Export as default.
```

---

---
## PROMPT 3 — Hero Section with Live Typing Terminal
---

```
Build the Hero section for code battelgrounds  homepage.
Frontend only — no API calls, no backend, pure React with useState/useEffect.
Stack: React 18.3, inline styles or CSS modules.

This is the most important section of the page. It must be visually unforgettable.
Design direction: dark technical arena. Electric teal. Asymmetric grid layout.
Hero uses a LIVE TYPING TERMINAL on the right that cycles through all 3 platform modes.

FILE: src/sections/Hero.jsx (or inline in HomePage.jsx)

────────────────────────────────────────
LAYOUT
────────────────────────────────────────
Full viewport height (min 100vh)
Two-column grid (desktop): left content 50%, right terminal 50%
Single column (mobile): content stacked above terminal
Centered vertically
Padding: 100px top (navbar clearance), 32px horizontal
Position: relative (for background elements)

────────────────────────────────────────
BACKGROUND ELEMENTS (purely decorative, pointer-events: none)
────────────────────────────────────────
1. Dot/line grid:
   backgroundImage: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
   backgroundSize: 48px 48px
   Fade out at edges via mask-image radial-gradient

2. Teal radial orb (top right): 300x300px, position absolute,
   background: radial-gradient(circle, rgba(0,229,204,0.06) 0%, transparent 70%)
   animation: gridFloat 8s ease-in-out infinite

3. Violet radial orb (bottom left): 200x200px,
   background: radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)
   animation: gridFloat 10s ease-in-out infinite reverse

────────────────────────────────────────
LEFT CONTENT (staggered fade-up animations, 0.1s delay steps)
────────────────────────────────────────

1. Status badge (top, smallest element):
   "● AI-Powered · Real-Time · Fair Assessment"
   Font: JetBrains Mono 11px, color #6b7280
   Dot: 6px circle, #00e5cc, animation: pulse 2s infinite
   Container: border 1px solid rgba(255,255,255,0.06), 
              background rgba(255,255,255,0.02), 
              border-radius 999px, padding 6px 14px
   Animation: fadeUp 0.7s ease, delay 0s

2. H1 headline (3 lines, each line animates separately):
   Line 1: "The Arena"     → Syne 800, 66px, #e2e8f0, delay 0.1s
   Line 2: "Where Code"    → Syne 800, 66px, #e2e8f0, delay 0.2s
   Line 3: "Meets Learning" → Syne 800, 66px
     "Learning" gets gradient text:
       background: linear-gradient(135deg, #00e5cc 0%, #a78bfa 100%)
       -webkit-background-clip: text
       -webkit-text-fill-color: transparent
   Line 3 delay: 0.3s
   All lines: opacity 0, animation fadeUp 0.7s ease forwards

3. Description paragraph:
   "One platform for solo coding practice, pair programming, and instructor-led
   assessments — with an AI coach that guides without spoiling and integrity tools 
   that inform without accusing."
   Font: DM Sans 17px, color #9ca3af, line-height 1.7, max-width 480px
   Animation: fadeUp 0.7s 0.4s ease forwards, opacity 0

4. Audience pills row (two pills side by side, gap 12px):
   "◈ For Students" → teal styling (same as navbar student pill)
   "▣ For Faculty"  → amber styling (same as navbar faculty pill)
   Both: DM Sans 13px, padding 6px 14px, border-radius 999px
   Animation: fadeUp 0.7s 0.45s ease forwards, opacity 0

5. CTA buttons row:
   Primary: "Continue with Google" 
     Google "G" SVG icon inline (white paths, the 4-path Google logo)
     background: #00e5cc, color: #080c10
     DM Sans 600, 15px, padding 13px 24px, border-radius 10px
     box-shadow: 0 4px 24px rgba(0,229,204,0.2)
     Hover: translateY(-2px), box-shadow 0 12px 40px rgba(0,229,204,0.35)
     
   Secondary: "Watch Demo →"
     background: transparent, color: #9ca3af
     border: 1px solid rgba(255,255,255,0.1)
     DM Sans 500, 15px, padding 13px 20px, border-radius 10px
     Hover: background rgba(255,255,255,0.04)
   
   Animation: fadeUp 0.7s 0.5s ease forwards, opacity 0

6. Stats row (4 stats in a horizontal strip):
   Separated by thin vertical lines (border-right)
   Border-top above the whole row
   
   Stats:
     "3"   → Core Modes      → "Practice · Pair · Assess"
     "5+"  → Languages       → "Python · JS · Java · C++ · C"
     "AI"  → Powered Coach   → "Layered hints, zero spoilers"
     "∞"   → Replay Sessions → "Every keystroke, replayed"

   Each stat:
     Value: Syne 700, 28px, #e2e8f0
     Label: JetBrains Mono 10px, #6b7280, letter-spacing 0.1em, uppercase
     Sub:   JetBrains Mono 11px, #4a5568
   
   Hover on stat: value color transitions to #00e5cc
   Animation: fadeUp 0.7s 0.6s ease forwards, opacity 0

────────────────────────────────────────
RIGHT — LIVE TYPING TERMINAL COMPONENT
────────────────────────────────────────
This is a sub-component: TypingTerminal.jsx

Three scenarios (cycle through on repeat):

scenario[0] — solo practice:
  label: "// solo practice"
  accentColor: "#00e5cc"
  lines: [
    "def two_sum(nums, target):",
    "    seen = {}",
    "    for i, n in enumerate(nums):",
    "        diff = target - n",
    "        if diff in seen:",
    "            return [seen[diff], i]",
    "        seen[n] = i",
  ]

scenario[1] — pair programming:
  label: "// pair programming"
  accentColor: "#a78bfa"
  lines: [
    "// Alex is typing...",
    "function mergeIntervals(intervals) {",
    "  intervals.sort((a,b) => a[0]-b[0]);",
    "  const res = [intervals[0]];",
    "  for (let [s,e] of intervals.slice(1)) {",
    "    if (s <= res.at(-1)[1])",
    "      res.at(-1)[1] = Math.max(res.at(-1)[1], e);",
  ]

scenario[2] — assessment mode:
  label: "// assessment mode"
  accentColor: "#f5a623"
  lines: [
    "public class Solution {",
    "  // ⏱ 34:12 remaining",
    "  // 🔒 AI hints disabled",
    "  public int[] findMedian(",
    "    int[] arr1, int[] arr2) {",
    "    // your implementation",
    "    int m = arr1.length;",
  ]

STATE MACHINE (useState + useEffect):
  phase: "typing" | "pause" | "clearing"
  
  "typing" phase:
    - Character by character reveal of current line
    - Delay per character: 28ms + random(0–20ms) for organic feel
    - When line complete: push to displayedLines[], start next line
    - When all lines shown: enter "pause" phase
  
  "pause" phase: 
    - Wait 2200ms, then enter "clearing" phase
  
  "clearing" phase:
    - Wait 400ms, reset all state, advance scenarioIdx, return to "typing"

TERMINAL SHELL UI:
  Container:
    background: #0d1117
    border: 1px solid rgba(255,255,255,0.08)
    border-radius: 12px
    box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,229,204,0.05)
    overflow: hidden
    animation: fadeUp 0.7s 0.3s ease forwards, opacity 0

  Header bar (macOS-style):
    background: #161b22
    border-bottom: 1px solid rgba(255,255,255,0.05)
    padding: 12px 16px
    flex layout: dots left, scenario label center, tab name right
    
    3 colored dots: #ff5f57, #febc2e, #28c840 (12px circles, gap 6px)
    Scenario label: JetBrains Mono 11px, color = current scenario accentColor
    Tab name: JetBrains Mono 10px, color #4a5568, text "code battel_grounds "

  Body:
    padding: 20px 24px
    min-height: 280px
    overflow: hidden
    position: relative

  First line (command prompt):
    "❯ code battelgrounds run --mode [solo|pair|assess]"
    color: #718096, JetBrains Mono 11px
    margin-bottom: 12px

  Code lines:
    Each line: flex row, gap 16px
    Line number: JetBrains Mono 12px, #2d3748, right-aligned, min-width 16px
    Code: JetBrains Mono 13px, line-height 1.6
    
    Syntax highlighting (simple keyword detection):
      Lines starting with comment chars (// or #): color #6b7280, fontStyle italic
      Lines starting with keyword (def, return, for, if, function, public, class, let, const):
        keyword portion → scenario accentColor
        rest of line → #e2e8f0
      Other lines → #e2e8f0

  Blinking cursor (appended to currently typing line):
    2px wide, 1em tall, inline-block
    background: #00e5cc
    animation: blink 1s step-end infinite

  Bottom glow fade:
    position absolute, bottom 0, full width, height 60px
    background: linear-gradient(transparent, rgba(accent, 0.03))

Below terminal: small note line
  "● Live preview · cycling through all 3 modes"
  JetBrains Mono 10px, color #4a5568
  ● in #00e5cc

────────────────────────────────────────
SCROLL INDICATOR (bottom center of hero)
────────────────────────────────────────
Position: absolute, bottom 32px, left 50%, transform translateX(-50%)
"scroll to explore" text: JetBrains Mono 10px, #4a5568, letter-spacing 0.1em
Small animated bar above text
animation: fadeUp 1s 1s ease forwards, opacity 0

────────────────────────────────────────
RESPONSIVE
────────────────────────────────────────
< 1024px: reduce H1 to 52px
< 768px: single column, terminal below content, H1 to 42px, hide stats row
< 480px: H1 to 34px, hide audience pills
```

---

---
## PROMPT 4 — Dual Audience Section (Student / Faculty Split Cards)
---

```
Build the Dual Audience section for code battelgrounds homepage.
Frontend only — no backend, pure static React.
This section explicitly speaks to both students and faculty with two equal cards.

FILE: src/sections/DualAudience.jsx
Section ID: "audience"

────────────────────────────────────────
LAYOUT
────────────────────────────────────────
Padding: 100px top/bottom, 32px left/right
Max width: 1200px, centered
Two cards in a grid: gridTemplateColumns 1fr 1fr, gap 24px
Stack to single column below 768px

────────────────────────────────────────
STUDENT CARD (left)
────────────────────────────────────────
Border: 1px solid rgba(0,229,204,0.12)
Background: rgba(0,229,204,0.02)
Border-radius: 16px
Padding: 40px
Position: relative, overflow: hidden

Top accent line (visual detail):
  position: absolute, top 0, left 0, right 0, height 2px
  background: #00e5cc, opacity 0.6

Content order (top to bottom):
1. Large icon: "◈" — font-size 32px, color #00e5cc, margin-bottom 12px
2. Role label: "FOR STUDENTS"
   JetBrains Mono 10px, letter-spacing 0.2em, color #00e5cc, margin-bottom 10px
3. Heading: "Practice. Collaborate. Grow."
   Syne 700, 26px, color #e2e8f0, margin-bottom 14px
4. Description (2–3 sentences):
   "Solve curated DSA problems solo, pair up with a classmate in a shared editor, 
   or enter a timed assessment. Your AI coach watches your patterns and nudges you 
   forward — never spoiling the answer, always building the skill."
   DM Sans 15px, color #6b7280, line-height 1.7, margin-bottom 24px
5. Feature list (4 items, no bullets):
   "✓ AI hint coach (3-tier)"
   "✓ Pair programming rooms"
   "✓ Personal weakness tracker"
   "✓ Learning history & replay"
   Each: flex row, gap 10px, DM Sans 14px, color #9ca3af, margin-bottom 10px
   "✓" in #00e5cc
6. CTA button: "Start Practicing →"
   background: rgba(0,229,204,0.1)
   color: #00e5cc
   border: 1px solid rgba(0,229,204,0.25)
   DM Sans 600, 14px, padding 10px 20px, border-radius 8px
   Hover: opacity 0.85, cursor pointer

────────────────────────────────────────
FACULTY CARD (right)
────────────────────────────────────────
Identical structure, amber color scheme:
  Border: 1px solid rgba(245,166,35,0.12)
  Background: rgba(245,166,35,0.02)
  Top accent: #f5a623

1. Icon: "▣" — color #f5a623
2. Role label: "FOR FACULTY" — color #f5a623
3. Heading: "Author. Assess. Understand."
4. Description:
   "Create structured assessments with timed rules, assign practice sets, and 
   review student sessions with full replay. Integrity tools show you what happened 
   — without rendering automatic verdicts so you stay in control."
5. Feature list:
   "✓ Assessment builder"
   "✓ Session replay & timeline"
   "✓ Class misconception analytics"
   "✓ Integrity insights (not verdicts)"
   "✓" in #f5a623
6. CTA: "Explore Faculty Tools →" — amber styling

────────────────────────────────────────
SECTION ENTRY ANIMATION
────────────────────────────────────────
Both cards: opacity 0 on mount
Use IntersectionObserver — when section enters viewport:
  Left card: fadeUp 0.6s ease, delay 0s
  Right card: fadeUp 0.6s ease, delay 0.15s
```

---

---
## PROMPT 5 — Three Modes Interactive Showcase
---

```
Build the Three Modes interactive section for code battelgrounds  homepage.
Frontend only — all static data, no API calls.
Stack: React 18.3, useState for active tab.

FILE: src/sections/ModesShowcase.jsx
Section ID: "modes" (for nav anchor linking)

────────────────────────────────────────
LAYOUT
────────────────────────────────────────
Padding: 100px top/bottom, 32px left/right
Background: rgba(255,255,255,0.01) — very subtle surface lift
Border-top: 1px solid rgba(255,255,255,0.04)
Max-width: 1200px centered

Section header (centered text):
  Label: "PLATFORM MODES" — JetBrains Mono 10px, #00e5cc, letter-spacing 0.2em
  H2: "Three modes. One platform."
      Syne 800, 42px, #e2e8f0
  Subtitle: "Every mode is purpose-built. Practice AI helps freely.
             Assessment AI steps back. Instructor tools see everything 
             — without judging."
  DM Sans 16px, #6b7280, line-height 1.7, max-width 560px, centered margin

────────────────────────────────────────
STATIC DATA (define as const array)
────────────────────────────────────────
const MODES = [
  {
    id: "solo",
    icon: "◈",
    accent: "#00e5cc",
    title: "Solo Practice",
    badge: "STUDENT",
    desc: "Solve DSA problems at your own pace. The AI detects when you're stuck 
           before you even ask — and delivers hints in tiers so you learn, not copy.",
    features: [
      "Tiered AI hint system",
      "Test case-level feedback",
      "Personalized learning memory",
      "Progress tracking",
    ],
    codeSnippet: `# AI detected: 4 failed runs on edge case
# Hint tier 1 of 3:
# "What happens when left > right?"`,
  },
  {
    id: "pair",
    icon: "⟡",
    accent: "#a78bfa",
    title: "Pair Programming",
    badge: "COLLABORATIVE",
    desc: "Two engineers, one editor. Real-time presence, contribution tracking, 
           and an AI moderator that compares your approaches and suggests how to merge them.",
    features: [
      "Live shared Monaco editor",
      "Cursor presence + typing signals",
      "AI approach debate mode",
      "Contribution analytics",
    ],
    codeSnippet: `// AI Moderator comparing approaches:
// A: O(n log n) — cleaner, sortable
// B: O(n) — faster, hash-based
// Recommendation: use B in interview`,
  },
  {
    id: "assess",
    icon: "▣",
    accent: "#f5a623",
    title: "Assessment Mode",
    badge: "FACULTY",
    desc: "Faculty create timed, structured assessments. Students code under fair 
           constraints. Every session is transparent — not proctored, but reviewable.",
    features: [
      "Timed locked sessions",
      "Integrity timeline (not verdict)",
      "Full session replay",
      "Instructor analytics",
    ],
    codeSnippet: `// Assessment transparency:
// 2 tab switches logged
// 1 large paste flagged
// → Review session replay`,
  },
]

────────────────────────────────────────
TAB BAR
────────────────────────────────────────
3 tab buttons in a flex row, gap 12px, margin-bottom 32px

Each tab button:
  Display: flex row, align center, gap 8px
  Content: [icon] [title] [badge pill]
  
  Inactive state:
    border: 1px solid rgba(255,255,255,0.08)
    background: transparent
    color: #6b7280
    badge: background rgba(255,255,255,0.05), color #4a5568
  
  Active state (mode.accent color):
    border: 1px solid [accent]
    background: rgba([accent rgb], 0.08)
    color: [accent]
    badge: background rgba([accent rgb], 0.15), color [accent]
  
  Sizing: padding 10px 20px, border-radius 10px
  Font: DM Sans 600, 14px
  Badge font: JetBrains Mono 9px, letter-spacing 0.12em, padding 2px 7px, border-radius 10px
  
  Transition: all 0.2s
  Hover on inactive: opacity 0.85

onClick: setActiveMode(mode.id)

────────────────────────────────────────
ACTIVE MODE DETAIL PANEL
────────────────────────────────────────
Two-column grid: 1fr 1fr, gap 40px
Border: 1px solid rgba([active accent rgb], 0.12)
Background: rgba([active accent rgb], 0.02)
Border-radius: 16px
Padding: 40px
Transition: border-color 0.3s, background 0.3s

LEFT SIDE:
  Large icon: mode.icon, font-size 36px, color active accent, margin-bottom 16px
  H3: mode.title — Syne 800, 32px, #e2e8f0
  Description: DM Sans 15px, #6b7280, line-height 1.7, margin-bottom 24px
  Feature list:
    Each feature: flex row, gap 10px, align center
    "■" prefix in accent color, font-size 10px
    Text: JetBrains Mono 12px, #9ca3af

RIGHT SIDE (code preview card):
  background: #0d1117
  border: 1px solid rgba([active accent rgb], 0.1)
  border-radius: 12px
  overflow: hidden
  
  Header bar:
    background: #161b22
    border-bottom: 1px solid rgba(255,255,255,0.05)
    padding: 10px 16px
    Right-aligned text: "PREVIEW" — JetBrains Mono 11px, #4a5568
  
  Code block:
    <pre> tag
    padding: 24px
    JetBrains Mono 13px, line-height 1.8, color #9ca3af
    white-space: pre-wrap
  
  Bottom glow fade:
    position absolute, bottom 0, full width, 40px height
    gradient: transparent → #0d1117

When active tab changes:
  Detail panel: opacity 0 → 1 animation (0.2s ease)

────────────────────────────────────────
RESPONSIVE
────────────────────────────────────────
< 768px: tabs wrap to single column, detail panel stacks (code below left content)
< 480px: hide code preview panel
```

---

---
## PROMPT 6 — Faculty Features Grid
---

```
Build the Faculty Features section for code battelgrounds  homepage.
Frontend only — static data, pure React.

FILE: src/sections/FacultyFeatures.jsx
Section ID: "faculty"

────────────────────────────────────────
STATIC DATA
────────────────────────────────────────
const FACULTY_FEATURES = [
  {
    icon: "📋",
    title: "Author Assessments",
    desc: "Build timed coding assessments with per-problem rules, point values, 
           and student assignments — all in one place.",
  },
  {
    icon: "📊",
    title: "Class Analytics",
    desc: "See which problems trip students up most, common error patterns, 
           and where the AI was called most across your whole class.",
  },
  {
    icon: "🎬",
    title: "Session Replay",
    desc: "Replay any student session keystroke-by-keystroke. See the full 
           coding journey, not just the final answer.",
  },
  {
    icon: "🔍",
    title: "Integrity Timeline",
    desc: "A factual, neutral log of assessment events — tab switches, paste 
           actions, idle periods. Evidence, never accusation.",
  },
  {
    icon: "📚",
    title: "Practice Sets",
    desc: "Curate weekly problem sets for your class. Assign by topic, 
           difficulty, or concept coverage.",
  },
  {
    icon: "🧠",
    title: "Misconception Maps",
    desc: "Aggregated class-level data shows you exactly which concepts need 
           re-teaching before the next assessment.",
  },
]

────────────────────────────────────────
LAYOUT
────────────────────────────────────────
Padding: 100px top/bottom, 32px left/right
Border-top: 1px solid rgba(255,255,255,0.04)
Max-width: 1200px centered

Section header row:
  Two-column layout: left (text), right (badge card)
  Gap: 32px, align: flex-start
  Margin-bottom: 56px

  LEFT:
    Section label: "BUILT FOR EDUCATORS"
      JetBrains Mono 10px, letter-spacing 0.2em, color #f5a623
    H2: "Faculty tools that respect your judgment."
      Syne 800, 42px, #e2e8f0, line-height 1.1
    Subtitle: " code battelgrounds  isn't a proctoring tool. It's a teaching tool.
               Every feature is designed to give you context and insight — 
               the final call is always yours."
      DM Sans 16px, #6b7280, line-height 1.7

  RIGHT (Faculty badge card):
    Flex column, align center, gap 8px
    Padding: 24px 32px
    Border: 1px solid rgba(245,166,35,0.15)
    Border-radius: 12px
    Background: rgba(245,166,35,0.04)
    Color: #f5a623
    "▣" icon: font-size 28px
    "INSTRUCTOR MODE" text: JetBrains Mono 11px, letter-spacing 0.1em
    Flex-shrink: 0 (don't squish)

Feature cards grid:
  gridTemplateColumns: repeat(3, 1fr)
  Gap: 16px
  Below 1024px: repeat(2, 1fr)
  Below 600px: repeat(1, 1fr)

────────────────────────────────────────
FEATURE CARD
────────────────────────────────────────
Padding: 28px 24px
Border: 1px solid rgba(255,255,255,0.06)
Border-radius: 12px
Background: rgba(255,255,255,0.01)
Transition: transform 0.25s, border-color 0.25s, background 0.25s

Hover:
  transform: translateY(-3px)
  border-color: rgba(0,229,204,0.3)
  (no background change needed)

Content:
  Icon: font-size 28px, margin-bottom 14px, display block
  Title: Syne 700, 17px, #e2e8f0, margin-bottom 8px
  Description: DM Sans 14px, #6b7280, line-height 1.65

────────────────────────────────────────
SCROLL ANIMATION
────────────────────────────────────────
Cards animate in on scroll using IntersectionObserver
Stagger: each card delays by (index * 0.08s)
Each: fadeUp 0.5s ease forwards
Initial state: opacity 0, translateY 16px
```

---

---
## PROMPT 7 — AI Stuck Detection Copilot Section
---

```
Build the AI Copilot feature section for code battelgrounds  homepage.
Frontend only — all mock data, no API calls.
This section shows HOW the AI hint system works using a visual demo card.

FILE: src/sections/AISection.jsx
Section ID: "ai"

────────────────────────────────────────
LAYOUT
────────────────────────────────────────
Padding: 100px top/bottom, 32px left/right
Background: rgba(0,229,204,0.01) — subtle teal tint
Border-top: 1px solid rgba(255,255,255,0.04)
Max-width: 1200px centered

Two-column grid: 1fr 1fr, gap 64px, align center
Stack to single column below 900px (right card goes below)

────────────────────────────────────────
LEFT — Explanation Content
────────────────────────────────────────
Section label: "AI INTEGRATION" — JetBrains Mono 10px, #00e5cc, letter-spacing 0.2em
H2: "An AI coach that teaches, not tells."
  Syne 800, 42px, #e2e8f0
Description:
  "The Stuck Detection Copilot watches your coding patterns — repeated failures,
   idle periods after errors, frantic edit cycles. When it detects you're stuck,
   it intervenes with a calibrated nudge, not a spoiler."
  DM Sans 16px, #6b7280, line-height 1.7, margin-bottom 32px

Hint tier cards (3 stacked, flex column, gap 12px):

  Each tier card:
    Display: flex row, align center, gap 16px
    Padding: 14px 18px, border-radius 10px
    
    Tier 1 (teal):
      Border: 1px solid rgba(0,229,204,0.12)
      Background: rgba(0,229,204,0.03)
      Badge: "T1" — JetBrains Mono 11px 600, color #00e5cc
             background rgba(0,229,204,0.12), padding 4px 10px, border-radius 6px
      Label: "Small nudge" — DM Sans 600, 14px, #e2e8f0
      Desc: "A guiding question about the edge case" — DM Sans 12px, #6b7280

    Tier 2 (violet):
      Border: 1px solid rgba(167,139,250,0.12)
      Background: rgba(167,139,250,0.03)
      Badge: "T2" — color #a78bfa, background rgba(167,139,250,0.12)
      Label: "Concept hint"
      Desc: "The algorithmic pattern you need, explained"

    Tier 3 (amber):
      Border: 1px solid rgba(245,166,35,0.12)
      Background: rgba(245,166,35,0.03)
      Badge: "T3" — color #f5a623, background rgba(245,166,35,0.12)
      Label: "Stronger guidance"
      Desc: "Pseudocode-level breakdown (assessment: locked)"

────────────────────────────────────────
RIGHT — Mock Copilot Demo Card
────────────────────────────────────────
border: 1px solid rgba(0,229,204,0.12)
border-radius: 14px
overflow: hidden
background: #0d1117

  HEADER BAR:
    background: #161b22
    border-bottom: 1px solid rgba(255,255,255,0.05)
    padding: 12px 18px
    Flex row, space-between:
      Left: "◉ STUCK DETECTION COPILOT" — JetBrains Mono 11px, #f5a623
      Right: "live" — JetBrains Mono 10px, #4a5568

  BODY (padding: 24px, flex column, gap 20px):

    DETECTED SIGNALS BOX:
      Padding: 16px, border-radius 8px
      Background: rgba(255,255,255,0.02)
      Border: 1px solid rgba(255,255,255,0.05)
      
      Label row: "Why triggered:" — JetBrains Mono 10px, #4a5568, letter-spacing 0.1em, margin-bottom 10px
      
      3 signal lines (JetBrains Mono 12px, #6b7280, margin-bottom 6px each):
        "● 5 failed runs on test case 3"
        "● 8 min idle after RuntimeError"
        "● Same 3 lines edited 7× in a row"

    HINT BOX:
      Padding: 20px, border-radius 10px
      Background: rgba(0,229,204,0.04)
      Border: 1px solid rgba(0,229,204,0.12)
      
      Tier badge: "Hint · Tier 1" — JetBrains Mono 10px, #00e5cc, letter-spacing 0.1em, margin-bottom 10px
      
      Hint text (italic, DM Sans 14px, #9ca3af, line-height 1.7, margin-bottom 14px):
        "Have you considered what happens when nums contains duplicate values?
         Your current lookup might overwrite an earlier index."
      The word "nums" should be displayed in JetBrains Mono, color #00e5cc
      
      "Reveal Tier 2 →" button:
        JetBrains Mono 11px, color #00e5cc
        background: transparent
        border: 1px solid rgba(0,229,204,0.2)
        padding: 6px 14px, border-radius 6px
        cursor: pointer
        Hover: background rgba(0,229,204,0.06)
```

---

---
## PROMPT 8 — Integrity Timeline Demo Section
---

```
Build the Integrity Timeline demo section for code battelgrounds  homepage.
Frontend only — all hardcoded mock data, no backend.

CRITICAL TONE NOTE: This is NOT a cheating detection feature.
All text must be factual, neutral, and non-accusatory.
  ✅ "Student left the assessment tab"
  ❌ "Student was caught cheating"
  ✅ "Large text paste detected (347 characters)"
  ❌ "Student pasted stolen code"
This is called "Assessment Transparency" or "Integrity Timeline."

FILE: src/sections/IntegritySection.jsx
Section ID: "integrity"

────────────────────────────────────────
LAYOUT
────────────────────────────────────────
Padding: 100px top/bottom, 32px left/right
Border-top: 1px solid rgba(255,255,255,0.04)
Max-width: 1200px centered, text-align center for header

Section header:
  Label: "ASSESSMENT TRANSPARENCY" — JetBrains Mono 10px, #00e5cc, letter-spacing 0.2em
  H2: "Integrity insights, not verdicts." — Syne 800, 42px, centered
  Subtitle: "We don't call it cheat detection. We call it the Integrity Timeline — 
             a factual, neutral log of session events that puts the instructor 
             in control of interpretation."
  DM Sans 16px, #6b7280, centered, max-width 560px, margin auto, margin-bottom 48px

────────────────────────────────────────
DEMO CARD
────────────────────────────────────────
max-width: 760px, margin: 0 auto
border: 1px solid rgba(255,255,255,0.08)
border-radius: 16px
overflow: hidden
background: #0d1117

  CARD HEADER:
    background: #161b22
    border-bottom: 1px solid rgba(255,255,255,0.05)
    padding: 20px 28px
    Flex row, space-between, align center, flex-wrap wrap, gap 12px
    
    Left: "Session: Maya K. — Assessment #3"
      JetBrains Mono 13px, #e2e8f0
    
    Right: 3 count pills in a flex row, gap 8px
      "2 tab switches":  amber pill (background rgba(254,188,46,0.1), color #febc2e, border 1px solid rgba(254,188,46,0.2))
      "1 fullscreen exit": default pill (background rgba(255,255,255,0.05), color #6b7280, border rgba(255,255,255,0.08))
      "1 large paste":   amber pill
      All pills: JetBrains Mono 10px, padding 3px 10px, border-radius 10px

  TIMELINE BODY:
    Padding: 24px 28px
    Position: relative
    
    MOCK EVENTS (array of 5):
    [
      { time: "04:12", color: "#4a5568", label: "Assessment started",     detail: "Fullscreen enabled",          severity: "info" },
      { time: "12:47", color: "#febc2e", label: "Left assessment tab",    detail: "Duration: 8 seconds",         severity: "warning" },
      { time: "18:33", color: "#febc2e", label: "Large paste detected",   detail: "347 characters pasted",       severity: "warning" },
      { time: "31:20", color: "#4a5568", label: "Exited fullscreen",      detail: "Returned after 3 seconds",    severity: "info" },
      { time: "45:01", color: "#28c840", label: "Assessment submitted",   detail: "3 of 3 problems attempted",   severity: "success" },
    ]

    Each event row:
      Display: flex, align flex-start, gap 16px, position relative, padding-bottom 20px
      
      Dot:
        width/height: 10px, border-radius 50%
        background: event.color
        margin-top: 4px, flex-shrink 0, z-index 1
        box-shadow: 0 0 8px [color]40
      
      Connector line (except last event):
        position absolute, left 4px, top 14px, bottom 0, width 1px
        background: rgba(255,255,255,0.06)
      
      Event content (flex row, gap 12px, align center, flex-wrap wrap):
        Time: JetBrains Mono 11px, #4a5568, min-width 40px
        Label: DM Sans 500, 13px, color based on severity:
          info → #9ca3af
          warning → #febc2e
          success → #28c840
        Detail: JetBrains Mono 11px, #4a5568

  CARD FOOTER:
    padding: 16px 28px
    border-top: 1px solid rgba(255,255,255,0.05)
    Flex row, space-between, align center, gap 16px, flex-wrap wrap
    
    Note text:
      "ℹ No automated verdict is generated. Interpretation is the instructor's responsibility."
      JetBrains Mono 10px, #4a5568, line-height 1.5
    
    "View Full Replay →" button:
      JetBrains Mono 11px, color #00e5cc
      background: transparent
      border: 1px solid rgba(0,229,204,0.2)
      padding: 6px 14px, border-radius 6px
      cursor: pointer
      flex-shrink: 0
```

---

---
## PROMPT 9 — Final CTA Section + Footer
---

```
Build the final CTA section and Footer for code battelgrounds  homepage.
Frontend only — no backend, no auth, button clicks do nothing (or navigate to /login).

FILE: src/sections/CTASection.jsx + src/sections/Footer.jsx
(or combine into one file)

────────────────────────────────────────
CTA SECTION
────────────────────────────────────────
Padding: 120px top/bottom, 32px left/right
Border-top: 1px solid rgba(255,255,255,0.04)
Position: relative, overflow: hidden
Text-align: center

Background orb (decorative, pointer-events none):
  Position: absolute, top 50%, left 50%, transform translate(-50%, -50%)
  Width: 600px, height: 400px, border-radius 50%
  background: radial-gradient(circle, rgba(0,229,204,0.05) 0%, transparent 70%)

Content (position relative, z-index 1):

  Section label: "READY TO ENTER THE ARENA?"
    JetBrains Mono 10px, #00e5cc, letter-spacing 0.2em, margin-bottom 20px

  H2 (two lines):
    "Practice smarter. Assess fairly."
    "Learn together."
    Syne 800, 52px, #e2e8f0, line-height 1.1, margin-bottom 20px

  Description:
    "code battelgrounds is free to use. Sign in with Google and start practicing —
     or set up your first assessment in under 5 minutes."
    DM Sans 16px, #6b7280, line-height 1.7, max-width 480px, margin 0 auto 40px

  Button row (flex, justify center, gap 12px):
  
    Primary: "Sign in with Google — It's free"
      Google "G" logo SVG inline (render as 4 colored path segments):
        Path 1 (blue): M22.56 12.25...
        Path 2 (green): M12 23...
        Path 3 (yellow): M5.84 14.09...
        Path 4 (red): M12 5.38...
      All paths fill="currentColor" (white because button bg is teal)
      background: #00e5cc, color: #080c10
      DM Sans 600, 15px, padding 14px 28px, border-radius 10px
      box-shadow: 0 4px 24px rgba(0,229,204,0.2)
      Hover: translateY(-2px), box-shadow 0 12px 40px rgba(0,229,204,0.35)
      SVG: 18x18, marginRight 8px
      
    Secondary: "I'm an Instructor →"
      background: transparent, color: #9ca3af
      border: 1px solid rgba(255,255,255,0.1)
      DM Sans 500, 15px, padding 14px 24px, border-radius 10px
      Hover: background rgba(255,255,255,0.04), border-color rgba(255,255,255,0.2)

  Below buttons (small reassurance row, margin-top 24px):
    Three small items in a flex row, gap 24px, justify center:
      "✓ Free to start"
      "✓ No credit card"
      "✓ Google login in 1 click"
    Each: DM Sans 13px, #4a5568, flex align center gap 6px
    "✓" in #00e5cc

────────────────────────────────────────
FOOTER
────────────────────────────────────────
Border-top: 1px solid rgba(255,255,255,0.04)
Padding: 32px
Max-width: 1200px centered
Flex row, space-between, align center, flex-wrap wrap, gap 16px

LEFT — Logo lockup:
  "⬡" icon in #00e5cc, font-size 18px
  "code battelgrounds " text: Syne 700, 14px, #4a5568
  Flex row, align center, gap 8px

CENTER — Page links (flex row, gap 24px):
  ["Practice", "Pair", "Assess", "Replay", "Profile"]
  JetBrains Mono 11px, #4a5568, letter-spacing 0.06em
  Hover: #6b7280
  Cursor: pointer

RIGHT — Tech credit:
  "Built with Gemini AI · Supabase · Socket.IO · Monaco Editor"
  JetBrains Mono 10px, #2d3748, letter-spacing 0.04em

Below 768px: stack all three vertically, center aligned
```

---

---
## PROMPT 10 — Page Assembly (HomePage.jsx)
---

```
Assemble the complete code battelgrounds homepage from all section components.
Frontend only. No backend. No API calls. No data fetching.

FILE: src/pages/Home/HomePage.jsx

Import and render these sections in order:
  1. <Navbar />               from src/components/layout/Navbar.jsx
  2. <Hero />                 from src/sections/Hero.jsx
  3. <DualAudience />         from src/sections/DualAudience.jsx
  4. <ModesShowcase />        from src/sections/ModesShowcase.jsx
  5. <FacultyFeatures />      from src/sections/FacultyFeatures.jsx
  6. <AISection />            from src/sections/AISection.jsx
  7. <IntegritySection />     from src/sections/IntegritySection.jsx
  8. <CTASection />           from src/sections/CTASection.jsx
  9. <Footer />               from src/sections/Footer.jsx

Root wrapper:
  background: #080c10
  min-height: 100vh
  color: #e2e8f0
  font-family: 'DM Sans', sans-serif
  overflow-x: hidden

Import global styles/tokens at the top.

Google Fonts import (in index.html <head> or via @import in global CSS):
  https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800
  &family=JetBrains+Mono:wght@300;400;500;600
  &family=DM+Sans:wght@300;400;500
  &display=swap

No props needed on any section — all are self-contained.
No routing within the page — all CTAs link to /login (React Router <Link>).

Add a scroll-to-top behavior on mount:
  useEffect(() => { window.scrollTo(0, 0); }, []);
```

---

---
## QUICK REFERENCE — File Structure After All Prompts

src/
  styles/
    _tokens.scss          ← Prompt 1
  components/
    layout/
      Navbar.jsx          ← Prompt 2
  sections/
    Hero.jsx              ← Prompt 3 (includes TypingTerminal sub-component)
    DualAudience.jsx      ← Prompt 4
    ModesShowcase.jsx     ← Prompt 5
    FacultyFeatures.jsx   ← Prompt 6
    AISection.jsx         ← Prompt 7
    IntegritySection.jsx  ← Prompt 8
    CTASection.jsx        ← Prompt 9
    Footer.jsx            ← Prompt 9
  pages/
    Home/
      HomePage.jsx        ← Prompt 10 (assembly)

---
## COLOR QUICK REFERENCE

Role          Accent     RGB
──────────────────────────────────────
Student       #00e5cc    0,229,204
Faculty       #f5a623    245,166,35
Pair/Collab   #a78bfa    167,139,250
Success       #28c840
Warning       #febc2e
Danger        #ff4444
──────────────────────────────────────
bg-base       #080c10
bg-surface    #0d1117
bg-elevated   #161b22
text-primary  #e2e8f0
text-muted    #6b7280
