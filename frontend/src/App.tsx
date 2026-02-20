import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Tasks from './pages/Tasks'
import HowItWorksPage from './pages/HowItWorksPage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute role="student">
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/teacher"
                element={
                    <ProtectedRoute role="teacher">
                        <TeacherDashboard />
                    </ProtectedRoute>
                }
            />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            {/* Redirect logged in users from root or catch-all to their respective dashboards if needed */}
        </Routes>
    )
}

export default App
