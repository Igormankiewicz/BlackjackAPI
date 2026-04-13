import { useNavigate } from 'react-router-dom';
import './Docs.css';

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