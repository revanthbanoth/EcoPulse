import { Link } from 'react-router-dom'
import { Leaf, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { user, token, logout } = useAuth()

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 glass px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary p-2 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
                        <Leaf className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold font-heading bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
                        EcoPulse
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    {token && user && (
                        <>
                            <Link to={user.role === 'teacher' ? "/teacher" : "/dashboard"} className="hover:text-primary transition-colors">Dashboard</Link>
                            <Link to="/profile" className="hover:text-primary transition-colors">Profile</Link>
                        </>
                    )}
                    <Link to="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link>
                    <Link to="/how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
                </div>

                <div className="flex items-center gap-4">
                    {token && user && (
                        <div className="flex items-center gap-4 border-l border-white/10 pl-4 ml-2">
                            <div className="flex flex-col items-end mr-1">
                                <span className="text-xs font-black text-slate-100 whitespace-nowrap">{user.fullName}</span>
                                <span className="text-[10px] font-black text-primary uppercase tracking-tighter">{user.role}</span>
                            </div>
                            <button
                                onClick={() => {
                                    logout()
                                    window.location.href = '/'
                                }}
                                className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all border border-white/10 hover:border-red-500/20 group shadow-sm"
                                title="Log Out"
                            >
                                <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
