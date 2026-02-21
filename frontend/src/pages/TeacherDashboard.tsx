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
    Clock,
    Edit,
    Trash2,
    MessageSquare,
    ArrowRight,
    Users,
    Star,
    Zap,
    Search,
    UserCheck,
    Award,
    Activity,
    Filter,
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
    taskId: { title: string; category?: string }
    studentId: { _id: string; fullName: string; email: string }
    content: string
    proofUrl: string
    status: 'pending' | 'approved' | 'rejected'
    createdAt: string
    feedback?: string
}

interface Student {
    _id: string
    fullName: string
    email: string
    points: number
    level: number
    streak: number
    classId?: string
    completedCount: number
    pendingCount: number
}

type SubmissionTab = 'pending' | 'completed'
type MainTab = 'submissions' | 'students' | 'quests'

const CATEGORY_COLORS: Record<string, string> = {
    Waste: 'text-orange-400 bg-orange-400/10',
    Biodiversity: 'text-emerald-400 bg-emerald-400/10',
    Water: 'text-blue-400 bg-blue-400/10',
    Energy: 'text-yellow-400 bg-yellow-400/10',
}

export default function TeacherDashboard() {
    const { token } = useAuth()

    const [tasks, setTasks] = useState<Task[]>([])
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [showTaskForm, setShowTaskForm] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [reviewFeedback, setReviewFeedback] = useState<{ [key: string]: string }>({})

    // Tab state
    const [mainTab, setMainTab] = useState<MainTab>('submissions')
    const [submissionTab, setSubmissionTab] = useState<SubmissionTab>('pending')

    // Student search
    const [studentSearch, setStudentSearch] = useState('')

    // Task form state
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        category: 'Waste',
        difficulty: 'Medium',
        pointsBase: 100,
    })

    // Student assignment in task form
    const [assignMode, setAssignMode] = useState<'all' | 'specific'>('all')
    const [selectedStudents, setSelectedStudents] = useState<string[]>([])
    const [studentPickerSearch, setStudentPickerSearch] = useState('')

    const config = { headers: { Authorization: `Bearer ${token}` } }

    const fetchDashboardData = async () => {
        try {
            const [tasksRes, subsRes, studentsRes] = await Promise.all([
                axios.get(`${API_URL}/api/tasks`),
                axios.get(`${API_URL}/api/submissions`, config),
                axios.get(`${API_URL}/api/profiles/students`, config),
            ])
            setTasks(tasksRes.data)
            setSubmissions(subsRes.data)
            setStudents(studentsRes.data)
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
            const payload = {
                ...newTask,
                assignedTo: assignMode === 'all' ? [] : selectedStudents,
            }
            if (editingTask) {
                await axios.put(`${API_URL}/api/tasks/${editingTask._id}`, payload, config)
            } else {
                await axios.post(`${API_URL}/api/tasks`, payload, config)
            }
            setShowTaskForm(false)
            setEditingTask(null)
            setNewTask({ title: '', description: '', category: 'Waste', difficulty: 'Medium', pointsBase: 100 })
            setAssignMode('all')
            setSelectedStudents([])
            fetchDashboardData()
        } catch {
            alert('Failed to save task')
        }
    }

    const handleDeleteTask = async (id: string) => {
        if (!confirm('Are you sure you want to delete this quest?')) return
        try {
            await axios.delete(`${API_URL}/api/tasks/${id}`, config)
            fetchDashboardData()
        } catch {
            alert('Failed to delete task')
        }
    }

    const handleReview = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await axios.patch(`${API_URL}/api/submissions/${id}`, {
                status,
                feedback: reviewFeedback[id] || '',
            }, config)
            fetchDashboardData()
        } catch {
            alert('Failed to update submission')
        }
    }

    const toggleStudentSelection = (id: string) => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        )
    }

    const pendingSubs = submissions.filter(s => s.status === 'pending')
    const completedSubs = submissions.filter(s => s.status === 'approved' || s.status === 'rejected')
    const filteredStudents = students.filter(s =>
        s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(studentSearch.toLowerCase())
    )
    const pickerStudents = students.filter(s =>
        s.fullName.toLowerCase().includes(studentPickerSearch.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-primary/30">
            <Navbar />

            {loading ? (
                <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary shadow-lg shadow-primary/20" />
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse" />
                    </div>
                </div>
            ) : (
                <main className="max-w-7xl mx-auto px-6 py-12 relative">
                    {/* Background Blobs */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 opacity-30" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -z-10 opacity-20" />

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative z-10">
                        <div>
                            <h1 className="text-4xl font-black font-heading text-white mb-2 tracking-tight">Teacher Dashboard</h1>
                            <p className="text-slate-400 font-body font-medium">Manage quests and reward environmental action.</p>
                        </div>
                        <Button
                            onClick={() => {
                                setEditingTask(null)
                                setNewTask({ title: '', description: '', category: 'Waste', difficulty: 'Medium', pointsBase: 100 })
                                setAssignMode('all')
                                setSelectedStudents([])
                                setShowTaskForm(true)
                            }}
                            className="rounded-2xl px-8 h-14 bg-primary hover:bg-emerald-600 border-0 shadow-2xl shadow-primary/30 text-white font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95"
                        >
                            <Plus className="mr-2 w-5 h-5" /> Create New Quest
                        </Button>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 relative z-10">
                        {[
                            { label: 'Active Quests', value: tasks.length, icon: ClipboardList, color: 'text-primary', bg: 'bg-primary/10' },
                            { label: 'Pending Reviews', value: pendingSubs.length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                            { label: 'Total Completions', value: completedSubs.filter(s => s.status === 'approved').length, icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                            { label: 'Students Enrolled', value: students.length, icon: Users, color: 'text-violet-400', bg: 'bg-violet-400/10' },
                        ].map((stat, i) => (
                            <Card key={i} className="glass border-white/5 bg-white/5 shadow-xl rounded-[2rem] overflow-hidden group hover:-translate-y-1 transition-all">
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">{stat.value}</h3>
                                        </div>
                                        <div className={`p-3 md:p-4 rounded-2xl ${stat.bg} border border-white/5 shadow-inner group-hover:scale-110 transition-transform ${stat.color}`}>
                                            <stat.icon size={24} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Main Tabs */}
                    <div className="flex gap-2 mb-8 relative z-10 bg-white/5 p-1.5 rounded-2xl w-fit border border-white/5">
                        {([
                            { key: 'submissions', label: 'Submissions', icon: Filter },
                            { key: 'students', label: 'Students', icon: Users },
                            { key: 'quests', label: 'Active Quests', icon: ClipboardList },
                        ] as const).map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setMainTab(tab.key)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mainTab === tab.key
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'text-slate-500 hover:text-white'
                                    }`}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ─── SUBMISSIONS TAB ─── */}
                    {mainTab === 'submissions' && (
                        <div className="relative z-10">
                            {/* Sub-tab: Pending / Completed */}
                            <div className="flex gap-3 mb-6">
                                <button
                                    onClick={() => setSubmissionTab('pending')}
                                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${submissionTab === 'pending'
                                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                        : 'text-slate-500 border-white/5 hover:text-white'
                                        }`}
                                >
                                    <Clock size={13} />
                                    Pending
                                    {pendingSubs.length > 0 && (
                                        <span className="bg-amber-500 text-black rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black">
                                            {pendingSubs.length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setSubmissionTab('completed')}
                                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${submissionTab === 'completed'
                                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                        : 'text-slate-500 border-white/5 hover:text-white'
                                        }`}
                                >
                                    <UserCheck size={13} />
                                    Completed
                                    {completedSubs.length > 0 && (
                                        <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black">
                                            {completedSubs.length}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Side-by-side layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* LEFT – Pending */}
                                <div className={`space-y-5 ${submissionTab === 'pending' ? '' : 'hidden lg:block opacity-40 pointer-events-none'}`}>
                                    <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tight">
                                        <div className="bg-amber-500/20 p-2 rounded-xl border border-amber-500/20">
                                            <Clock className="text-amber-500 w-4 h-4" />
                                        </div>
                                        Pending Submissions
                                        <span className="text-sm text-amber-400 font-bold ml-1">({pendingSubs.length})</span>
                                    </h2>

                                    {pendingSubs.length === 0 ? (
                                        <div className="p-16 rounded-[2.5rem] border-2 border-dashed border-white/5 text-center bg-transparent">
                                            <CheckCircle2 size={40} className="mx-auto text-primary opacity-20 mb-4" />
                                            <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-xs">All caught up!</p>
                                        </div>
                                    ) : (
                                        pendingSubs.map(sub => (
                                            <PendingCard
                                                key={sub._id}
                                                sub={sub}
                                                feedback={reviewFeedback[sub._id] || ''}
                                                onFeedbackChange={v => setReviewFeedback({ ...reviewFeedback, [sub._id]: v })}
                                                onApprove={() => handleReview(sub._id, 'approved')}
                                                onReject={() => handleReview(sub._id, 'rejected')}
                                            />
                                        ))
                                    )}
                                </div>

                                {/* RIGHT – Completed */}
                                <div className={`space-y-5 ${submissionTab === 'completed' ? '' : 'hidden lg:block opacity-40 pointer-events-none'}`}>
                                    <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tight">
                                        <div className="bg-blue-500/20 p-2 rounded-xl border border-blue-500/20">
                                            <UserCheck className="text-blue-400 w-4 h-4" />
                                        </div>
                                        Completed Submissions
                                        <span className="text-sm text-blue-400 font-bold ml-1">({completedSubs.length})</span>
                                    </h2>

                                    {completedSubs.length === 0 ? (
                                        <div className="p-16 rounded-[2.5rem] border-2 border-dashed border-white/5 text-center bg-transparent">
                                            <Activity size={40} className="mx-auto text-slate-700 mb-4" />
                                            <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-xs">No reviewed submissions yet</p>
                                        </div>
                                    ) : (
                                        completedSubs.map(sub => (
                                            <CompletedCard key={sub._id} sub={sub} />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─── STUDENTS TAB ─── */}
                    {mainTab === 'students' && (
                        <div className="relative z-10 space-y-6">
                            {/* Search bar */}
                            <div className="relative max-w-md">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search students by name or email..."
                                    value={studentSearch}
                                    onChange={e => setStudentSearch(e.target.value)}
                                    className="w-full pl-11 pr-5 py-3 bg-white/5 border border-white/5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-white placeholder:text-slate-600 font-medium transition-all"
                                />
                            </div>

                            {filteredStudents.length === 0 ? (
                                <div className="p-16 rounded-[2.5rem] border-2 border-dashed border-white/5 text-center">
                                    <Users size={40} className="mx-auto text-slate-700 mb-4" />
                                    <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-xs">No students found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {filteredStudents.map((student, idx) => (
                                        <Card key={student._id} className="border-white/5 bg-[#0F172A] rounded-3xl hover:border-primary/30 transition-all group overflow-hidden">
                                            <CardContent className="p-6">
                                                {/* Avatar + Name */}
                                                <div className="flex items-center gap-4 mb-5">
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-violet-500/30 flex items-center justify-center text-2xl font-black text-white border border-white/5 group-hover:scale-105 transition-transform flex-shrink-0">
                                                        {student.fullName.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-white tracking-tight truncate group-hover:text-primary transition-colors">{student.fullName}</p>
                                                        <p className="text-xs text-slate-500 truncate">{student.email}</p>
                                                        {student.classId && (
                                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Class: {student.classId}</span>
                                                        )}
                                                    </div>
                                                    <div className="ml-auto">
                                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg">#{idx + 1}</span>
                                                    </div>
                                                </div>

                                                {/* Stats grid */}
                                                <div className="grid grid-cols-3 gap-3 text-center">
                                                    <div className="bg-white/5 rounded-2xl py-3 border border-white/5">
                                                        <div className="flex items-center justify-center gap-1 mb-1">
                                                            <Star size={11} className="text-yellow-400" />
                                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Points</span>
                                                        </div>
                                                        <p className="text-lg font-black text-white">{student.points}</p>
                                                    </div>
                                                    <div className="bg-white/5 rounded-2xl py-3 border border-white/5">
                                                        <div className="flex items-center justify-center gap-1 mb-1">
                                                            <Zap size={11} className="text-violet-400" />
                                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Level</span>
                                                        </div>
                                                        <p className="text-lg font-black text-white">{student.level}</p>
                                                    </div>
                                                    <div className="bg-white/5 rounded-2xl py-3 border border-white/5">
                                                        <div className="flex items-center justify-center gap-1 mb-1">
                                                            <Activity size={11} className="text-primary" />
                                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Streak</span>
                                                        </div>
                                                        <p className="text-lg font-black text-white">{student.streak}</p>
                                                    </div>
                                                </div>

                                                {/* Task completion badge */}
                                                <div className="flex gap-3 mt-4">
                                                    <div className="flex-1 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
                                                        <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                                                        <span className="text-xs font-black text-emerald-400">{student.completedCount} Done</span>
                                                    </div>
                                                    <div className="flex-1 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                                                        <Clock size={13} className="text-amber-400 flex-shrink-0" />
                                                        <span className="text-xs font-black text-amber-400">{student.pendingCount} Pending</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ─── QUESTS TAB ─── */}
                    {mainTab === 'quests' && (
                        <div className="relative z-10 space-y-4">
                            <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tight mb-6">
                                <div className="bg-primary/20 p-2 rounded-xl border border-primary/20">
                                    <ClipboardList className="text-primary w-4 h-4" />
                                </div>
                                Active Quests
                                <span className="text-sm text-primary font-bold ml-1">({tasks.length})</span>
                            </h2>

                            {tasks.length === 0 ? (
                                <div className="p-16 rounded-[2.5rem] border-2 border-dashed border-white/5 text-center">
                                    <ClipboardList size={40} className="mx-auto text-slate-700 mb-4" />
                                    <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-xs">No quests yet. Create one!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {tasks.map(task => (
                                        <Card key={task._id} className="border-white/5 bg-[#0F172A] rounded-3xl hover:border-primary/40 transition-all group border-l-4 border-l-primary/30">
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1 min-w-0 pr-4">
                                                        <p className="text-lg font-bold text-white tracking-tight group-hover:text-primary transition-colors truncate">{task.title}</p>
                                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                                                        <div className="flex items-center gap-3 mt-3">
                                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${CATEGORY_COLORS[task.category] || 'text-slate-400 bg-slate-400/10'}`}>
                                                                {task.category}
                                                            </span>
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                                {task.pointsBase} pts
                                                            </span>
                                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                                {task.difficulty}
                                                            </span>
                                                        </div>
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
                                                                setAssignMode('all')
                                                                setSelectedStudents([])
                                                                setShowTaskForm(true)
                                                            }}
                                                            variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/10 border border-white/5"
                                                        >
                                                            <Edit size={16} />
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDeleteTask(task._id)}
                                                            variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 border border-white/5"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            )}

            {/* ─── Task Form Modal ─── */}
            {showTaskForm && (
                <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 overflow-y-auto">
                    <Card className="w-full max-w-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/10 bg-[#0F172A] rounded-[2.5rem] overflow-hidden my-8">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-2xl font-black text-white tracking-tight">
                                {editingTask ? 'Edit Eco-Quest' : 'Create Eco-Quest'}
                            </CardTitle>
                            <CardDescription className="text-slate-400 font-medium">
                                {editingTask ? 'Update mission details.' : 'Deploy a new mission and assign it to students.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <form onSubmit={handleCreateTask} className="space-y-5">
                                {/* Quest Title */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Quest Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Plant 3 Trees"
                                        className="w-full px-5 py-4 bg-[#010413] border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-white placeholder:text-slate-700 font-medium transition-all text-sm"
                                        value={newTask.title}
                                        onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Description</label>
                                    <textarea
                                        required
                                        placeholder="Explain the mission objectives..."
                                        className="w-full px-5 py-4 bg-[#010413] border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-white placeholder:text-slate-700 font-medium h-28 resize-none transition-all text-sm"
                                        value={newTask.description}
                                        onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                    />
                                </div>

                                {/* Category + Points */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Category</label>
                                        <select
                                            className="w-full px-5 py-4 bg-[#0F172A] border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-white font-medium appearance-none cursor-pointer text-sm"
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
                                            className="w-full px-5 py-4 bg-[#010413] border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-white font-medium transition-all text-sm"
                                            value={newTask.pointsBase}
                                            onChange={e => setNewTask({ ...newTask, pointsBase: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                {/* Difficulty */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Difficulty</label>
                                    <div className="flex gap-3">
                                        {['Easy', 'Medium', 'Hard'].map(d => (
                                            <button
                                                key={d}
                                                type="button"
                                                onClick={() => setNewTask({ ...newTask, difficulty: d })}
                                                className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${newTask.difficulty === d
                                                    ? d === 'Easy'
                                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                                        : d === 'Medium'
                                                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                                                    : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/10'
                                                    }`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* ─── Student Assignment ─── */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                        <Users size={11} className="text-primary" /> Assign To
                                    </label>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => { setAssignMode('all'); setSelectedStudents([]) }}
                                            className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${assignMode === 'all'
                                                ? 'bg-primary/20 text-primary border-primary/30'
                                                : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/10'
                                                }`}
                                        >
                                            <Users size={13} />
                                            All Students
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setAssignMode('specific')}
                                            className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${assignMode === 'specific'
                                                ? 'bg-violet-500/20 text-violet-400 border-violet-500/30'
                                                : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/10'
                                                }`}
                                        >
                                            <UserCheck size={13} />
                                            Select Students
                                        </button>
                                    </div>

                                    {/* Student Picker */}
                                    {assignMode === 'specific' && (
                                        <div className="bg-[#010413] border border-white/5 rounded-2xl overflow-hidden">
                                            {/* Selected count + search */}
                                            <div className="p-4 border-b border-white/5">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                                        {selectedStudents.length === 0
                                                            ? 'No students selected'
                                                            : `${selectedStudents.length} student${selectedStudents.length > 1 ? 's' : ''} selected`}
                                                    </span>
                                                    {selectedStudents.length > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedStudents([])}
                                                            className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors"
                                                        >
                                                            Clear all
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search students..."
                                                        value={studentPickerSearch}
                                                        onChange={e => setStudentPickerSearch(e.target.value)}
                                                        className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary/20 text-white placeholder:text-slate-700 font-medium"
                                                    />
                                                </div>
                                            </div>

                                            {/* Select All */}
                                            <div
                                                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 border-b border-white/5 transition-colors"
                                                onClick={() => {
                                                    if (selectedStudents.length === students.length) {
                                                        setSelectedStudents([])
                                                    } else {
                                                        setSelectedStudents(students.map(s => s._id))
                                                    }
                                                }}
                                            >
                                                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedStudents.length === students.length
                                                    ? 'bg-primary border-primary'
                                                    : selectedStudents.length > 0
                                                        ? 'bg-primary/50 border-primary/50'
                                                        : 'border-white/20'
                                                    }`}>
                                                    {selectedStudents.length > 0 && <CheckCircle2 size={12} className="text-white" />}
                                                </div>
                                                <span className="text-xs font-black text-slate-300 uppercase tracking-widest">
                                                    Select All ({students.length})
                                                </span>
                                            </div>

                                            {/* Student list */}
                                            <div className="max-h-48 overflow-y-auto">
                                                {pickerStudents.length === 0 ? (
                                                    <div className="px-4 py-6 text-center text-xs text-slate-600 font-black uppercase tracking-widest">No students found</div>
                                                ) : (
                                                    pickerStudents.map(student => {
                                                        const isSelected = selectedStudents.includes(student._id)
                                                        return (
                                                            <div
                                                                key={student._id}
                                                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isSelected ? 'bg-primary/10' : 'hover:bg-white/5'}`}
                                                                onClick={() => toggleStudentSelection(student._id)}
                                                            >
                                                                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'bg-primary border-primary' : 'border-white/20'}`}>
                                                                    {isSelected && <CheckCircle2 size={12} className="text-white" />}
                                                                </div>
                                                                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center text-sm font-black text-white flex-shrink-0">
                                                                    {student.fullName.charAt(0)}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-bold text-white truncate">{student.fullName}</p>
                                                                    <p className="text-[10px] text-slate-500 truncate">{student.email}</p>
                                                                </div>
                                                                <div className="ml-auto flex items-center gap-1">
                                                                    <Award size={11} className="text-yellow-400" />
                                                                    <span className="text-xs font-black text-slate-400">{student.points}</span>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4 mt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => { setShowTaskForm(false); setEditingTask(null) }}
                                        className="flex-1 rounded-2xl h-14 border-white/5 hover:bg-white/5 text-slate-400 font-black uppercase tracking-widest text-xs"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={assignMode === 'specific' && selectedStudents.length === 0}
                                        className="flex-1 rounded-2xl h-14 bg-primary hover:bg-emerald-600 border-0 shadow-2xl shadow-primary/20 text-white font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {editingTask ? 'Update Quest' : 'Launch Quest'}
                                        {assignMode === 'specific' && selectedStudents.length > 0 && (
                                            <span className="ml-2 bg-white/20 rounded-full px-2 py-0.5 text-[10px]">
                                                {selectedStudents.length}
                                            </span>
                                        )}
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

/* ──────────────────────────────────────────────── */
/* Pending Submission Card                          */
/* ──────────────────────────────────────────────── */
interface PendingCardProps {
    sub: Submission
    feedback: string
    onFeedbackChange: (v: string) => void
    onApprove: () => void
    onReject: () => void
}

function PendingCard({ sub, feedback, onFeedbackChange, onApprove, onReject }: PendingCardProps) {
    return (
        <Card className="glass border-white/5 bg-[#0F172A] shadow-2xl rounded-[2rem] overflow-hidden hover:border-amber-500/20 transition-all group">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-primary font-black border border-white/5 group-hover:bg-primary/10 transition-colors text-sm flex-shrink-0">
                            {sub.studentId.fullName.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white tracking-tight group-hover:text-primary transition-colors line-clamp-1">{sub.taskId.title}</h3>
                            <p className="text-[11px] font-black text-primary uppercase tracking-widest">{sub.studentId.fullName}</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg border border-white/5 flex-shrink-0">
                        {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 mb-4 relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-full opacity-40" />
                    <p className="text-slate-300 font-medium italic leading-relaxed text-sm pl-3 line-clamp-3">"{sub.content}"</p>
                    {sub.proofUrl && (
                        <a href={sub.proofUrl} target="_blank" rel="noreferrer" className="text-[10px] text-primary font-black uppercase tracking-widest mt-3 inline-flex items-center gap-1.5 hover:bg-primary/10 px-3 py-1.5 rounded-xl transition-all border border-primary/20 ml-3">
                            View Evidence <ArrowRight size={11} />
                        </a>
                    )}
                </div>

                <div className="mb-4">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                        <MessageSquare size={10} className="text-primary" /> Feedback
                    </label>
                    <textarea
                        className="w-full p-4 bg-white/5 border border-white/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-white placeholder:text-slate-700 font-medium h-16 resize-none transition-all"
                        placeholder="Great job!..."
                        value={feedback}
                        onChange={e => onFeedbackChange(e.target.value)}
                    />
                </div>

                <div className="flex gap-3">
                    <Button onClick={onApprove} size="lg" className="bg-primary hover:bg-emerald-600 rounded-2xl flex-1 h-11 font-black uppercase tracking-widest text-xs border-0 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
                        <CheckCircle2 size={16} className="mr-1.5" /> Approve
                    </Button>
                    <Button onClick={onReject} size="lg" variant="outline" className="text-red-400 border-white/5 hover:bg-red-500/10 rounded-2xl flex-1 h-11 font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02]">
                        <XCircle size={16} className="mr-1.5" /> Reject
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

/* ──────────────────────────────────────────────── */
/* Completed Submission Card                        */
/* ──────────────────────────────────────────────── */
function CompletedCard({ sub }: { sub: Submission }) {
    const isApproved = sub.status === 'approved'
    return (
        <Card className={`border-white/5 bg-[#0F172A] shadow-xl rounded-[2rem] overflow-hidden transition-all group ${isApproved ? 'hover:border-emerald-500/20' : 'hover:border-red-500/20'}`}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black border border-white/5 text-sm flex-shrink-0 ${isApproved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {sub.studentId.fullName.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white tracking-tight line-clamp-1">{sub.taskId.title}</h3>
                            <p className={`text-[11px] font-black uppercase tracking-widest ${isApproved ? 'text-emerald-400' : 'text-red-400'}`}>
                                {sub.studentId.fullName}
                            </p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border flex-shrink-0 ${isApproved
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                        {isApproved ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                        {isApproved ? 'Approved' : 'Rejected'}
                    </div>
                </div>

                <p className="text-sm text-slate-500 italic line-clamp-2 mb-3">"{sub.content}"</p>

                {sub.feedback && (
                    <div className={`text-xs p-3 rounded-xl border ${isApproved ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-300' : 'bg-red-500/5 border-red-500/10 text-red-300'}`}>
                        <span className="font-black uppercase tracking-widest text-[9px] block mb-1">Teacher Feedback</span>
                        {sub.feedback}
                    </div>
                )}

                <div className="mt-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    {new Date(sub.createdAt).toLocaleDateString()}
                </div>
            </CardContent>
        </Card>
    )
}
