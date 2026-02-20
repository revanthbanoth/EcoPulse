import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

interface User {
    id: string
    fullName: string
    email: string
    role: 'student' | 'teacher'
    points: number
    level: number
    streak: number
    createdAt?: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    login: (token: string, user: User) => void
    logout: () => void
    refreshUser: () => Promise<void>
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const login = (newToken: string, newUser: User) => {
        setToken(newToken)
        setUser(newUser)
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(newUser))
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    const refreshUser = async () => {
        const currentToken = localStorage.getItem('token') || token
        if (!currentToken) return

        try {
            const response = await axios.get('http://localhost:5000/api/auth/me', {
                headers: { Authorization: `Bearer ${currentToken}` }
            })
            const updatedUser = response.data.user
            setUser(updatedUser)
            localStorage.setItem('user', JSON.stringify(updatedUser))
        } catch (err) {
            console.error('Failed to refresh user', err)
        }
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
