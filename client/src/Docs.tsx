import './Docs.css';

const Docs = () => {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const menuItems = [
        { name: 'Overview', id: 'overview' },
        { name: 'Technologies', id: 'technologies' },
        { name: 'Architecture', id: 'architecture' },
        { name: 'Endpoints', id: 'endpoints' },
        { name: 'Examples', id: 'examples' },
    ];

    return (
        <div className="main-container">
            <nav className="side-menu">
                <div className="menu-header">BlackJackAPI</div>
                <div className="menu-links">
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

            <div className="content">
                <div id="overview" className="doc-section">
                    <h2>Project Overview</h2>
                    <p>
                        This application is a multiplayer Blackjack game built using <b>Node.js</b> for the backend logic and <b>PostgreSQL</b> for data persistence. 
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>

                <div id="technologies" className="doc-section">
                    <h2>Technologies Used</h2>
                    <div className="tech-field">
                        <div className="tech-card">Node.js</div>
                        <div className="tech-card">PostgreSQL</div>
                        <div className="tech-card">React</div>
                    </div>
                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>

                <div id="architecture" className="doc-section">
                    <h2>System Architecture</h2>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
                </div>

                <div id="endpoints" className="doc-section">
                    <h2>API Endpoints</h2>
                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
                </div>

                <div id="examples" className="doc-section">
                    <h2>Implementation Examples</h2>
                    <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
                </div>
            </div>
        </div>
    );
};

export default Docs;