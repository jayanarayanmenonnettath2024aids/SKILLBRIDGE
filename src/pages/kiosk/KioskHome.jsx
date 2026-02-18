import React from 'react';
import { UserPlus, Search, Shield, BookOpen, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../../styles/Kiosk.css';

const KioskTile = ({ icon: Icon, title, color, to }) => (
    <Link to={to} className={`kiosk-tile ${color}`}>
        <Icon size={64} />
        <h3>{title}</h3>
    </Link>
);

const KioskHome = () => {
    return (
        <div className="kiosk-container">
            <header className="kiosk-header">
                <div className="flex items-center gap-4">
                    <img src="/vite.svg" alt="Logo" className="h-12 w-12" />
                    <div>
                        <h1>SkillBridge Kiosk</h1>
                        <p>Select an option to begin</p>
                    </div>
                </div>
                <div className="language-toggle">
                    <button className="lang-btn active">English</button>
                    <button className="lang-btn">हिंदी</button>
                    <button className="lang-btn">தமிழ்</button>
                </div>
            </header>

            <main className="kiosk-grid">
                <KioskTile
                    icon={UserPlus}
                    title="Register / Login"
                    color="bg-blue"
                    to="/onboarding"
                />
                <KioskTile
                    icon={Search}
                    title="Find Jobs"
                    color="bg-green"
                    to="/jobs"
                />
                <KioskTile
                    icon={Shield}
                    title="My Credentials"
                    color="bg-indigo"
                    to="/dashboard"
                />
                <KioskTile
                    icon={BookOpen}
                    title="Learn a Skill"
                    color="bg-amber"
                    to="/dashboard"
                />
            </main>

            <footer className="kiosk-footer">
                <Link to="/" className="back-home">
                    <ArrowLeft /> Exit Kiosk Mode
                </Link>
                <p>Touch anywhere to start • Ver 2.0.1 • Offline Supported</p>
            </footer>
        </div>
    );
};

export default KioskHome;
