import { useNavigate } from 'react-router-dom';
import './Docs.css';

import card2H from './assets/cards/hearts/2.png';
import card5S from './assets/cards/spades/5.png';
import card8D from './assets/cards/diamond/8.png';
import card10C from './assets/cards/clubs/10.png';

import cardQH from './assets/cards/hearts/q.png';
import cardJS from './assets/cards/spades/j.png';
import cardKD from './assets/cards/diamond/k.png';

import aceS from './assets/cards/spades/1.png';
import aceH from './assets/cards/hearts/1.png';

const Docs = () => {
    const navigate = useNavigate();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const menuItems = [
        { name: 'Overview', id: 'overview' },
        { name: 'How to Play', id: 'how-to-play' },
        { name: 'Lobby Management', id: 'lobby-management' },
        { name: 'Setup Instructions', id: 'setup' },
        { name: 'Technologies', id: 'technologies' },
        { name: 'Architecture', id: 'architecture' },
        { name: 'Endpoints', id: 'endpoints' },
        { name: 'Examples', id: 'examples' },
    ];

    return (
        <div className="main-container">
            <nav className="side-menu expanded">
                <div className="menu-header">BlackJack <br/> Documentation</div>
                <div className="menu-links">
                    <button 
                        className="menu-btn text-blue-400 mb-4" 
                        onClick={() => navigate('/menu')}
                    >
                        ← Back to Menu
                    </button>
                    {menuItems.map((item) => (
                        <button 
                            key={item.id} 
                            className="menu-btn" 
                            onClick={() => scrollToSection(item.id)}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </nav>

            <div className="content shifted">
                <div id="overview" className="doc-section">
                    <h2>Project Overview</h2>
                    <p>
                        This application is a real-time multiplayer Blackjack API built using <b>Node.js</b> for the robust backend logic, <b>PostgreSQL</b> for reliable data persistence, and a highly responsive <b>React</b> frontend. 
                        It allows users to register, create persistent game lobbies, and seamlessly play rounds of Blackjack against others on the same local network. The state is synchronized across clients through an efficient polling mechanism.
                    </p>
                </div>

                <div id="how-to-play" className="doc-section">
                    <h2>How to Play</h2>
                    <p>
                        Blackjack is a classic card game where the goal is to beat the dealer's hand without going over 21. In our multiplayer mode, you compete to have the best hand against other players.
                    </p>
                    <ul className="list-disc ml-6 mt-4 text-slate-300">
                        <li className="mb-6">
                            <strong>Card Values:</strong> Number cards (2-10) are worth their face value. 
                            <div className="flex gap-4 mt-3 mb-4">
                                <img src={card2H} alt="2 of Hearts" className="w-16 h-auto shadow-md rounded [image-rendering:pixelated]" />
                                <img src={card5S} alt="5 of Spades" className="w-16 h-auto shadow-md rounded [image-rendering:pixelated]" />
                                <img src={card8D} alt="8 of Diamonds" className="w-16 h-auto shadow-md rounded [image-rendering:pixelated]" />
                                <img src={card10C} alt="10 of Clubs" className="w-16 h-auto shadow-md rounded [image-rendering:pixelated]" />
                            </div>
                            Face cards (Jack, Queen, King) are worth 10.
                            <div className="flex gap-4 mt-3 mb-4">
                                <img src={cardJS} alt="Jack of Spades" className="w-16 h-auto shadow-md rounded [image-rendering:pixelated]" />
                                <img src={cardQH} alt="Queen of Hearts" className="w-16 h-auto shadow-md rounded [image-rendering:pixelated]" />
                                <img src={cardKD} alt="King of Diamonds" className="w-16 h-auto shadow-md rounded [image-rendering:pixelated]" />
                            </div>
                            Aces can be worth 1 or 11, whichever is more favorable to your hand.
                        </li>
                        <li className="mb-6">
                            <strong>Double Ace Rule:</strong> If you draw exactly two Aces as your first two cards, this is a special condition known as "Double Ace" (valued at 22 points in our system). This is an automatic win against anyone who doesn't also have a Double Ace!
                            <div className="flex gap-4 mt-3 mb-2">
                                <img src={aceS} alt="Ace of Spades" className="w-16 h-auto shadow-md rounded [image-rendering:pixelated]" />
                                <img src={aceH} alt="Ace of Hearts" className="w-16 h-auto shadow-md rounded [image-rendering:pixelated]" />
                            </div>
                        </li>
                        <li className="mb-2"><strong>Gameplay:</strong> You can choose to "Draw" (take another card to increase your score) or "Stop" (keep your current hand and end your turn).</li>
                        <li className="mb-2"><strong>Winning:</strong> You win if your hand's total is closer to 21 than the other players, or if the other players bust. If your hand exceeds 21, you bust and automatically lose.</li>
                    </ul>
                </div>

                <div id="lobby-management" className="doc-section">
                    <h2>Lobby Management</h2>
                    <p className="mb-4">Here is a step-by-step tutorial on how to create and join game rooms.</p>
                    
                    <h3 className="text-xl font-bold mt-6 mb-2 text-white">Creating a Room (Host)</h3>
                    <ol className="list-decimal ml-6 mt-2 text-slate-300">
                        <li className="mb-2">From the main Menu, click the blue <strong>"+ Create New Room"</strong> button.</li>
                        <li className="mb-2">The server will automatically generate a new room, assign it an ID, and place you inside.</li>
                        <li className="mb-2">Wait for other players to join. You will see them appear in the "Waiting for others" section at the top of the game board.</li>
                        <li className="mb-2">As the Host, you have the special ability to <strong>"Close Room"</strong> when the game is over, which kicks everyone out and cleans up the server data.</li>
                    </ol>

                    <h3 className="text-xl font-bold mt-6 mb-2 text-white">Joining a Room (Player)</h3>
                    <ol className="list-decimal ml-6 mt-2 text-slate-300">
                        <li className="mb-2">Look at the <strong>"Active Rooms"</strong> grid on the main Menu.</li>
                        <li className="mb-2">Find a room that isn't full (rooms hold up to 3 players). You can identify who created it by the header (e.g., <em>"user1's room"</em>).</li>
                        <li className="mb-2">Click the <strong>"Join Table"</strong> button on the room card.</li>
                        <li className="mb-2">You will instantly enter the game and be dealt your starting hand. At any point, you can click <strong>"Leave Room"</strong> to exit back to the Menu. If you are the last person to leave, the room safely deletes itself.</li>
                    </ol>
                </div>

                <div id="setup" className="doc-section">
                    <h2>Setup Instructions</h2>
                    <p>To run the application locally, you need to configure and start the Node.js server.</p>
                    
                    <h3 className="text-xl font-bold mt-6 mb-2 text-white">1. Configure the Environment</h3>
                    <p className="mb-2">Create a <code>.env</code> file in the <code>server</code> directory with the following variables:</p>
                    <div className="example-block bg-[#0f172a] rounded-xl border border-slate-700 overflow-hidden mb-6 shadow-lg">
                        <pre className="p-4 text-sm text-slate-300 overflow-x-auto">
{`DB_LOGIN=your_postgres_username
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_postgres_password
DB_PORT=5432`}
                        </pre>
                    </div>

                    <h3 className="text-xl font-bold mt-6 mb-2 text-white">2. Start the Server</h3>
                    <p className="mb-2">Navigate to the server directory and run the application:</p>
                    <div className="example-block bg-[#0f172a] rounded-xl border border-slate-700 overflow-hidden mb-6 shadow-lg">
                        <pre className="p-4 text-sm text-slate-300 overflow-x-auto">
{`cd server
npm install
node server.js`}
                        </pre>
                    </div>
                </div>

                <div id="technologies" className="doc-section">
                    <h2>Technologies Used</h2>
                    <div className="tech-field">
                        <div className="tech-card">Node.js</div>
                        <div className="tech-card">PostgreSQL</div>
                        <div className="tech-card">React</div>
                        <div className="tech-card">TailwindCSS</div>
                    </div>
                    <p><b>Node.js & Express:</b> Powers the REST API and handles core game logic (calculating scores, drawing cards, validating turns).</p>
                    <p><b>PostgreSQL:</b> Maintains user accounts, active lobbies, and dynamically generates game tables for concurrent matches.</p>
                    <p><b>React & TailwindCSS:</b> Provides a fast, reactive UI with utility-first styling for a sleek, modern casino aesthetic.</p>
                </div>

                <div id="architecture" className="doc-section">
                    <h2>System Architecture</h2>
                    <p>
                        The system is designed around a dynamic database architecture. When a Host creates a lobby, the backend dynamically generates a dedicated SQL table (e.g., <code>turns_15</code>). 
                        This ensures game states are isolated. The React frontend constantly polls the <code>/roomState</code> endpoint, allowing players to see real-time updates as opponents hit, stay, or bust, circumventing the need for WebSockets while maintaining a live multiplayer feel.
                    </p>
                </div>

                <div id="endpoints" className="doc-section">
                    <h2>API Endpoints</h2>
                    <p className="mb-6">The backend exposes a RESTful API. Below are the primary routes used for authentication and game management:</p>
                    
                    <div className="endpoint-list flex flex-col gap-4">
                        <div className="endpoint-item flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <span className="method post font-bold px-3 py-1 rounded bg-green-500/20 text-green-400 text-sm">POST</span>
                            <span className="path font-mono text-slate-300">/register</span>
                            <span className="desc text-slate-500 text-sm ml-auto">Creates a new user account</span>
                        </div>
                        <div className="endpoint-item flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <span className="method post font-bold px-3 py-1 rounded bg-green-500/20 text-green-400 text-sm">POST</span>
                            <span className="path font-mono text-slate-300">/login</span>
                            <span className="desc text-slate-500 text-sm ml-auto">Authenticates a user</span>
                        </div>
                        <div className="endpoint-item flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <span className="method post font-bold px-3 py-1 rounded bg-green-500/20 text-green-400 text-sm">POST</span>
                            <span className="path font-mono text-slate-300">/createLobby</span>
                            <span className="desc text-slate-500 text-sm ml-auto">Initializes a new game room</span>
                        </div>
                        <div className="endpoint-item flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <span className="method post font-bold px-3 py-1 rounded bg-green-500/20 text-green-400 text-sm">POST</span>
                            <span className="path font-mono text-slate-300">/joinLobby</span>
                            <span className="desc text-slate-500 text-sm ml-auto">Adds a player to an active room</span>
                        </div>
                        <div className="endpoint-item flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <span className="method post font-bold px-3 py-1 rounded bg-green-500/20 text-green-400 text-sm">POST</span>
                            <span className="path font-mono text-slate-300">/playTurn</span>
                            <span className="desc text-slate-500 text-sm ml-auto">Executes a 'draw' or 'stop' action</span>
                        </div>
                        <div className="endpoint-item flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <span className="method get font-bold px-3 py-1 rounded bg-blue-500/20 text-blue-400 text-sm">GET</span>
                            <span className="path font-mono text-slate-300">/roomState/:roomId</span>
                            <span className="desc text-slate-500 text-sm ml-auto">Fetches live game data for polling</span>
                        </div>
                        <div className="endpoint-item flex items-center gap-4 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <span className="method post font-bold px-3 py-1 rounded bg-green-500/20 text-green-400 text-sm">POST</span>
                            <span className="path font-mono text-slate-300">/closeGame</span>
                            <span className="desc text-slate-500 text-sm ml-auto">Deletes the room and frees resources</span>
                        </div>
                    </div>
                </div>

                <div id="examples" className="doc-section">
                    <h2>Implementation Examples</h2>
                    <p className="mb-4">Here is a standard interaction flow showing how the frontend communicates with the <code>/playTurn</code> endpoint when a user decides to draw a card:</p>
                    
                    <div className="example-block bg-[#0f172a] rounded-xl border border-slate-700 overflow-hidden mb-6 shadow-lg">
                        <div className="block-header bg-slate-800 px-4 py-2 border-b border-slate-700 font-mono text-xs text-slate-400 flex justify-between">
                            <span>Request Payload (JSON)</span>
                            <span className="text-green-400">POST /playTurn</span>
                        </div>
                        <pre className="p-4 text-sm text-slate-300 overflow-x-auto">
{`{
  "playerId": 42,
  "roomId": 15,
  "action": "draw" // or "stop"
}`}
                        </pre>
                    </div>

                    <div className="example-block bg-[#0f172a] rounded-xl border border-slate-700 overflow-hidden shadow-lg">
                        <div className="block-header bg-slate-800 px-4 py-2 border-b border-slate-700 font-mono text-xs text-slate-400 flex justify-between">
                            <span>Response Payload (JSON)</span>
                            <span className="text-green-400">200 OK</span>
                        </div>
                        <pre className="p-4 text-sm text-slate-300 overflow-x-auto">
{`{
  "message": "Card drawn",
  "card": "10hearts",
  "score": 21,
  "busted": false,
  "finished": true,
  "isGameOver": false
}`}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Docs;