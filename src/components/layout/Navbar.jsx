import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, BookOpen, LogIn, LogOut, Sun, Moon } from 'lucide-react';
import '../../styles/Navbar.css';
import logo from '../../assets/images/logo.png';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import useTheme from '../../hooks/use-theme';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
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
                    <Link to="/jobs" className="nav-link">{t('findJobs')}</Link>
                    <Link to="/internships" className="nav-link">{t('internships')}</Link>
                    <Link to="/skillgap" className="nav-link">{t('skillGap')}</Link>
                    {!(user.isAuthenticated && user.role === 'candidate') && (
                        <Link to="/employer" className="nav-link">{t('forEmployers')}</Link>
                    )}
                    <Link to="/kiosk" className="nav-link">{t('kioskMode')}</Link>

                    <Link to="/learning" className="btn btn-accent btn-sm">
                        <BookOpen size={18} />
                        <span>{t('startLearning')}</span>
                    </Link>

                    <button className="btn btn-secondary btn-sm" onClick={toggleTheme} title="Toggle Theme">
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <LanguageSelector />

                    {user.isAuthenticated ? (
                        <>
                            <Link to={dashboardPath} className="btn btn-outline btn-sm" style={{ gap: '6px' }}>
                                <User size={16} />
                                {user.name}
                            </Link>
                            <button className="btn btn-primary btn-sm" onClick={handleLogout}>
                                <LogOut size={16} />
                                {t('logout')}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline btn-sm">
                                <LogIn size={16} />
                                {t('login')}
                            </Link>
                            <Link to="/onboarding" className="btn btn-primary btn-sm">
                                {t('register')}
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
                    <Link to="/jobs" className="mobile-link" onClick={() => setIsOpen(false)}>{t('findJobs')}</Link>
                    <Link to="/internships" className="mobile-link" onClick={() => setIsOpen(false)}>{t('internships')}</Link>
                    <Link to="/skillgap" className="mobile-link" onClick={() => setIsOpen(false)}>{t('skillGap')}</Link>
                    {!(user.isAuthenticated && user.role === 'candidate') && (
                        <Link to="/employer" className="mobile-link" onClick={() => setIsOpen(false)}>{t('forEmployers')}</Link>
                    )}
                    <Link to="/kiosk" className="mobile-link" onClick={() => setIsOpen(false)}>{t('kioskMode')}</Link>
                    <hr />
                    <Link to="/learning" className="mobile-link mobile-link-accent" onClick={() => setIsOpen(false)}>
                        <BookOpen size={18} style={{ marginRight: '8px' }} /> {t('startLearning')}
                    </Link>
                    <button className="mobile-link" onClick={() => { toggleTheme(); setIsOpen(false); }}>
                        {theme === 'dark' ? <Sun size={18} style={{ marginRight: '8px' }} /> : <Moon size={18} style={{ marginRight: '8px' }} />}
                        Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
                    </button>
                    <div style={{ padding: '8px 16px' }}>
                        <LanguageSelector />
                    </div>
                    {user.isAuthenticated ? (
                        <>
                            <Link to={dashboardPath} className="mobile-link" onClick={() => setIsOpen(false)}>
                                <User size={18} style={{ marginRight: '8px' }} /> {user.name}
                            </Link>
                            <button className="mobile-link mobile-link-login" onClick={handleLogout}>
                                <LogOut size={18} style={{ marginRight: '8px' }} /> {t('logout')}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="mobile-link mobile-link-login" onClick={() => setIsOpen(false)}>
                                <LogIn size={18} style={{ marginRight: '8px' }} /> {t('login')}
                            </Link>
                            <Link to="/onboarding" className="mobile-link mobile-link-register" onClick={() => setIsOpen(false)}>
                                <User size={18} style={{ marginRight: '8px' }} /> {t('register')}
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
