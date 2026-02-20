import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import {
    Trophy,
    Target,
    Flame,
    CheckCircle2,
    ArrowRight,
    TrendingUp,
    Leaf,
    Upload
} from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'

interface Task {
    _id: string
    title: string
    description: string
    category: 'Waste' | 'Biodiversity' | 'Water' | 'Energy'
    difficulty: 'Easy' | 'Medium' | 'Hard'
    pointsBase: number
    timelineDays: number
}

export default function StudentDashboard() {
    const { user, token } = useAuth()
    const [tasks, setTasks] = useState<Task[]>([])
    const [leaderboard, setLeaderboard] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [submissionForm, setSubmissionForm] = useState({ content: '', proofUrl: '' })
    const [file, setFile] = useState<File | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [showSuccessPopup, setShowSuccessPopup] = useState(false)

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            const [tasksRes, leadRes, statsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/tasks'),
                axios.get('http://localhost:5000/api/profiles/leaderboard'),
                axios.get('http://localhost:5000/api/profiles/stats', config)
            ])
            setTasks(tasksRes.data)
            setLeaderboard(leadRes.data)
            setStats(statsRes.data)
        } catch (err) {
            console.error('Failed to fetch dashboard data', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [token])

    const handleSubmitQuest = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedTask) return
        const formData = new FormData()
        formData.append('taskId', selectedTask._id)
        formData.append('content', submissionForm.content)
        if (file) {
            formData.append('image', file)
        } else if (submissionForm.proofUrl) {
            formData.append('proofUrl', submissionForm.proofUrl)
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
            await axios.post('http://localhost:5000/api/submissions', formData, config)
            setShowSuccessPopup(true)
            setSelectedTask(null)
            setSubmissionForm({ content: '', proofUrl: '' })
            setFile(null)
            fetchData()
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to submit quest')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-primary/30">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="relative z-10">
                        <h1 className="text-4xl font-black font-heading text-white mb-2 tracking-tight">
                            Welcome back, <span className="text-primary italic">{user?.fullName.split(' ')[0]}</span>! 🌿
                        </h1>
                        <p className="text-slate-400 font-body font-medium">
                            {stats?.totalCompleted > 0
                                ? `You've completed ${stats.totalCompleted} quests so far. Keep it up!`
                                : "Ready to start your first quest and save the planet?"}
                        </p>
                    </div>
                    <div className="flex gap-4 relative z-10">
                        <Card className="border-white/5 bg-[#0F172A] shadow-xl">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="bg-primary/20 p-2.5 rounded-xl border border-primary/20 shadow-lg shadow-primary/10">
                                    <Trophy className="text-primary w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">Level {user?.level}</p>
                                    <p className="text-xl font-black text-white">{user?.points} <span className="text-[10px] text-primary ml-0.5">PTS</span></p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-white/5 bg-[#0F172A] shadow-xl">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/20 shadow-lg shadow-amber-500/10">
                                    <Flame className="text-amber-500 w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">Streak</p>
                                    <p className="text-xl font-black text-white">{user?.streak} <span className="text-[10px] text-amber-500 ml-0.5">DAYS</span></p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                    {/* Main Content: Active Quests */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <div className="flex justify-between items-end mb-8">
                                <h2 className="text-2xl font-black font-heading text-white flex items-center gap-2 tracking-tight">
                                    <Target className="text-primary" />
                                    Active Eco-Quests
                                </h2>
                                <Button variant="ghost" className="text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest">History</Button>
                            </div>

                            <div className="grid grid-cols-1 gap-5">
                                {loading ? (
                                    Array(3).fill(0).map((_, i) => (
                                        <div key={i} className="h-32 bg-white/5 animate-pulse rounded-3xl border border-white/5" />
                                    ))
                                ) : tasks.length > 0 ? (
                                    tasks.map((task) => (
                                        <Card key={task._id} className="group hover:border-primary/30 transition-all cursor-default bg-[#0F172A] border-white/5 overflow-hidden">
                                            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                <div className="flex gap-5">
                                                    <div className={`p-5 rounded-2xl border transition-all duration-500 group-hover:scale-110 shadow-lg ${task.category === 'Waste' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-orange-500/10' :
                                                        task.category === 'Energy' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10' :
                                                            task.category === 'Water' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/10' :
                                                                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10'
                                                        }`}>
                                                        <Leaf className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg border-current border-opacity-20 ${task.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                                                                task.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                                                                    'bg-red-500/10 text-red-400'
                                                                }`}>
                                                                {task.difficulty}
                                                            </span>
                                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-white/5 text-slate-500 px-2 py-1 rounded-lg border border-white/5">
                                                                {task.category}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors tracking-tight leading-tight">{task.title}</h3>
                                                        <p className="text-sm text-slate-500 font-medium line-clamp-1 mt-1">{task.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-8 w-full md:w-auto justify-between border-t border-white/5 md:border-t-0 pt-5 md:pt-0">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-2xl font-black text-primary tracking-tighter">+{task.pointsBase}</span>
                                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Points</span>
                                                    </div>
                                                    <Button onClick={() => setSelectedTask(task)} size="lg" className="rounded-2xl px-8 bg-primary hover:bg-emerald-600 border-0 shadow-xl shadow-primary/20 text-white font-black uppercase tracking-widest text-xs">
                                                        Start <ArrowRight size={14} className="ml-2" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <Card className="p-20 text-center border-dashed border-2 border-white/5 bg-[#0F172A] rounded-[3rem]">
                                        <p className="text-slate-600 font-black uppercase tracking-[0.4em]">No active quests</p>
                                    </Card>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar: Progress & Leaderboard */}
                    <div className="space-y-8">
                        <Card className="border-white/5 bg-[#0F172A] shadow-xl rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-xl font-black tracking-tight text-white">
                                    <TrendingUp className="text-secondary" />
                                    Your Progress
                                </CardTitle>
                                <CardDescription className="text-slate-500 font-medium">Monthly impact stats</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8 pt-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                        <span className="text-slate-400">Completed Quests</span>
                                        <span className="text-primary">{stats?.totalCompleted || 0}</span>
                                    </div>
                                    <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full shadow-lg shadow-primary/20" style={{ width: `${Math.min(((stats?.totalCompleted || 0) / 10) * 100, 100)}%` }} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                        <span className="text-slate-400">Pending Review</span>
                                        <span className="text-secondary">{stats?.pendingTasks || 0}</span>
                                    </div>
                                    <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-gradient-to-r from-secondary to-blue-400 rounded-full shadow-lg shadow-secondary/20" style={{ width: `${Math.min(((stats?.pendingTasks || 0) / 5) * 100, 100)}%` }} />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <div className="bg-primary/5 p-5 rounded-2xl flex items-start gap-4 border border-primary/10">
                                        <div className="bg-primary/20 p-1.5 rounded-lg border border-primary/20">
                                            <CheckCircle2 className="text-primary w-4 h-4" />
                                        </div>
                                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                            <span className="text-primary font-black uppercase text-[10px] tracking-widest block mb-1">Pro Tip</span>
                                            Submitting high-quality image proof earns you special achievement badges!
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/5 bg-[#0F172A] shadow-xl rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xl font-black tracking-tight">Top Players</CardTitle>
                                <Trophy className="text-amber-500 w-5 h-5" />
                            </CardHeader>
                            <CardContent className="p-0">
                                {leaderboard.length > 0 ? (
                                    leaderboard.map((player, i) => (
                                        <div key={player._id} className="flex items-center justify-between p-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <span className={`w-6 text-xs font-black ${i === 0 ? 'text-amber-500' : 'text-slate-600'}`}>0{i + 1}</span>
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-black border border-primary/20 group-hover:scale-110 transition-transform">
                                                    {player.fullName.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-slate-100 group-hover:text-primary transition-colors">{player.fullName}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-black text-primary">{player.points}</span>
                                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">PTS</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">Loading Leaderboard</div>
                                )}
                                <div className="p-5">
                                    <Link to="/leaderboard">
                                        <Button variant="outline" className="w-full text-[10px] font-black uppercase tracking-[0.2em] border-white/5 hover:bg-white/5 h-10" size="sm">Full Rankings</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Submission Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <Card className="w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/10 bg-[#0F172A] rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="flex items-center gap-3 text-2xl font-black tracking-tight text-white">
                                <div className="bg-primary/20 p-2 rounded-xl">
                                    <Target className="text-primary" />
                                </div>
                                {selectedTask.title}
                            </CardTitle>
                            <CardDescription className="text-slate-400 font-medium mt-2">{selectedTask.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <form onSubmit={handleSubmitQuest} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Your Reflection/Action</label>
                                    <textarea
                                        required
                                        placeholder="Describe what you did to complete this quest..."
                                        className="w-full px-5 py-4 border-white/5 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none bg-[#010413] text-white placeholder:text-slate-600 font-medium h-32 resize-none"
                                        value={submissionForm.content}
                                        onChange={e => setSubmissionForm({ ...submissionForm, content: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Upload Proof (Image)</label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex-1 flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-white/5 rounded-2xl hover:border-primary/50 cursor-pointer transition-all text-slate-500 hover:text-primary bg-[#010413] group">
                                            <Upload size={20} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-sm font-black uppercase tracking-widest">{file ? file.name : 'Select Proof Image'}</span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={e => setFile(e.target.files?.[0] || null)}
                                            />
                                        </label>
                                    </div>
                                    <div className="relative py-2">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                                        <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em]"><span className="bg-[#020617] px-4 text-slate-600">or link</span></div>
                                    </div>
                                    <input
                                        type="url"
                                        placeholder="https://imgur.com/your-proof"
                                        className="w-full px-5 py-3.5 border-white/5 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-[#010413] text-white placeholder:text-slate-600 text-sm font-medium"
                                        value={submissionForm.proofUrl}
                                        onChange={e => setSubmissionForm({ ...submissionForm, proofUrl: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-4 mt-8">
                                    <Button type="button" variant="outline" onClick={() => setSelectedTask(null)} className="flex-1 rounded-2xl h-12 border-white/5 hover:bg-white/5 text-slate-400 font-black uppercase tracking-widest text-xs">Cancel</Button>
                                    <Button type="submit" disabled={submitting} className="flex-1 rounded-2xl h-12 bg-primary hover:bg-emerald-600 border-0 shadow-xl shadow-primary/20 text-white font-black uppercase tracking-widest text-xs">
                                        {submitting ? 'Processing...' : 'Submit Quest'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-md z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-sm bg-[#0F172A] border border-white/10 rounded-[2.5rem] p-10 text-center shadow-[0_0_50px_rgba(16,185,129,0.1)]"
                    >
                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
                            <CheckCircle2 className="text-primary w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight mb-2">Quest Submitted!</h2>
                        <p className="text-slate-400 font-medium mb-8">Your proof has been sent for review. Points will be awarded soon!</p>
                        <Button
                            onClick={() => setShowSuccessPopup(false)}
                            className="w-full h-12 rounded-xl bg-primary hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] border-0 shadow-lg shadow-primary/20"
                        >
                            Awesome!
                        </Button>
                    </motion.div>
                </div>
            )}
            <Footer minimal />
        </div>
    )
}
