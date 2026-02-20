import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Leaf, Award, Map, Info, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../config/api'

interface Task {
    _id: string
    title: string
    description: string
    category: 'Waste' | 'Biodiversity' | 'Water' | 'Energy'
    difficulty: 'Easy' | 'Medium' | 'Hard'
    pointsBase: number
}

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/tasks`)
                setTasks(res.data)
            } catch (err) {
                console.error('Failed to fetch tasks', err)
            } finally {
                setLoading(false)
            }
        }
        fetchTasks()
    }, [])

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold font-heading text-emerald-950 mb-2 flex items-center gap-3">
                            <Map className="text-primary" /> Discovery Map
                        </h1>
                        <p className="text-slate-500 font-body">Explore all active ecological missions and pick your next quest.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-sm font-bold text-slate-600">{tasks.length} Active Quests</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-64 bg-white rounded-2xl animate-pulse border border-slate-100" />
                        ))
                    ) : tasks.length > 0 ? (
                        tasks.map((task) => (
                            <Card key={task._id} className="group hover:-translate-y-2 transition-all duration-300 border-white/60 shadow-sm hover:shadow-xl overflow-hidden">
                                <CardContent className="p-0">
                                    <div className={`h-3 bg-gradient-to-r ${task.category === 'Waste' ? 'from-orange-400 to-orange-600' :
                                        task.category === 'Energy' ? 'from-amber-400 to-amber-600' :
                                            task.category === 'Water' ? 'from-blue-400 to-blue-600' :
                                                'from-emerald-400 to-emerald-600'
                                        }`}></div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${task.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                task.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {task.difficulty}
                                            </div>
                                            <div className="text-primary font-black flex items-center gap-1">
                                                <Award size={16} />
                                                +{task.pointsBase}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-emerald-950 mb-2 group-hover:text-primary transition-colors">{task.title}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-3 mb-6 min-h-[60px]">{task.description}</p>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                <Leaf size={12} className="text-primary" /> {task.category}
                                            </span>
                                            <Link to="/dashboard">
                                                <Button size="sm" variant="ghost" className="text-primary font-bold hover:bg-emerald-50 rounded-lg group/btn">
                                                    Check Details <ArrowRight size={14} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <Info size={48} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-400 italic">No quests found at the moment. Check back later!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
