import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import {
    Plus,
    CheckCircle2,
    XCircle,
    ClipboardList,
    TrendingUp,
    Clock,
    Edit,
    Trash2,
    MessageSquare,
    ArrowRight
} from 'lucide-react'
import axios from 'axios'
import API_URL from '../config/api'

interface Task {
    _id: string
    title: string
    description: string
    category: string
    difficulty: string
    pointsBase: number
}

interface Submission {
    _id: string
    taskId: {
        title: string
    }
    studentId: {
        fullName: string
        email: string
    }
    content: string
    proofUrl: string
    status: 'pending' | 'approved' | 'rejected'
    createdAt: string
}

export default function TeacherDashboard() {
    const { token } = useAuth()
    const [tasks, setTasks] = useState<Task[]>([])
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [loading, setLoading] = useState(true)
    const [showTaskForm, setShowTaskForm] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [reviewFeedback, setReviewFeedback] = useState<{ [key: string]: string }>({})

    // Form State
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        category: 'Waste',
        difficulty: 'Medium',
        pointsBase: 100
    })

    const fetchDashboardData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            const [tasksRes, subsRes] = await Promise.all([
                axios.get(`${API_URL}/api/tasks`),
                axios.get(`${API_URL}/api/submissions`, config)
            ])
            setTasks(tasksRes.data)
            setSubmissions(subsRes.data)
        } catch (err) {
            console.error('Failed to fetch teacher data', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [token])

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            if (editingTask) {
                await axios.put(`${API_URL}/api/tasks/${editingTask._id}`, newTask, config)
            } else {
                await axios.post(`${API_URL}/api/tasks`, newTask, config)
            }
            setShowTaskForm(false)
            setEditingTask(null)
            setNewTask({ title: '', description: '', category: 'Waste', difficulty: 'Medium', pointsBase: 100 })
            fetchDashboardData()
        } catch (err) {
            alert('Failed to save task')
        }
    }

    const handleDeleteTask = async (id: string) => {
        if (!confirm('Are you sure you want to delete this quest? All associated submissions will also be removed.')) return
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            await axios.delete(`${API_URL}/api/tasks/${id}`, config)
            fetchDashboardData()
        } catch (err) {
            alert('Failed to delete task')
        }
    }

    const handleReview = async (id: string, status: 'approved' | 'rejected') => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } }
            await axios.patch(`${API_URL}/api/submissions/${id}`, {
                status,
                feedback: reviewFeedback[id] || ''
            }, config)
            fetchDashboardData()
        } catch (err) {
            alert('Failed to update submission')
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-primary/30">
            <Navbar />

            {loading ? (
                <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary shadow-lg shadow-primary/20"></div>
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
                    </div>
                </div>
            ) : (
                <main className="max-w-7xl mx-auto px-6 py-12 relative">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 opacity-30" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -z-10 opacity-20" />

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative z-10">
                        <div>
                            <h1 className="text-4xl font-black font-heading text-white mb-2 tracking-tight">Teacher Dashboard</h1>
                            <p className="text-slate-400 font-body font-medium">Manage quests and reward environmental action.</p>
                        </div>
                        <Button onClick={() => {
                            setEditingTask(null)
                            setNewTask({ title: '', description: '', category: 'Waste', difficulty: 'Medium', pointsBase: 100 })
                            setShowTaskForm(true)
                        }} className="rounded-2xl px-8 h-14 bg-primary hover:bg-emerald-600 border-0 shadow-2xl shadow-primary/30 text-white font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95">
                            <Plus className="mr-2 w-5 h-5" /> Create New Quest
                        </Button>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10">
                        {[
                            { label: 'Active Quests', value: tasks.length, icon: ClipboardList, color: 'text-primary', bg: 'bg-primary/10' },
                            { label: 'Pending Reviews', value: submissions.filter(s => s.status === 'pending').length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                            { label: 'Total Completions', value: submissions.filter(s => s.status === 'approved').length, icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                            { label: 'Engagement Rate', value: '84%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
                        ].map((stat, i) => (
                            <Card key={i} className="glass border-white/5 bg-white/5 shadow-xl rounded-[2.5rem] overflow-hidden group hover:-translate-y-1 transition-all">
                                <CardContent className="p-8">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                            <h3 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
                                        </div>
                                        <div className={`p-4 rounded-2xl ${stat.bg} border border-white/5 shadow-inner group-hover:scale-110 transition-transform ${stat.color}`}>
                                            <stat.icon size={28} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                        {/* Submissions Review */}
                        <div className="lg:col-span-2 space-y-8">
                            <h2 className="text-2xl font-black font-heading text-white flex items-center gap-3 tracking-tight">
                                <div className="bg-amber-500/20 p-2 rounded-xl border border-amber-500/20">
                                    <Clock className="text-amber-500 w-5 h-5" />
                                </div>
                                Pending Submissions
                            </h2>

                            <div className="space-y-6">
                                {submissions.filter(s => s.status === 'pending').length === 0 ? (
                                    <div className="p-24 rounded-[3rem] border-2 border-dashed border-white/5 text-center bg-transparent">
                                        <CheckCircle2 size={48} className="mx-auto text-primary opacity-20 mb-4" />
                                        <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-xs">All caught up!</p>
                                    </div>
                                ) : (
                                    submissions.filter(s => s.status === 'pending').map(sub => (
                                        <Card key={sub._id} className="glass border-white/5 bg-[#0F172A] shadow-2xl rounded-[3rem] overflow-hidden hover:border-primary/20 transition-all group">
                                            <CardContent className="p-0">
                                                <div className="p-8">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary font-black border border-white/5 group-hover:bg-primary/10 transition-colors">
                                                                {sub.studentId.fullName.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">{sub.taskId.title}</h3>
                                                                <p className="text-xs font-black text-primary uppercase tracking-widest mt-0.5">{sub.studentId.fullName}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">{new Date(sub.createdAt).toLocaleDateString()}</span>
                                                    </div>

                                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 mb-8 group-hover:bg-white-[0.07] transition-colors relative">
                                                        <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-full opacity-40" />
                                                        <p className="text-slate-300 font-medium italic leading-relaxed pl-4">"{sub.content}"</p>
                                                        {sub.proofUrl && (
                                                            <a href={sub.proofUrl} target="_blank" rel="noreferrer" className="text-xs text-primary font-black uppercase tracking-widest mt-4 inline-flex items-center gap-2 hover:bg-primary/10 px-4 py-2 rounded-xl transition-all border border-primary/20 pl-4">
                                                                View Evidence <ArrowRight size={14} />
                                                            </a>
                                                        )}
                                                    </div>

                                                    <div className="mb-8 space-y-3">
                                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                                            <MessageSquare size={12} className="text-primary" /> Feedback for student
                                                        </label>
                                                        <textarea
                                                            className="w-full p-5 bg-white/5 border border-white/5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-white placeholder:text-slate-700 font-medium h-24 resize-none transition-all"
                                                            placeholder="Great job! Your contribution makes a difference..."
                                                            value={reviewFeedback[sub._id] || ''}
                                                            onChange={e => setReviewFeedback({ ...reviewFeedback, [sub._id]: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="flex gap-4">
                                                        <Button onClick={() => handleReview(sub._id, 'approved')} size="lg" className="bg-primary hover:bg-emerald-600 rounded-2xl flex-1 h-14 font-black uppercase tracking-widest text-xs border-0 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
                                                            <CheckCircle2 size={18} className="mr-2" /> Approve
                                                        </Button>
                                                        <Button onClick={() => handleReview(sub._id, 'rejected')} size="lg" variant="outline" className="text-red-400 border-white/5 hover:bg-red-500/10 rounded-2xl flex-1 h-14 font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02]">
                                                            <XCircle size={18} className="mr-2" /> Reject
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Task List Sidebar */}
                        <div className="space-y-8">
                            <h2 className="text-2xl font-black font-heading text-white flex items-center gap-3 tracking-tight">
                                <div className="bg-primary/20 p-2 rounded-xl border border-primary/20">
                                    <ClipboardList className="text-primary w-5 h-5" />
                                </div>
                                Active Quests
                            </h2>
                            <div className="space-y-3">
                                {tasks.map(task => (
                                    <Card key={task._id} className="p-6 border-white/5 bg-[#0F172A] rounded-3xl hover:border-primary/40 transition-all group border-l-4 border-l-primary/30">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-lg font-bold text-white tracking-tight group-hover:text-primary transition-colors">{task.title}</p>
                                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">
                                                    <span className="text-primary">{task.category}</span> • <span className="text-slate-300">{task.pointsBase} Pts</span>
                                                </p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <Button
                                                    onClick={() => {
                                                        setEditingTask(task)
                                                        setNewTask({
                                                            title: task.title,
                                                            description: task.description,
                                                            category: task.category,
                                                            difficulty: task.difficulty,
                                                            pointsBase: task.pointsBase
                                                        })
                                                        setShowTaskForm(true)
                                                    }}
                                                    variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/10 border border-white/5">
                                                    <Edit size={16} />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDeleteTask(task._id)}
                                                    variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 border border-white/5">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            )}

            {/* Task Form Modal */}
            {showTaskForm && (
                <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <Card className="w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/10 bg-[#0F172A] rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-10 pb-4">
                            <CardTitle className="text-3xl font-black text-white tracking-tight">{editingTask ? 'Edit Eco-Quest' : 'Create Eco-Quest'}</CardTitle>
                            <CardDescription className="text-slate-400 font-medium">{editingTask ? 'Update mission details.' : 'Deploy a new mission.'}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 pt-4">
                            <form onSubmit={handleCreateTask} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Quest Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Plant 3 Trees"
                                        className="w-full px-5 py-4 bg-[#010413] border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-white placeholder:text-slate-700 font-medium transition-all"
                                        value={newTask.title}
                                        onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Description</label>
                                    <textarea
                                        required
                                        placeholder="Explain the mission objectives..."
                                        className="w-full px-5 py-4 bg-[#010413] border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-white placeholder:text-slate-700 font-medium h-32 resize-none transition-all"
                                        value={newTask.description}
                                        onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Category</label>
                                        <select
                                            className="w-full px-5 py-4 bg-[#0F172A] border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-white font-medium appearance-none cursor-pointer"
                                            value={newTask.category}
                                            onChange={e => setNewTask({ ...newTask, category: e.target.value })}
                                        >
                                            <option value="Waste">Waste</option>
                                            <option value="Biodiversity">Biodiversity</option>
                                            <option value="Water">Water</option>
                                            <option value="Energy">Energy</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Points</label>
                                        <input
                                            type="number"
                                            className="w-full px-5 py-4 bg-[#010413] border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-white font-medium transition-all"
                                            value={newTask.pointsBase}
                                            onChange={e => setNewTask({ ...newTask, pointsBase: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-10">
                                    <Button type="button" variant="outline" onClick={() => {
                                        setShowTaskForm(false)
                                        setEditingTask(null)
                                    }} className="flex-1 rounded-2xl h-14 border-white/5 hover:bg-white/5 text-slate-400 font-black uppercase tracking-widest text-xs">Cancel</Button>
                                    <Button type="submit" className="flex-1 rounded-2xl h-14 bg-primary hover:bg-emerald-600 border-0 shadow-2xl shadow-primary/20 text-white font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02]">
                                        {editingTask ? 'Update Quest' : 'Launch Quest'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
            <Footer minimal />
        </div>
    )
}
