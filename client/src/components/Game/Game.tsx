import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Game.css';

const cardImageModules = import.meta.glob('../../assets/cards/**/*.png', { eager: true });

const getCardImageUrl = (cardStr: string) => {
    if (!cardStr) return '';
    const match = cardStr.match(/^([0-9]+|[AJQKajqk])(spades|hearts|diamonds|clubs)$/i);
    if (!match) return '';
    
    let value = match[1].toLowerCase();
    let suit = match[2].toLowerCase();
    
    if (value === 'a') value = '1';
    if (suit === 'diamonds') suit = 'diamond';
    
    const key = `../../assets/cards/${suit}/${value}.png`;
    const mod = cardImageModules[key] as { default: string } | undefined;
    return mod ? mod.default : '';
};

interface Player {
    id: number;
    name: string;
    points: number;
    cards: string;
    haslost: boolean;
}

const Game = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    
    const [players, setPlayers] = useState<Player[]>([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [hostId, setHostId] = useState<number | null>(null);
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Poll room state
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        const fetchRoomState = async () => {
            try {
                const res = await fetch(`http://${window.location.hostname}:3000/roomState/${roomId}`);
                if (res.status === 404) {
                    // Room might have been closed by host
                    navigate('/menu');
                    return;
                }
                if (res.ok) {
                    const data = await res.json();
                    setPlayers(data.players);
                    setIsGameOver(data.isGameOver);
                    setHostId(data.hostId);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchRoomState(); // Initial fetch
        interval = setInterval(fetchRoomState, 2000);

        return () => clearInterval(interval);
    }, [roomId, navigate]);

    useEffect(() => {
        if (isGameOver) {
            const timer = setTimeout(() => {
                setShowLeaderboard(true);
            }, 3500); // 3.5 seconds delay
            return () => clearTimeout(timer);
        } else {
            setShowLeaderboard(false);
        }
    }, [isGameOver]);

    const handleAction = async (action: 'draw' | 'stop') => {
        try {
            const response = await fetch(`http://${window.location.hostname}:3000/playTurn`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    playerId: user.id, 
                    roomId: roomId, 
                    action: action 
                }),
            });

            if (response.ok) {
                // Instantly fetch the updated state instead of waiting for the interval
                const res = await fetch(`http://${window.location.hostname}:3000/roomState/${roomId}`);
                if (res.ok) {
                    const data = await res.json();
                    setPlayers(data.players);
                    setIsGameOver(data.isGameOver);
                }
            }
        } catch (error) {
            console.error("Turn error:", error);
        }
    };

    const handleCloseRoom = async () => {
        try {
            await fetch(`http://${window.location.hostname}:3000/closeGame`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roomId }),
            });
            navigate('/menu');
        } catch (e) {
            console.error(e);
        }
    };

    const handleQuit = async () => {
        try {
            await fetch(`http://${window.location.hostname}:3000/leaveLobby`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerId: user.id, roomId }),
            });
            navigate('/menu');
        } catch (e) {
            console.error(e);
            navigate('/menu');
        }
    };

    if (players.length === 0) return <div className="game-container"><div className="status-msg text-white">Loading game...</div></div>;

    const me = players.find(p => p.id === user.id);
    const others = players.filter(p => p.id !== user.id);

    // Leaderboard View
    if (showLeaderboard) {
        const sortedPlayers = [...players].sort((a, b) => {
            const aDoubleAce = a.points === 22 && a.cards.split(',').length === 2;
            const bDoubleAce = b.points === 22 && b.cards.split(',').length === 2;
            const aBust = a.points > 21 && !aDoubleAce;
            const bBust = b.points > 21 && !bDoubleAce;
            
            if (aBust && !bBust) return 1;
            if (!aBust && bBust) return -1;
            return b.points - a.points;
        });

        return (
            <div className="game-container">
                <div className="leaderboard-board">
                    <h2>Game Over - Leaderboard</h2>
                    <div className="leaderboard-list">
                        {sortedPlayers.map((p, i) => {
                            const isDoubleAce = p.points === 22 && p.cards.split(',').length === 2;
                            const isBust = p.points > 21 && !isDoubleAce;
                            return (
                                <div key={p.id} className={`leaderboard-row ${isBust ? 'bust-row' : ''}`}>
                                    <div className="place">{i + 1}</div>
                                    <div className="name">{p.name} {p.id === user.id ? <span className="text-blue-400 text-xs ml-2">(You)</span> : ''}</div>
                                    <div className="score">{p.points} pts</div>
                                    <div className="status">{isBust ? 'BUSTED' : (isDoubleAce ? 'DOUBLE ACE' : 'STAYED')}</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex gap-4 justify-center mt-8">
                        {hostId === user.id ? (
                            <button onClick={handleCloseRoom} className="hit-btn">Close Room</button>
                        ) : (
                            <button onClick={handleQuit} className="stay-btn">Back to Menu</button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Active Game View
    return (
        <div className="game-container">
            <div className="game-board">
                <div className="room-header flex justify-between items-center mb-6">
                    <h2 className="mb-0!">Room #{roomId}</h2>
                    <button onClick={handleQuit} className="quit-btn static! p-0! hover:text-red-400">Leave Room</button>
                </div>

                {/* Other players section */}
                <div className="others-container flex justify-center gap-8 mb-8 min-h-[120px]">
                    {others.length > 0 ? others.map(p => (
                        <div key={p.id} className="other-player-deck flex flex-col items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 w-48">
                            <div className="other-name text-sm font-bold text-slate-300 mb-2 truncate max-w-full">
                                {p.name} {p.haslost ? <span className="text-xs text-slate-500 font-normal">(Finished)</span> : ''}
                            </div>
                            <div className="other-cards flex gap-2 flex-wrap justify-center">
                                {p.cards ? p.cards.split(',').map((c, i) => {
                                    const imgUrl = getCardImageUrl(c);
                                    return imgUrl ? (
                                        <img key={i} src={imgUrl} alt={c} className="w-12 h-auto shadow-sm rounded [image-rendering:pixelated]" />
                                    ) : (
                                        <div key={i} className="mini-card text-xs font-bold bg-slate-700 border border-slate-600 rounded p-2 text-white shadow-sm flex items-center justify-center">{c}</div>
                                    );
                                }) : <div className="mini-card empty text-xs bg-slate-800/50 border border-dashed border-slate-600 rounded p-2 text-slate-600">...</div>}
                            </div>
                        </div>
                    )) : (
                        <div className="text-slate-500 text-sm flex items-center justify-center italic">Waiting for others to join...</div>
                    )}
                </div>

                <hr className="border-slate-800 my-8 w-full" />

                {/* My section */}
                {me && (
                    <div className="my-container relative">
                        <div className="my-header flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-blue-400">Your Deck</h3>
                            <div className="score-badge static! mt-0! mb-0! p-2! px-4!">Score: {me.points}</div>
                        </div>
                        
                        <div className="card-display my-6! flex flex-wrap gap-4 justify-center">
                            {me.cards ? me.cards.split(',').map((card, i) => {
                                const imgUrl = getCardImageUrl(card);
                                return imgUrl ? (
                                    <img key={i} src={imgUrl} alt={card} className="w-24 h-auto shadow-md rounded-md [image-rendering:pixelated]" />
                                ) : (
                                    <div key={i} className="card-item">{card}</div>
                                );
                            }) : null}
                        </div>

                        {me.points > 21 && !(me.points === 22 && me.cards.split(',').length === 2) && <div className="status-msg bust">BUSTED!</div>}
                        {me.haslost && (me.points <= 21 || (me.points === 22 && me.cards.split(',').length === 2)) && <div className="status-msg stay">You Stayed</div>}

                        <div className="game-controls pt-4! mt-4! border-t-0">
                            {!me.haslost ? (
                                <div className="game-btns">
                                    <button onClick={() => handleAction('draw')} className="hit-btn">Hit</button>
                                    <button onClick={() => handleAction('stop')} className="stay-btn">Stay</button>
                                </div>
                            ) : (
                                <div className="text-slate-500 text-sm animate-pulse italic text-center mt-2">Waiting for other players to finish...</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Game;