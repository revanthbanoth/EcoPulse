import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import {
    ArrowRight,
    Award,
    Globe,
    Recycle,
    Zap,
    Droplets,
    TreePine
} from 'lucide-react'

export default function Home() {

    return (
        <main className="min-h-screen text-slate-100 bg-[#020617] selection:bg-primary/30 relative">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-6 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 -z-10 blur-[120px] rounded-full opacity-30" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/5 -z-10 blur-[100px] rounded-full opacity-20" />

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 bg-white/5 text-primary border border-primary/20 px-4 py-2 rounded-full mb-8 animate-bounce backdrop-blur-md">
                        <Award size={18} />
                        <span className="text-sm font-semibold tracking-wide">Join over 10,000+ eco-warriors</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black font-heading mb-6 tracking-tight leading-[1.1] text-white">
                        Turn your <span className="text-primary italic">Action</span> <br />
                        into <span className="text-secondary underline decoration-secondary/30">Impact</span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mb-12 font-body font-medium leading-relaxed">
                        The gamified platform that makes environmental action addictive. Complete tasks,
                        earn points, and compete with your class to save the planet.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/signup">
                            <Button size="lg" className="rounded-full px-12 text-xl group bg-gradient-to-r from-primary to-emerald-600 shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all text-white border-0">
                                Start Questing
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link to="/how-it-works">
                            <Button variant="outline" size="lg" className="rounded-full px-12 text-xl border-white/10 text-white hover:bg-white/5 transition-all cursor-pointer backdrop-blur-sm">
                                See it in action
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center gap-6 relative z-10">
                        <Link to="/login">
                            <Button variant="outline" className="rounded-full px-8 border-white/10 hover:border-primary/50 text-slate-300 font-bold transition-all bg-white/5">
                                Log In
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="primary" className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all border-0">
                                Join EcoPulse
                            </Button>
                        </Link>
                    </div>

                    {/* Stats/Showcase */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 w-full">
                        {([
                            { label: 'CO2 Saved', value: '1,240kg', icon: Globe, color: 'text-emerald-400' },
                            { label: 'Waste Recycled', value: '850kg', icon: Recycle, color: 'text-sky-400' },
                            { label: 'Energy Conserved', value: '420kW', icon: Zap, color: 'text-amber-400' },
                            { label: 'Schools Joined', value: '45+', icon: Award, color: 'text-purple-400' },
                        ] as const).map((stat, i) => (
                            <Card key={i} className="glass border-white/5 hover:scale-105 transition-transform cursor-pointer bg-white/5">
                                <CardContent className="p-6 flex flex-col items-center gap-2">
                                    <stat.icon className={`${stat.color} mb-2 w-8 h-8`} />
                                    <span className="text-3xl font-bold font-heading text-white">{stat.value}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Quests */}
            <section className="bg-slate-900/50 py-24 px-6 border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl font-bold font-heading mb-4 text-white">Active Eco-Quests</h2>
                            <p className="text-slate-400 font-body font-medium">Complete these challenges to earn huge point bonuses this week!</p>
                        </div>
                        <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10">View all quests <ArrowRight size={18} className="ml-2" /></Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <QuestCard
                            title="Plastic-Free Water"
                            points={500}
                            category="Water"
                            difficulty="Medium"
                            image="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1000"
                            icon={Droplets}
                        />
                        <QuestCard
                            title="Home Energy Audit"
                            points={350}
                            category="Energy"
                            difficulty="Easy"
                            image="https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=1000"
                            icon={Zap}
                        />
                        <QuestCard
                            title="Plant a School Garden"
                            points={1200}
                            category="Biodiversity"
                            difficulty="Hard"
                            image="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1000"
                            icon={TreePine}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-emerald-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-primary/20 border border-white/10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full -ml-32 -mb-32 blur-3xl opacity-30" />

                    <h2 className="text-4xl md:text-5xl font-black font-heading mb-8 relative z-10 leading-tight">Ready to become an <br /> Eco-Legend?</h2>
                    <p className="text-xl text-white/80 mb-12 relative z-10 font-body font-medium">
                        Join your school's team today and start competing for the crown while making a real difference.
                    </p>
                    <div className="flex justify-center gap-4 relative z-10">
                        <Link to="/signup">
                            <Button size="lg" variant="primary" className="rounded-full text-xl px-12 bg-white text-primary border-0 hover:bg-slate-100">Sign Up Now</Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}

function QuestCard({ title, points, category, difficulty, image, icon: Icon }: { title: string, points: number, category: string, difficulty: string, image: string, icon?: any }) {
    return (
        <Card className="group hover:-translate-y-2 transition-all duration-500 bg-[#0F172A] border-white/5 overflow-hidden shadow-2xl">
            <div className="h-48 overflow-hidden relative bg-[#010413]">
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-80 brightness-[0.7] contrast-[1.1] saturate-[0.9]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 left-4 bg-primary/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/30 z-10">
                    {category}
                </div>
            </div>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors text-white flex items-center gap-2">
                        {Icon && <Icon size={20} className="text-primary" />}
                        {title}
                    </h3>
                    <span className="text-primary font-black">+{points}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
                    <span className={`px-2 py-1 rounded-md ${difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                        {difficulty}
                    </span>
                    <span className="text-slate-600 tracking-tighter">•</span>
                    <span className="text-slate-500">7 days left</span>
                </div>
            </CardContent>
        </Card>
    )
}
