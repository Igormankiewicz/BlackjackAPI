import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css';

interface User {
    id: number;
    name: string;
}

const Menu = () => {
    const [user, setUser] = useState<User | null>(null);
    const [rooms, setRooms] = useState<any[]>([]); // This would be fetched from DB
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve user info saved during login/register
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            navigate('/login'); // Redirect if not logged in
        }
    }, [navigate]);

    return (
        <div className="menu-container">
            {/* Navigation Bar */}
            <nav className="top-nav">
                <div className="nav-logo">BlackJack<span>API</span></div>
                <div className="nav-actions">
                    <button className="nav-link-btn" onClick={() => navigate('/docs')}>Docs</button>
                    <div className="user-profile">
                        <span className="user-label">Player:</span>
                        <span className="user-name">{user?.name || 'Guest'}</span>
                    </div>
                </div>
            </nav>

            <main className="menu-content">
                <header className="menu-header">
                    <h2>Game Lobby</h2>
                    <button className="create-room-btn">+ Create New Room</button>
                </header>

                <div className="room-list-container">
                    <h3>Active Rooms</h3>
                    <div className="room-grid">
                        {/* Placeholder for actual room data */}
                        <div className="room-card">
                            <div className="room-info">
                                <span className="room-id">Room #102</span>
                                <span className="room-status">2/3 Players</span>
                            </div>
                            <button className="join-btn">Join Table</button>
                        </div>
                        
                        <div className="room-card empty">
                            <p>No other active rooms found.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Menu;