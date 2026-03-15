# ⚡ Nexa Content Studio

> **"Create Viral Content with AI"**

A premium AI-powered SaaS dashboard for generating YouTube Shorts, cartoon videos, thumbnails, and content ideas — automatically.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 📁 Project Structure

```
nexa-content-studio/
├── src/
│   ├── app/
│   │   ├── login/          → Login page
│   │   ├── dashboard/      → Main dashboard
│   │   ├── create/         → Video generator (4 modes)
│   │   ├── library/        → Video library
│   │   ├── thumbnails/     → Thumbnail generator
│   │   ├── channels/       → Channel manager
│   │   └── settings/       → API keys, automation
│   └── components/
│       ├── Sidebar.tsx      → Collapsible sidebar nav
│       ├── Navbar.tsx       → Top bar with notifications
│       ├── DashboardLayout.tsx → Main layout wrapper
│       ├── Companion.tsx    → Floating AI chat assistant
│       └── CommandPalette.tsx → Press "/" for commands
```

---

## ✨ Features

| Feature | Status |
|---|---|
| Login page (futuristic) | ✅ |
| Dark / Light theme toggle | ✅ |
| Collapsible sidebar | ✅ |
| Dashboard with stats & charts | ✅ |
| Video generation (4 modes) | ✅ |
| Video Library with filters | ✅ |
| Thumbnail Generator | ✅ |
| Channel Manager | ✅ |
| Settings + API key inputs | ✅ |
| AI Companion chat widget | ✅ |
| Command Palette (press `/`) | ✅ |
| Notification system | ✅ |
| Micro-interactions & animations | ✅ |
| Automation scheduler (placeholder) | ✅ |
| YouTube auto-upload (placeholder) | 🔜 |
| Trending topic finder (placeholder) | 🔜 |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary font | Syne (headings) + DM Sans (body) |
| Accent 1 | `#6366f1` (Indigo) |
| Accent 2 | `#a855f7` (Purple) |
| Accent 3 | `#06b6d4` (Cyan) |
| Background | `#05050f` (dark) / `#f8f8fc` (light) |
| Cards | Glassmorphism (`backdrop-filter: blur`) |

---

## 🔌 API Integrations (Placeholder)

Connect these in **Settings → API Keys**:

- **OpenAI** — Script & idea generation
- **ElevenLabs** — AI voice synthesis
- **Pexels** — Stock footage & images
- **YouTube** — Upload automation (coming soon)

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `/` | Open command palette |
| `ESC` | Close command palette |
| `↑ ↓` | Navigate commands |
| `Enter` | Execute command |

---

## 🤖 Nexa Companion Commands

Type these in the chat widget:

- `"Go to video generator"` → Navigates to /create
- `"Open video library"` → Navigates to /library
- `"Create cartoon video"` → Opens cartoon mode
- `"How do I generate shorts?"` → Explains the process

---

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **TailwindCSS**
- **Recharts** (area charts)
- **Lucide React** (icons)
- **Custom CSS** (glassmorphism, animations)

---

## 🔧 Customization

### Change accent color
In `src/app/globals.css`, update:
```css
--accent-1: #6366f1; /* primary */
--accent-2: #a855f7; /* secondary */
--accent-3: #06b6d4; /* tertiary */
```

### Add new sidebar item
In `src/components/Sidebar.tsx`, add to `navItems`:
```ts
{ icon: YourIcon, label: 'New Page', path: '/new-page' }
```

---

Built with ❤️ by Nexa Studio
