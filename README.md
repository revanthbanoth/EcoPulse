# 🌿 EcoPulse | GreenQuest
### Gamified Environmental Action & Learning Platform

EcoPulse is a professional-grade MERN stack application designed to bridge the gap between classroom learning and real-world ecological action. It transforms environmental responsibility into a gamified experience, encouraging students to build sustainable habits while providing teachers with powerful tools to manage and track impact.

---

## ✨ Key Features

### 🎓 For Students (Eco-Warriors)
- **Quest Dashboard**: Discover and start environmental challenges categorized by Waste, Energy, Water, and Biodiversity.
- **Dynamic Gamification**: Earn points, build daily streaks, and increase your "Eco-Warrior" level with every approved action.
- **Global Leaderboard**: Compete with classmates and see who is making the most significant impact in real-time.
- **Proof of Action**: Submit reflections and evidence (links/photos) for classroom quests.
- **Personal Impact Stats**: Track your journey from a "Sprout" to a "Guardian of the Earth."

### 👩‍🏫 For Teachers (Impact Managers)
- **Quest Designer**: Create custom ecological tasks with specific point values, difficulty levels, and deadlines.
- **Submission Review Engine**: A dedicated interface to review student proofs, provide feedback, and award points.
- **Classroom Analytics**: Monitor the collective environmental footprint and participation levels of your class.
- **Student Management**: Overview of student rankings, points, and activity history.

---

## 🛠️ Technology Stack

- **Frontend**: 
  - [React.js](https://reactjs.org/) (Vite)
  - [TypeScript](https://www.typescriptlang.org/) for type-safe development
  - [Tailwind CSS](https://tailwindcss.com/) for modern, responsive styling
  - [Framer Motion](https://www.framer.com/motion/) for fluid micro-animations
  - [Lucide React](https://lucide.dev/) for consistent, beautiful iconography
- **Backend**:
  - [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
  - [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
  - [JWT](https://jwt.io/) for secure, stateless authentication
- **Design Principles**:
  - Glassmorphic UI elements
  - Clean, accessible typography (Outfit & Inter)
  - Vibrant, earth-toned color palette

---

## 📂 Project Structure

```text
├── backend/                # Express.js Server
│   ├── models/             # Database Schemas (User, Task, Submission)
│   ├── routes/             # API Endpoints (Auth, Tasks, Submissions, Profiles)
│   ├── middleware/         # JWT Authentication & Role-based Access
│   └── server.js           # Application Entry Point
└── frontend/               # Vite + React Application
    ├── src/
    │   ├── components/     # Atomic UI Components (Buttons, Cards, Modals)
    │   ├── context/        # Global Auth & State Management
    │   ├── pages/          # Full-page Views (Dashboard, Leaderboard, etc.)
    │   └── App.tsx         # Root Router & Core Layout
```

---

## 🚦 Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **MongoDB**: A local instance or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 1. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_random_secret
   ```
4. Start the server (Dev Mode): `npm run dev`

### 2. Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the application: `npm run dev`
4. Access the app at `http://localhost:5173`

---

## 📈 Roadmap & Progress

- [x] **Phase 1**: Core Infrastructure (MERN Setup, Auth, JWT)
- [x] **Phase 2**: Student Experience (Quest Listings, Dashboard UI)
- [x] **Phase 3**: Gamification Engine (Point Logic, Leveling Systems)
- [x] **Phase 4**: Teacher Tools (Task Creation, Submission Review)
- [x] **Phase 5**: Real-time Analytics (Leaderboards, Impact Stats)
- [ ] **Phase 6**: Social & Mobile (Push Notifications, Group Challenges, Native App)

---

## 📜 License
Developed for educational and environmental awareness purposes.

**Made with 🌿 by [B Revanth Kumar](https://github.com/revanth-kumar-b)**
