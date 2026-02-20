import { Map, User as UserIcon, Trophy, Camera, Leaf, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export default function HowItWorksPage() {
    const { user } = useAuth()
    const dashboardLink = user?.role === 'teacher' ? '/teacher' : user ? '/dashboard' : '/'
    const backLabel = user ? 'Back' : 'Home'
    const steps = [
        {
            step: '01',
            title: 'Join the Tribe',
            desc: 'Create your account and join your school or local team. Connect with like-minded eco-warriors and start your journey.',
            icon: UserIcon,
            color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000'
        },
        {
            step: '02',
            title: 'Choose a Quest',
            desc: 'Select from hundreds of eco-challenges tailored for you. From energy audits to community gardens, find what inspires you.',
            icon: Map,
            color: 'bg-amber-50 text-amber-600 border-amber-100',
            image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1000'
        },
        {
            step: '03',
            title: 'Log Action',
            desc: 'Real impact needs real proof. Submit photos or evidence of your completed task to verify your contribution.',
            icon: Camera,
            color: 'bg-sky-50 text-sky-600 border-sky-100',
            image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=1000'
        },
        {
            step: '04',
            title: 'Level Up',
            desc: 'Earn points for every action, climb the global leaderboard, and unlock exclusive rewards as you save the planet.',
            icon: Trophy,
            color: 'bg-purple-50 text-purple-600 border-purple-100',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000'
        }
    ]

    return (
        <main className="min-h-screen bg-[#020617] text-slate-100 relative">
            <Navbar />

            <header className="py-24 px-6 bg-slate-900/30 border-b border-white/5 overflow-hidden relative">
                <Link to={dashboardLink} className="absolute top-8 left-8 z-20">
                    <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl gap-2 font-black uppercase tracking-widest text-[10px] border border-white/5 h-10 px-4">
                        <ArrowRight size={14} className="rotate-180" /> {backLabel}
                    </Button>
                </Link>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 opacity-30" />
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8"
                    >
                        <Leaf size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">The Ultimate Guide</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black font-heading text-white mb-8 tracking-tight leading-tight"
                    >
                        How <span className="text-primary italic">EcoPulse</span> <br />
                        Saves the Planet
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-2xl font-body leading-relaxed font-medium"
                    >
                        Our mission is to make environmental action addictive. Follow our simple roadmap to transform your daily habits into a global movement.
                    </motion.p>
                </div>
            </header>

            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="space-y-12">
                        {steps.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 p-8 md:p-16 bg-[#0F172A] rounded-[3rem] border border-white/5 shadow-2xl hover:border-primary/20 transition-all group relative overflow-hidden`}
                            >
                                <div className="flex-1 space-y-6 relative z-10">
                                    <div className={`w-20 h-20 rounded-3xl ${item.color.replace('bg-', 'bg-opacity-10 bg-').replace('text-', 'text-opacity-100 text-')} flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform shadow-lg`}>
                                        <item.icon size={36} />
                                    </div>
                                    <div className="space-y-4">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Step {item.step}</span>
                                        <h2 className="text-4xl font-black text-white tracking-tight">{item.title}</h2>
                                        <p className="text-lg text-slate-400 font-body leading-relaxed font-medium">{item.desc}</p>
                                    </div>
                                </div>
                                <div className="flex-1 w-full h-80 rounded-[2rem] overflow-hidden relative shadow-2xl border border-white/5 bg-[#010413]">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80 brightness-[0.7] contrast-[1.1] saturate-[0.8]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                                    <div className="absolute inset-0 bg-[#020617]/20 group-hover:bg-transparent transition-colors duration-700" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 text-center bg-slate-900/30 border-t border-white/5">
                <div className="max-w-4xl mx-auto space-y-12">
                    <h2 className="text-4xl font-black text-white tracking-tight">Ready to start your first quest?</h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link to="/signup">
                            <Button size="lg" className="rounded-full px-12 text-xl font-bold bg-primary shadow-xl shadow-primary/20 hover:scale-105 transition-all text-white border-0">
                                Join Now
                                <ArrowRight className="ml-2" />
                            </Button>
                        </Link>
                        <Link to="/leaderboard">
                            <Button variant="outline" size="lg" className="rounded-full px-12 text-xl font-bold border-white/10 text-white hover:bg-white/5">
                                See Leaderboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    )
}
