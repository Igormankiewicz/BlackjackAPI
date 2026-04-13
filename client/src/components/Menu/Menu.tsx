import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css';

interface User {
    id: number;
    name: string;
}

interface Room {
    id: number;
    player_count: number;
}

const Menu = () => {
    const [user, setUser] = useState<User | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Added to manage initialization
    const navigate = useNavigate();

    useEffect(() => {
        const initialize = async () => {
            const savedUser = localStorage.getItem('user');
            
            // Check if user exists once at the start
            if (savedUser && savedUser !== "undefined") {
                try {
                    const parsed = JSON.parse(savedUser);
                    setUser(parsed);
                    // Fetch rooms immediately after confirming user
                    await fetchRooms();
                } catch (e) {
                    console.error("Auth parsing error", e);
                    navigate('/login');
                }
            } else {
                navigate('/login');
            }
            setIsLoading(false);
        };

        initialize();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const fetchRooms = async () => {
        try {
            // Updated to the correct endpoint defined in server.js
            const response = await fetch(`http://${window.location.hostname}:3000/displayRooms`);
            if (response.ok) {
                const data = await response.json();
                // Server returns { roomsData: [...] }
                setRooms(data.roomsData);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const handleCreateRoom = async () => {
        // Use the current user state; if null, do nothing instead of redirecting
        if (!user) return; 

        try {
            const response = await fetch(`http://${window.location.hostname}:3000/createLobby`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hostId: user.id }),
            });

            if (response.ok) {
                const data = await response.json();
                navigate(`/game/${data.roomId}`, { state: { cards: data.cards, score: data.score } });
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to create room');
            }
        } catch (error) {
            alert('Server connection error');
        }
    };

    const handleJoinRoom = async (roomId: number) => {
        if (!user) return;
        
        try {
            const response = await fetch(`http://${window.location.hostname}:3000/joinLobby`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: user.id, roomId }),
            });

            if (response.ok) {
                const data = await response.json();
                navigate(`/game/${data.roomId}`, { state: { cards: data.cards, score: data.score } });
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to join room');
            }
        } catch (error) {
            alert('Server connection error');
        }
    };

    // Prevent rendering the UI (which contains the redirect logic) until initialized
    if (isLoading) return <div className="menu-container">Authenticating...</div>;

    return (
        <div className="menu-container">
            <nav className="top-nav">
                <div className="nav-logo">BlackJack</div>
                <div className="nav-actions">
                    <button className="nav-link-btn" onClick={() => navigate('/docs')}>Docs</button>
                    <button className="nav-logout-btn" onClick={handleLogout}>Logout</button>
                    <div className="user-profile">
                        <span className="user-label">Player:</span>
                        <span className="user-name">{user?.name}</span>
                    </div>
                </div>
            </nav>

            <main className="menu-content">
                <header className="menu-header">
                    <h2>Game Lobby</h2>
                    <button className="create-room-btn" onClick={handleCreateRoom}>+ Create New Room</button>
                </header>

                <div className="room-list-container">
                    <h3>Active Rooms</h3>
                    <div className="room-grid">
                        {rooms.length > 0 ? (
                            rooms.map((room) => (
                                <div key={room.id} className="room-card">
                                    <div className="room-info">
                                        <span className="room-id">Room #{room.id}</span>
                                        <span className="room-status">{room.player_count}/3 Players</span>
                                    </div>
                                    <button 
                                        className="join-btn" 
                                        onClick={() => handleJoinRoom(room.id)}
                                        disabled={room.player_count >= 3}
                                    >
                                        {room.player_count >= 3 ? 'Full' : 'Join Table'}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="room-card empty">
                                <p>No active rooms found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Menu;