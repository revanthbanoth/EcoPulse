# EcoPulse Implementation Plan

## 🌿 Overview
EcoPulse is a gamified environmental learning platform designed to bridge the gap between classroom learning and real-world ecological action.

## 🎨 Design System
- **Colors**:
  - `Primary`: #10B981 (Emerald Green)
  - `Secondary`: #0EA5E9 (Sky Blue)
  - `Accent`: #F59E0B (Sunny Yellow)
  - `Background`: #F8FAFC (Light Gray/White)
- **Typography**: `Outfit` (Headings), `Inter` (Body)
- **Mascot**: Leafy (A cute sprout character)
- **Aesthetic**: Modern, clean, rounded corners, soft shadows, glassmorphism.

## 📊 Database Schema (MongoDB / Mongoose)
### `User`
- `fullName`: String
- `email`: String (Unique)
- `password`: String (Hashed)
- `role`: Enum ('student', 'teacher')
- `avatarUrl`: String
- `points`: Number (default 0)
- `level`: Number (default 1)
- `streak`: Number (default 0)
- `classId`: String

### `Task`
- `title`: String
- `description`: String
- `category`: Enum ('Waste', 'Biodiversity', 'Water', 'Energy')
- `difficulty`: Enum ('Easy', 'Medium', 'Hard')
- `pointsBase`: Number
- `timelineDays`: Number
- `createdBy`: ObjectId (ref User)

### `Submission`
- `taskId`: ObjectId (ref Task)
- `studentId`: ObjectId (ref User)
- `proofUrl`: String
- `content`: String
- `status`: Enum ('pending', 'approved', 'rejected')
- `feedback`: String
- `pointsAwarded`: Number
- `createdAt`: Date

## 🚀 MVP Roadmap (8-Hour Build)
1. **Phase 1: Setup (1h)** - MERN stack init, MongoDB setup, Auth integration.
2. **Phase 2: Database (1h)** - Create Mongoose models, Express routes, seed initial data.
3. **Phase 3: Student Flow (2.5h)** - Dashboard, Task list, Submission form, Rank display.
4. **Phase 4: Teacher Flow (2.5h)** - Management dashboard, Task creation, Submission review.
5. **Phase 5: Gamification & Polish (1h)** - Animations, Leaderboard logic, Mascot integration.

## 🏆 Ranking Logic
`Score = (Base Points) + (Base Points * Early Bonus) + (Streak Bonus)`
- Early Bonus: 10% if submitted > 24h before deadline.
- Streak Bonus: +5 points per day of consecutive activity.
