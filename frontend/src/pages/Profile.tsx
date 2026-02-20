import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import {
    User as UserIcon,
    Mail,
    Calendar,
    Trophy,
    Flame,
    Settings,
    Shield,
    Leaf,
    Clock,
    ArrowRight
} from 'lucide-react'
import axios from 'axios'
import API_URL from '../config/api'

export default function Profile() {
    const { user, token } = useAuth()
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } }
                const res = await axios.get(`${API_URL}/api/profiles/stats`, config)
                setStats(res.data)
            } catch (err) {
                console.error('Failed to fetch stats', err)
            } finally {
                setLoading(false)
            }
        }
        if (token) fetchStats()
    }, [token])

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-primary/30">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-12 relative">
                <Link to={user?.role === 'teacher' ? '/teacher' : '/dashboard'} className="inline-flex mb-8">
                    <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl gap-2 font-black uppercase tracking-widest text-[10px] border border-white/5 h-10 px-4">
                        <ArrowRight size={14} className="rotate-180" /> Back to Dashboard
                    </Button>
                </Link>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    {/* Left Column: User Info */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="glass border-white/5 bg-white/5 shadow-2xl overflow-hidden rounded-[2.5rem]">
                            <div className="h-24 bg-gradient-to-r from-primary to-emerald-600 opacity-80"></div>
                            <CardContent className="pt-0 relative -mt-12 text-center">
                                <div className="w-24 h-24 rounded-[2rem] bg-background p-1 shadow-2xl mx-auto mb-4 border border-white/5">
                                    <div className="w-full h-full rounded-[1.75rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                        <UserIcon size={48} />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-black text-white tracking-tight leading-tight">{user?.fullName}</h2>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1 mb-6">
                                    {user?.role} • Level {user?.level}
                                </p>
                                <Button variant="outline" size="sm" className="w-full rounded-2xl gap-2 border-white/5 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest h-11">
                                    <Settings size={14} /> Edit Profile
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="glass border-white/5 bg-white/5 shadow-xl rounded-[2rem]">
                            <CardContent className="p-6 space-y-5">
                                <div className="flex items-center gap-4 text-slate-400 group">
                                    <div className="bg-primary/10 p-2 rounded-lg border border-primary/10 group-hover:bg-primary/20 transition-colors">
                                        <Mail size={18} className="text-primary" />
                                    </div>
                                    <span className="text-sm font-medium truncate">{user?.email}</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-400 group">
                                    <div className="bg-accent/10 p-2 rounded-lg border border-accent/10 group-hover:bg-accent/20 transition-colors">
                                        <Shield size={18} className="text-accent" />
                                    </div>
                                    <span className="text-[10px] uppercase font-black tracking-widest">Verified Account</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-400 group">
                                    <div className="bg-secondary/10 p-2 rounded-lg border border-secondary/10 group-hover:bg-secondary/20 transition-colors">
                                        <Calendar size={18} className="text-secondary" />
                                    </div>
                                    <span className="text-sm font-medium">Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Achievements & Activity */}
                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3 tracking-tight">
                                <div className="bg-amber-500/20 p-2 rounded-xl border border-amber-500/20">
                                    <Trophy className="text-amber-500 w-5 h-5 shadow-lg shadow-amber-500/20" />
                                </div>
                                Impact Overview
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <Card className="border-white/5 bg-[#0F172A] shadow-xl rounded-[2.5rem]">
                                    <CardContent className="p-8">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Total Points</p>
                                        <p className="text-4xl font-black text-white tracking-tighter">{user?.points}</p>
                                        <div className="mt-4 inline-flex items-center gap-1.5 text-[9px] text-primary font-black uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-lg border border-primary/10">
                                            <Leaf size={10} className="fill-current" /> Top 15% rank
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-white/5 bg-[#0F172A] shadow-xl rounded-[2.5rem]">
                                    <CardContent className="p-8">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Current Streak</p>
                                        <div className="flex items-center gap-3">
                                            <p className="text-4xl font-black text-amber-500 tracking-tighter">{user?.streak}</p>
                                            <div className="bg-amber-500/20 p-1.5 rounded-lg border border-amber-500/20">
                                                <Flame className="text-amber-500 w-5 h-5 shadow-lg shadow-amber-500/40" />
                                            </div>
                                        </div>
                                        <p className="mt-4 text-[9px] text-slate-600 font-black uppercase tracking-widest">Days Active</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <Card className="border-white/5 bg-[#0F172A] shadow-2xl rounded-[3rem] overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl font-black tracking-tight text-white">
                                    <div className="bg-secondary/20 p-2 rounded-xl">
                                        <Clock className="text-secondary w-5 h-5" />
                                    </div>
                                    Recent Activity
                                </CardTitle>
                                <CardDescription className="text-slate-500 font-medium">Your latest environmental contributions</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {loading ? (
                                    <div className="p-16 text-center animate-pulse text-[10px] font-black uppercase tracking-[0.4em] text-slate-800">Calculating impact...</div>
                                ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
                                    stats.recentActivity.map((act: any) => (
                                        <div key={act._id} className="p-6 border-b border-white/5 last:border-0 flex justify-between items-center group hover:bg-white/5 transition-all">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-lg shadow-primary/5">
                                                    <Leaf size={22} className="fill-current" />
                                                </div>
                                                <div>
                                                    <p className="text-base font-bold text-white group-hover:text-primary transition-colors tracking-tight">{act.taskId?.title || 'Unknown Quest'}</p>
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{new Date(act.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-lg font-black text-primary tracking-tighter">+{act.pointsAwarded || 0}</span>
                                                <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Points</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-20 text-center text-slate-800 text-[10px] font-black uppercase tracking-[0.6em] italic">
                                        No entries found
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
