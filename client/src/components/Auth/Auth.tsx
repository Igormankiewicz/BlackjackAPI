import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'

interface AuthProps {
    mode: 'login' | 'register'
}

const Auth: React.FC<AuthProps> = ({ mode }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const endpoint = mode === 'login' ? '/login' : '/register'
        
        try {
            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            })

            const data = await response.json()

            if (response.ok) {
                // Store user info in localStorage for session persistence
                localStorage.setItem('user', JSON.stringify(data.user))
                alert(mode === 'login' ? 'Welcome back!' : 'Account created!')
                navigate('/docs') // Move to Docs after success
            } else {
                setError(data.error || 'Something went wrong')
            }
        } catch (err) {
            setError('Server connection failed. Is your Node server running?')
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{mode === 'login' ? 'BlackJack Login' : 'Create Account'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    {error && <p className="error-msg">{error}</p>}
                    <button type="submit" className="auth-btn">
                        {mode === 'login' ? 'Login' : 'Register'}
                    </button>
                </form>
                <div className="auth-footer">
                    {mode === 'login' ? (
                        <p>New player? <Link to="/register">Register here</Link></p>
                    ) : (
                        <p>Already have an account? <Link to="/login">Login here</Link></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;