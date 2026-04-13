import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

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
            const response = await fetch(`http://${window.location.hostname}:3000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user))
                navigate('/menu')
            } else {
                setError(data.error || 'Access Denied')
            }
        } catch (err) {
            setError('Connection refused. Check backend.')
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-title">BlackJackAPI</span>
                    <h2 className="auth-subtitle">{mode === 'login' ? 'System Login' : 'User Registration'}</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label className="input-label">Username</label>
                        <input 
                            type="text" 
                            className="auth-input"
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="Enter credentials..."
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input 
                            type="password" 
                            className="auth-input"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="••••••••"
                            required 
                        />
                    </div>
                    
                    {error && <div className="error-banner">{error}</div>}
                    
                    <button type="submit" className="submit-btn">
                        {mode === 'login' ? 'Authenticate' : 'Initialize Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    {mode === 'login' ? (
                        <p>New user detected? <Link to="/register" className="auth-link">Register</Link></p>
                    ) : (
                        <p>Credentials exist? <Link to="/login" className="auth-link">Login</Link></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;