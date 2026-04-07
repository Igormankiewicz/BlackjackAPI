import { useState } from 'react';
import './Docs.css';

const Docs = () => {
    const [isOpen, setIsOpen] = useState(true); // Default to open

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
            {/* Toggle Button - Placed outside the nav to stay visible or inside for alignment */}
            <button 
                className={`menu-toggle ${isOpen ? 'open' : 'closed'}`} 
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? '✕' : '☰'}
            </button>

            <nav className={`side-menu ${isOpen ? 'expanded' : 'collapsed'}`}>
                <div className="menu-header">BlackJackAPI<br/>Documentation</div>
                <div className="menu-links">
                    {menuItems.map((item) => (
                        <button 
                            key={item.id} 
                            className="menu-btn" 
                            onClick={() => scrollToSection(item.id)}
                        >
                            <span className="btn-text">{item.name}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Content shifts based on menu state */}
            <div className={`content ${isOpen ? 'shifted' : 'full'}`}>
                <div id="overview" className="doc-section">
                    <h2>Project Overview</h2>
                    <p>
                        This application is a multiplayer Blackjack game built using <b>Node.js</b> and <b>PostgreSQL</b>. 
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </div>

                <div id="technologies" className="doc-section">
                    <h2>Technologies Used</h2>
                    <div className="tech-field">
                        <div className="tech-card">Node.js</div>
                        <div className="tech-card">PostgreSQL</div>
                        <div className="tech-card">React</div>
                    </div>
                </div>

                <div id="architecture" className="doc-section">
                    <h2>System Architecture</h2>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                </div>

                <div id="endpoints" className="doc-section">
                    <h2>API Endpoints</h2>
                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
                </div>

                <div id="examples" className="doc-section">
                    <h2>Implementation Examples</h2>
                    <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
                </div>
            </div>
        </div>
    );
};

export default Docs;