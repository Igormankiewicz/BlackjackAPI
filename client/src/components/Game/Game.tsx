import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './Game.css';

interface GameState {
    cards: string;
    score: number;
    busted: boolean;
    finished: boolean;
}

const Game = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [game, setGame] = useState<GameState>({
        cards: location.state?.cards || '',
        score: location.state?.score || 0,
        busted: false,
        finished: false
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Action handler for 'draw' or 'stop'
    const handleAction = async (action: 'draw' | 'stop') => {
        try {
            const response = await fetch('http://localhost:3000/playTurn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    playerId: user.id, 
                    roomId: roomId, 
                    action: action 
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                if (action === 'draw') {
                    setGame(prev => ({
                        ...prev,
                        cards: prev.cards ? `${prev.cards},${data.card}` : data.card,
                        score: data.score,
                        busted: data.busted,
                        finished: data.finished
                    }));
                } else {
                    setGame(prev => ({ ...prev, finished: true }));
                }

                // Add game over check
                if (data.isGameOver) {
                    console.log("Everyone has finished! Time to check who won.");
                    // You can fetch a new endpoint here to get all players' scores and announce the winner.
                }
            }
        } catch (error) {
            console.error("Turn error:", error);
        }
    };

    const handleQuit = async () => {
        // Optional: Call /closeGame if you are the host or just navigate away
        navigate('/menu');
    };

    return (
        <div className="game-container">
            <div className="game-board">
                <h2>Room #{roomId}</h2>
                <div className="score-badge">Score: {game.score}</div>
                
                <div className="card-display">
                    {game.cards.split(',').map((card, i) => (
                        <div key={i} className="card-item">{card}</div>
                    ))}
                </div>

                {game.busted && <div className="status-msg bust">BUSTED!</div>}
                {game.finished && !game.busted && <div className="status-msg stay">You Stayed</div>}

                <div className="game-controls">
                    <div className="game-btns">
                        {!game.finished && (
                            <>
                                <button onClick={() => handleAction('draw')} className="hit-btn">Hit</button>
                                <button onClick={() => handleAction('stop')} className="stay-btn">Stay</button>
                            </>
                        )}
                    </div>
                    
                    <button onClick={handleQuit} className="quit-btn">Back to Menu</button>
                </div>
            </div>
        </div>
    );
};

export default Game;