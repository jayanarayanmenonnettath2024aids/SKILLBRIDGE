import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, User, Briefcase, BookOpen, TrendingUp, LogIn, LogOut } from 'lucide-react';
import '../../styles/Navbar.css';
import logo from '../../assets/images/logo.png';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const isKiosk = location.pathname.includes('/kiosk');

    if (isKiosk) return null; // Hide navbar on Kiosk mode

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    const dashboardPath = user.role === 'employer' ? '/employer' : '/dashboard';

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="nav-logo">
                    <img src={logo} alt="SkillBridgeAI" className="logo-image" />
                </Link>

                <div className="nav-desktop">
                    <Link to="/jobs" className="nav-link">Find Jobs</Link>
                    <Link to="/internships" className="nav-link">Internships</Link>
                    <Link to="/skillgap" className="nav-link">Skill Gap</Link>
                    {!(user.isAuthenticated && user.role === 'candidate') && (
                        <Link to="/employer" className="nav-link">For Employers</Link>
                    )}
                    <Link to="/kiosk" className="nav-link">Kiosk Mode</Link>

                    <Link to="/learning" className="btn btn-accent btn-sm">
                        <BookOpen size={18} />
                        <span>Start Learning</span>
                    </Link>

                    <button className="btn btn-secondary btn-sm">
                        <Globe size={18} />
                        <span>EN</span>
                    </button>

                    {user.isAuthenticated ? (
                        <>
                            <Link to={dashboardPath} className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
                                <User size={16} />
                                {user.name}
                            </Link>
                            <button className="btn btn-primary btn-sm" onClick={handleLogout}>
                                <LogOut size={16} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline btn-sm">
                                <LogIn size={16} />
                                Login
                            </Link>
                            <Link to="/onboarding" className="btn btn-primary btn-sm">
                                Register
                            </Link>
                        </>
                    )}
                </div>

                <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="mobile-menu">
                    <Link to="/jobs" className="mobile-link" onClick={() => setIsOpen(false)}>Find Jobs</Link>
                    <Link to="/internships" className="mobile-link" onClick={() => setIsOpen(false)}>Internships</Link>
                    <Link to="/skillgap" className="mobile-link" onClick={() => setIsOpen(false)}>Skill Gap</Link>
                    {!(user.isAuthenticated && user.role === 'candidate') && (
                        <Link to="/employer" className="mobile-link" onClick={() => setIsOpen(false)}>For Employers</Link>
                    )}
                    <Link to="/kiosk" className="mobile-link" onClick={() => setIsOpen(false)}>Kiosk Mode</Link>
                    <hr />
                    <Link to="/learning" className="mobile-link mobile-link-accent" onClick={() => setIsOpen(false)}>
                        <BookOpen size={18} style={{ marginRight: '8px' }} /> Start Learning
                    </Link>
                    <button className="mobile-link" onClick={() => setIsOpen(false)}>
                        <Globe size={18} style={{ marginRight: '8px' }} /> Language
                    </button>
                    {user.isAuthenticated ? (
                        <>
                            <Link to={dashboardPath} className="mobile-link" onClick={() => setIsOpen(false)}>
                                <User size={18} style={{ marginRight: '8px' }} /> {user.name}
                            </Link>
                            <button className="mobile-link mobile-link-login" onClick={handleLogout}>
                                <LogOut size={18} style={{ marginRight: '8px' }} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="mobile-link mobile-link-login" onClick={() => setIsOpen(false)}>
                                <LogIn size={18} style={{ marginRight: '8px' }} /> Login
                            </Link>
                            <Link to="/onboarding" className="mobile-link mobile-link-register" onClick={() => setIsOpen(false)}>
                                <User size={18} style={{ marginRight: '8px' }} /> Register
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
