import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, User, Briefcase, TrendingUp, BookOpen } from 'lucide-react';
import '../../styles/Navbar.css';
import logo from '../../assets/images/logo.png';

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
                    <Link to="/resume-upload" className="nav-link">📄 Resume Upload</Link>
                    <Link to="/opportunities" className="nav-link">Search Opportunities</Link>
                    <Link to="/profile-editor" className="nav-link">My Profile</Link>
                    <Link to="/dashboard/skills" className="nav-link nav-link-highlight">
                        <TrendingUp size={18} />
                        <span>Skill Gap Analysis</span>
                    </Link>
                    <Link to="/job-matching" className="nav-link">🔍 Job Matching</Link>
                    <Link to="/jobs" className="nav-link">Find Jobs</Link>
                    <Link to="/employer" className="nav-link">For Employers</Link>

                    <Link to="/learning" className="btn btn-accent btn-sm">
                        <BookOpen size={18} />
                        <span>Start Learning</span>
                    </Link>

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
                    <Link to="/resume-upload" className="mobile-link" onClick={() => setIsOpen(false)}>📄 Resume Upload</Link>
                    <Link to="/opportunities" className="mobile-link" onClick={() => setIsOpen(false)}>Search Opportunities</Link>
                    <Link to="/profile-editor" className="mobile-link" onClick={() => setIsOpen(false)}>My Profile</Link>
                    <Link to="/dashboard/skills" className="mobile-link mobile-link-highlight" onClick={() => setIsOpen(false)}>
                        <TrendingUp size={18} style={{ marginRight: '8px' }} /> Skill Gap Analysis
                    </Link>
                    <Link to="/job-matching" className="mobile-link" onClick={() => setIsOpen(false)}>🔍 Job Matching</Link>
                    <Link to="/jobs" className="mobile-link" onClick={() => setIsOpen(false)}>Find Jobs</Link>
                    <Link to="/employer" className="mobile-link" onClick={() => setIsOpen(false)}>For Employers</Link>
                    <Link to="/kiosk" className="mobile-link" onClick={() => setIsOpen(false)}>Kiosk Mode</Link>
                    <hr />
                    <Link to="/learning" className="mobile-link mobile-link-accent" onClick={() => setIsOpen(false)}>
                        <BookOpen size={18} style={{ marginRight: '8px' }} /> Start Learning
                    </Link>
                    <button className="mobile-link" onClick={() => setIsOpen(false)}>
                        <Globe size={18} style={{ marginRight: '8px' }} /> Language
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
