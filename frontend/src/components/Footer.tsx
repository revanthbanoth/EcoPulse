import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'

interface FooterProps {
    minimal?: boolean
}

export default function Footer({ minimal = false }: FooterProps) {
    return (
        <footer className={`px-6 border-t border-white/5 bg-[#010413] relative overflow-hidden ${minimal ? 'py-12' : 'py-24'}`}>
            {/* Ambient Background Gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            {!minimal && <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />}

            <div className="max-w-7xl mx-auto flex flex-col items-center gap-12 relative z-10">
                {!minimal && (
                    <>
                        {/* Brand Section */}
                        <Link to="/" className="flex items-center gap-3 group px-8 py-4 rounded-[2rem] bg-white/5 border border-white/5 shadow-2xl hover:bg-white/10 transition-all">
                            <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                                <Leaf className="text-white w-8 h-8" />
                            </div>
                            <span className="font-black font-heading text-3xl text-white tracking-tighter">EcoPulse</span>
                        </Link>

                        {/* Navigation Links (Secondary) */}
                        <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                            <Link to="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link>
                            <Link to="/how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
                            <Link to="/signup" className="hover:text-primary transition-colors">Join the Tribe</Link>
                        </div>
                    </>
                )}

                <div className={`text-center w-full max-w-sm ${!minimal ? 'pt-8 border-t border-white/5' : ''}`}>
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-slate-500 text-[11px] font-medium tracking-wide">
                            © 2026 EcoPulse Platform
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 whitespace-nowrap">
                            Developed by <span className="text-white tracking-normal">B <span className="text-primary italic text-[11px]">Revanth</span></span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
