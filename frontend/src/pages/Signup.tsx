import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import API_URL from '../config/api'

export default function Signup() {
    const [role, setRole] = useState<'student' | 'teacher'>('student')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const response = await axios.post(`${API_URL}/api/auth/signup`, {
                fullName,
                email,
                password,
                role
            })
            login(response.data.token, response.data.user)
            navigate(response.data.user.role === 'teacher' ? '/teacher' : '/dashboard')
        } catch (err: any) {
            setError(err.response?.data?.error || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-primary/30">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#10B98110,transparent_50%)]" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,#0EA5E910,transparent_50%)]" />

            <Link to="/" className="flex items-center gap-2 mb-12 relative z-10">
                <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20">
                    <Leaf className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-bold font-heading text-white">EcoPulse</span>
            </Link>

            <Card className="w-full max-w-md relative z-10 border-white/5 shadow-2xl bg-[#0F172A]">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-black text-white tracking-tight leading-none mb-2">Start Your Journey</CardTitle>
                    <CardDescription className="text-slate-400 font-medium">Join the mission to save our planet through action.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex p-1.5 bg-[#010413] rounded-2xl mb-8 border border-white/5">
                        <button
                            onClick={() => setRole('student')}
                            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === 'student' ? 'bg-primary shadow-lg text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            I'm a Student
                        </button>
                        <button
                            onClick={() => setRole('teacher')}
                            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${role === 'teacher' ? 'bg-primary shadow-lg text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            I'm a Teacher
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm mb-6 border border-red-500/10 font-bold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSignup}>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="Alex Eco"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="w-full px-5 py-3.5 rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all bg-[#010413] text-white placeholder:text-slate-600 font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="alex@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-5 py-3.5 rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all bg-[#010413] text-white placeholder:text-slate-600 font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-5 py-3.5 rounded-xl border border-white/5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all bg-[#010413] text-white placeholder:text-slate-600 font-medium"
                            />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full h-14 rounded-xl text-lg font-black mt-4 bg-gradient-to-r from-primary to-emerald-600 shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all text-white border-0">
                            {loading ? 'Creating account...' : 'Create Account'}
                            <ArrowRight size={20} className="ml-2" />
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500 font-medium">
                        Already have an account? <Link to="/login" className="text-primary font-black hover:text-emerald-400 transition-colors ml-1 underline decoration-primary/20 underline-offset-4">Log In</Link>
                    </div>
                </CardContent>
            </Card>

            <p className="mt-8 text-slate-600 text-[10px] font-black uppercase leading-relaxed tracking-widest text-center max-w-xs px-4">
                By joining, you agree to our Terms and are ready to save the planet.
            </p>
        </div>
    )
}
