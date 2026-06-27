# Streakly

A full-stack habit tracking app built with the MERN stack. Track your daily habits, maintain streaks, log notes, and visualize your progress over time.

**Live Demo:** _Coming soon_

---

## Features

- **Auth** — Register and login with JWT-based authentication
- **Habit Management** — Create, edit, and delete habits with a title and description
- **Daily Tracking** — Mark habits as complete or uncomplete each day
- **Streak Calculation** — Automatic streak tracking based on consecutive completions
- **Notes** — Add and delete notes on any habit to log context or reflections
- **Analytics** — Visual charts powered by Recharts showing completion trends
- **Search & Sort** — Filter habits by name and sort by completed or pending first
- **Dark Mode** — Full dark mode support

---

## Tech Stack

**Frontend**
- React.js
- Tailwind CSS
- Recharts
- Axios
- Lucide React

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

---

## Getting Started

### Prerequisites
- Node.js
- MongoDB (local or Atlas)

### Installation

1. Clone the repo
   ```bash
   git clone https://github.com/rashed-hammad/streakly.git
   cd streakly
   ```

2. Install backend dependencies
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd ../client
   npm install
   ```

4. Create a `.env` file in the `server` directory
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

5. Run the backend
   ```bash
   cd server
   npm run dev
   ```

6. Run the frontend
   ```bash
   cd client
   npm run dev
   ```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive a token |
| GET | `/api/habits` | Get all habits for the user |
| POST | `/api/habits` | Create a new habit |
| PUT | `/api/habits/:id` | Edit a habit |
| DELETE | `/api/habits/:id` | Delete a habit |
| PATCH | `/api/habits/:id/toggle` | Toggle completion for today |
| POST | `/api/habits/:id/notes` | Add a note to a habit |
| DELETE | `/api/habits/:id/notes/:noteId` | Delete a note |

---

## Author

**Rashed Hammad**
- GitHub: [@rashed-hammad](https://github.com/rashed-hammad)
