import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, User, Briefcase, BookOpen, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import '../../styles/Navbar.css';
import logo from '../../assets/images/logo.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [langMenuOpen, setLangMenuOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { t, i18n } = useTranslation();
    const isKiosk = location.pathname.includes('/kiosk');

    if (isKiosk) return null; // Hide navbar on Kiosk mode

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
        setLangMenuOpen(false);
    };

    const currentLanguage = i18n.language === 'hi' ? 'हिं' : 'EN';

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="nav-logo">
                    <img src={logo} alt="SkillBridgeAI" className="logo-image" />
                </Link>

                <div className="nav-desktop">
                    {user.role === 'employer' ? (
                        <>
                            {/* Employer Navigation */}
                            <Link to="/employer" className="nav-link">{t('nav.dashboard')}</Link>
                            <Link to="/post-job" className="nav-link">{t('nav.postJob')}</Link>
                        </>
                    ) : (
                        <>
                            {/* Candidate Navigation */}
                            <Link to="/jobs" className="nav-link">{t('nav.findJobs')}</Link>
                            <Link to="/internships" className="nav-link">{t('nav.internships')}</Link>
                            <Link to="/learning" className="nav-link">
                                <BookOpen size={18} />
                                <span>{t('nav.learning')}</span>
                            </Link>
                        </>
                    )}
                    
                    {!user.isAuthenticated && (
                        <>
                            <Link to="/employer-login" className="nav-link">{t('nav.forEmployers')}</Link>
                            <Link to="/kiosk" className="nav-link">{t('nav.kioskMode')}</Link>
                        </>
                    )}

                    <div className="language-selector" style={{ position: 'relative' }}>
                        <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => setLangMenuOpen(!langMenuOpen)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                            <Globe size={18} />
                            <span>{currentLanguage}</span>
                            <ChevronDown size={14} />
                        </button>
                        {langMenuOpen && (
                            <div className="language-dropdown" style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '0.5rem',
                                background: 'white',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                zIndex: 1000,
                                minWidth: '120px'
                            }}>
                                <button
                                    onClick={() => changeLanguage('en')}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: 'none',
                                        background: i18n.language === 'en' ? '#F3F4F6' : 'transparent',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        borderBottom: '1px solid #E5E7EB'
                                    }}
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => changeLanguage('hi')}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: 'none',
                                        background: i18n.language === 'hi' ? '#F3F4F6' : 'transparent',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    हिंदी (Hindi)
                                </button>
                            </div>
                        )}
                    </div>

                    {user.isAuthenticated ? (
                        <>
                            <Link to={user.role === 'employer' ? '/employer' : '/dashboard'} className="btn btn-secondary btn-sm">
                                <User size={18} />
                                <span>{user.name}</span>
                            </Link>
                            <button onClick={handleLogout} className="btn btn-primary btn-sm">
                                <LogOut size={18} />
                                <span>{t('nav.logout')}</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary btn-sm">
                                <User size={18} />
                                <span>{t('nav.login')}</span>
                            </Link>
                            <Link to="/onboarding" className="btn btn-primary btn-sm">
                                {t('nav.register')}
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
                    {user.role === 'employer' ? (
                        <>
                            {/* Employer Mobile Navigation */}
                            <Link to="/employer" className="mobile-link" onClick={() => setIsOpen(false)}>{t('nav.dashboard')}</Link>
                            <Link to="/post-job" className="mobile-link" onClick={() => setIsOpen(false)}>{t('nav.postJob')}</Link>
                        </>
                    ) : (
                        <>
                            {/* Candidate Mobile Navigation */}
                            <Link to="/jobs" className="mobile-link" onClick={() => setIsOpen(false)}>{t('nav.findJobs')}</Link>
                            <Link to="/internships" className="mobile-link" onClick={() => setIsOpen(false)}>{t('nav.internships')}</Link>
                            <Link to="/learning" className="mobile-link mobile-link-accent" onClick={() => setIsOpen(false)}>
                                <BookOpen size={18} style={{ marginRight: '8px' }} /> {t('nav.learning')}
                            </Link>
                        </>
                    )}
                    
                    {!user.isAuthenticated && (
                        <>
                            <Link to="/employer-login" className="mobile-link" onClick={() => setIsOpen(false)}>{t('nav.forEmployers')}</Link>
                            <Link to="/kiosk" className="mobile-link" onClick={() => setIsOpen(false)}>{t('nav.kioskMode')}</Link>
                        </>
                    )}
                    
                    <hr />
                    
                    {user.isAuthenticated ? (
                        <>
                            <Link to={user.role === 'employer' ? '/employer' : '/dashboard'} className="mobile-link" onClick={() => setIsOpen(false)}>
                                <User size={18} style={{ marginRight: '8px' }} /> {user.name}
                            </Link>
                            <button className="mobile-link" onClick={handleLogout}>
                                <LogOut size={18} style={{ marginRight: '8px' }} /> {t('nav.logout')}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="mobile-link" onClick={() => setIsOpen(false)}>
                                <User size={18} style={{ marginRight: '8px' }} /> {t('nav.login')}
                            </Link>
                            <Link to="/onboarding" className="mobile-link" onClick={() => setIsOpen(false)}>
                                {t('nav.register')}
                            </Link>
                        </>
                    )}
                    <button 
                        className="mobile-link" 
                        onClick={() => {
                            const newLang = i18n.language === 'en' ? 'hi' : 'en';
                            changeLanguage(newLang);
                        }}
                    >
                        <Globe size={18} style={{ marginRight: '8px' }} /> {t('nav.language')}: {currentLanguage}
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
