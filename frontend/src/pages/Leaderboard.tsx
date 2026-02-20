import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Button } from '../components/ui/Button'
import { Trophy, Star, TrendingUp, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import API_URL from '../config/api'

interface LeaderboardUser {
    _id: string
    fullName: string
    points: number
    level: number
    avatarUrl?: string
}

export default function Leaderboard() {
    const { user: currentUser } = useAuth()
    const [users, setUsers] = useState<LeaderboardUser[]>([])
    const [loading, setLoading] = useState(true)

    const dashboardLink = currentUser?.role === 'teacher' ? '/teacher' : currentUser ? '/dashboard' : '/'
    const backLabel = currentUser ? 'Back to Dashboard' : 'Back to Home'

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/profiles/leaderboard`)
                setUsers(response.data)
            } catch (err) {
                console.error('Failed to fetch leaderboard', err)
            } finally {
                setLoading(false)
            }
        }
        fetchLeaderboard()
    }, [])

    const topThree = users.slice(0, 3)
    const theRest = users.slice(3)

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-primary/30">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-12">
                {/* Header & Back Button */}
                <div className="flex items-center justify-between mb-16 relative">
                    <Link to={dashboardLink}>
                        <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl gap-2 font-black uppercase tracking-widest text-[10px] border border-white/5 h-10 px-4">
                            <ArrowRight size={16} className="rotate-180" /> {backLabel}
                        </Button>
                    </Link>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                </div>

                {/* Page Title */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-3 mb-6 bg-white/5 px-6 py-3 rounded-full border border-white/5 backdrop-blur-md"
                    >
                        <Trophy className="text-amber-500 w-8 h-8" />
                        <h1 className="font-black font-heading text-white uppercase tracking-[0.4em] text-xs">Eco Hall of Fame</h1>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        <div className="h-96 bg-white/5 rounded-[3rem] animate-pulse border border-white/5 mb-12" />
                        {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : users.length > 0 ? (
                    <>
                        {/* Podium Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-end">
                            {/* 2nd Place */}
                            {topThree[1] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="order-2 md:order-1"
                                >
                                    <PodiumCard user={topThree[1]} rank={2} color="slate-400" />
                                </motion.div>
                            )}

                            {/* 1st Place */}
                            {topThree[0] && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="order-1 md:order-2"
                                >
                                    <PodiumCard user={topThree[0]} rank={1} color="amber-500" isLarge />
                                </motion.div>
                            )}

                            {/* 3rd Place */}
                            {topThree[2] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="order-3 md:order-3"
                                >
                                    <PodiumCard user={topThree[2]} rank={3} color="orange-500" />
                                </motion.div>
                            )}
                        </div>

                        {/* List Section */}
                        <div className="bg-[#0F172A] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                            <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-[#010413]">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Rank & Name</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-6">Total Points</span>
                            </div>
                            <div className="divide-y divide-white/5">
                                {theRest.map((u, i) => (
                                    <motion.div
                                        key={u._id}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <span className="w-10 text-xl font-black text-slate-700 group-hover:text-primary transition-colors">#{i + 4}</span>
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-black border border-white/5 text-primary">
                                                {u.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white group-hover:text-primary transition-colors">{u.fullName}</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Level {u.level}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end px-6">
                                            <span className="text-2xl font-black text-primary tracking-tighter">{u.points}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-32 rounded-[3.5rem] border-2 border-dashed border-white/5 bg-[#0F172A]">
                        <Trophy className="w-16 h-16 text-slate-800 mx-auto mb-6 opacity-20" />
                        <p className="text-slate-600 font-black uppercase tracking-[0.4em]">No ecological legends yet</p>
                    </div>
                )}
            </main>
        </div>
    )
}

function PodiumCard({ user, rank, color, isLarge = false }: { user: LeaderboardUser, rank: number, color: string, isLarge?: boolean }) {
    const colorClasses: { [key: string]: any } = {
        'amber-500': {
            bg: 'bg-amber-500/20',
            border: 'border-amber-500/40',
            text: 'text-amber-500',
            borderFull: 'border-amber-500'
        },
        'slate-400': {
            bg: 'bg-slate-400/20',
            border: 'border-slate-400/40',
            text: 'text-slate-400',
            borderFull: 'border-slate-400'
        },
        'orange-500': {
            bg: 'bg-orange-500/20',
            border: 'border-orange-500/40',
            text: 'text-orange-500',
            borderFull: 'border-orange-500'
        }
    }

    const theme = colorClasses[color]

    return (
        <div className={`relative flex flex-col items-center ${isLarge ? 'z-20' : 'z-10'}`}>
            {/* Avatar Section */}
            <div className={`relative mb-6 ${isLarge ? 'w-32 h-32' : 'w-24 h-24'}`}>
                <div className={`absolute inset-0 rounded-[2.5rem] ${theme.bg} animate-pulse blur-xl`} />
                <div className={`relative w-full h-full rounded-[2rem] bg-[#0F172A] border-2 ${theme.border} flex items-center justify-center text-3xl font-black ${theme.text} shadow-2xl`}>
                    {user.fullName.charAt(0)}
                    <div className={`absolute -top-4 -right-4 w-10 h-10 rounded-full bg-[#0F172A] border-2 ${theme.borderFull} flex items-center justify-center shadow-xl`}>
                        <span className={`${theme.text} font-black text-sm`}>{rank}</span>
                    </div>
                </div>
            </div>

            {/* Name & Stats */}
            <div className={`w-full bg-gradient-to-b from-[#0F172A] to-transparent p-6 rounded-[2.5rem] border border-white/5 text-center backdrop-blur-xl ${isLarge ? 'pt-12 -mt-10' : 'pt-8 -mt-8'}`}>
                <h3 className={`font-black text-white tracking-tight mb-2 ${isLarge ? 'text-2xl' : 'text-xl'}`}>{user.fullName}</h3>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl font-black text-primary tracking-tighter">{user.points}</span>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Points</span>
                </div>

                <div className="mt-6 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                        <Star size={12} className="text-amber-500 fill-amber-500" /> TOP
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                        <TrendingUp size={12} className="text-primary" /> LVL {user.level}
                    </span>
                </div>
            </div>
        </div>
    )
}
