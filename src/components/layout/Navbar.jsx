import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, User, Briefcase } from 'lucide-react';
import '../../styles/Navbar.css';
import logo from '../../assets/images/logo.svg';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const location = useLocation();
    const isKiosk = location.pathname.includes('/kiosk');

    if (isKiosk) return null; // Hide navbar on Kiosk mode

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="nav-logo">
                    <img src={logo} alt="SkillBridgeAI" className="logo-image" />
                </Link>

                <div className="nav-desktop">
                    <Link to="/jobs" className="nav-link">Find Jobs</Link>
                    <Link to="/employer" className="nav-link">For Employers</Link>
                    <Link to="/kiosk" className="nav-link">Kiosk Mode</Link>

                    <button className="btn btn-secondary btn-sm">
                        <Globe size={18} />
                        <span>EN</span>
                    </button>

                    <Link to="/onboarding" className="btn btn-primary btn-sm">
                        Login / Register
                    </Link>
                </div>

                <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="mobile-menu">
                    <Link to="/jobs" className="mobile-link" onClick={() => setIsOpen(false)}>Find Jobs</Link>
                    <Link to="/employer" className="mobile-link" onClick={() => setIsOpen(false)}>For Employers</Link>
                    <Link to="/kiosk" className="mobile-link" onClick={() => setIsOpen(false)}>Kiosk Mode</Link>
                    <hr />
                    <button className="mobile-link" onClick={() => setIsOpen(false)}>
                        <Globe size={18} style={{ marginRight: '8px' }} /> Language
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
