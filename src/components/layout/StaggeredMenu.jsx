import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo.png';
import '../../styles/StaggeredMenu.css';

export const StaggeredMenu = ({
    position = 'right',
    colors = ['var(--bg-secondary)', 'var(--bg-tertiary)', 'var(--primary)'],
    displaySocials = true,
    displayItemNumbering = true,
    className,
    logoUrl = logo,
    menuButtonColor = 'var(--menu-color)',
    openMenuButtonColor = 'var(--text-inverted)',
    accentColor = 'var(--primary)',
    changeMenuColorOnOpen = true,
    isFixed = true,
    closeOnClickAway = true,
    onMenuOpen,
    onMenuClose
}) => {
    const [open, setOpen] = useState(false);
    const openRef = useRef(false);
    const panelRef = useRef(null);
    const preLayersRef = useRef(null);
    const preLayerElsRef = useRef([]);
    const plusHRef = useRef(null);
    const plusVRef = useRef(null);
    const iconRef = useRef(null);
    const textInnerRef = useRef(null);
    const toggleBtnRef = useRef(null);
    const [textLines, setTextLines] = useState(['Menu', 'Close']);

    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const openTlRef = useRef(null);
    const closeTweenRef = useRef(null);
    const spinTweenRef = useRef(null);
    const textCycleAnimRef = useRef(null);
    const colorTweenRef = useRef(null);
    const busyRef = useRef(false);

    // Define Menu Items based on Auth State
    const menuItems = [
        { label: 'Find Jobs', link: '/jobs' },
        { label: 'Internships', link: '/internships' },
        { label: 'Skill Gap', link: '/skillgap' },
        { label: 'Start Learning', link: '/learning' },
        { label: 'Kiosk Mode', link: '/kiosk' },
    ];

    if (!(user.isAuthenticated && user.role === 'candidate')) {
        menuItems.push({ label: 'For Employers', link: '/employer' });
    }

    const socialItems = [
        { label: 'LinkedIn', link: '#' },
        { label: 'Twitter', link: '#' },
        { label: 'Instagram', link: '#' },
    ];

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const panel = panelRef.current;
            const preContainer = preLayersRef.current;
            const plusH = plusHRef.current;
            const plusV = plusVRef.current;
            const icon = iconRef.current;
            const textInner = textInnerRef.current;
            if (!panel || !plusH || !plusV || !icon || !textInner) return;

            let preLayers = [];
            if (preContainer) {
                preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
            }
            preLayerElsRef.current = preLayers;

            const offscreen = position === 'left' ? -100 : 100;
            gsap.set([panel, ...preLayers], { xPercent: offscreen });
            gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
            gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
            gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
            gsap.set(textInner, { yPercent: 0 });
            if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
        });
        return () => ctx.revert();
    }, [menuButtonColor, position]);

    const buildOpenTimeline = useCallback(() => {
        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        if (!panel) return null;

        openTlRef.current?.kill();
        if (closeTweenRef.current) {
            closeTweenRef.current.kill();
            closeTweenRef.current = null;
        }

        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

        const layerStates = layers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));
        const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 });
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        const tl = gsap.timeline({ paused: true });

        layerStates.forEach((ls, i) => {
            tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
        });

        const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
        const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
        const panelDuration = 0.65;

        tl.fromTo(panel, { xPercent: panelStart }, { xPercent: 0, duration: panelDuration, ease: 'power4.out' }, panelInsertTime);

        if (itemEls.length) {
            const itemsStart = panelInsertTime + panelDuration * 0.15;
            tl.to(itemEls, {
                yPercent: 0,
                rotate: 0,
                duration: 1,
                ease: 'power4.out',
                stagger: { each: 0.1, from: 'start' }
            }, itemsStart);

            if (numberEls.length) {
                tl.to(numberEls, {
                    duration: 0.6,
                    ease: 'power2.out',
                    '--sm-num-opacity': 1,
                    stagger: { each: 0.08, from: 'start' }
                }, itemsStart + 0.1);
            }
        }

        if (socialTitle || socialLinks.length) {
            const socialsStart = panelInsertTime + panelDuration * 0.4;
            if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
            if (socialLinks.length) {
                tl.to(socialLinks, {
                    y: 0,
                    opacity: 1,
                    duration: 0.55,
                    ease: 'power3.out',
                    stagger: { each: 0.08, from: 'start' }
                }, socialsStart + 0.04);
            }
        }

        openTlRef.current = tl;
        return tl;
    }, []);

    const playOpen = useCallback(() => {
        if (busyRef.current) return;
        busyRef.current = true;
        const tl = buildOpenTimeline();
        if (tl) {
            tl.eventCallback('onComplete', () => { busyRef.current = false; });
            tl.play(0);
        } else {
            busyRef.current = false;
        }
    }, [buildOpenTimeline]);

    const playClose = useCallback(() => {
        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        if (!panel) return;

        const all = [...layers, panel];
        closeTweenRef.current?.kill();
        const offscreen = position === 'left' ? -100 : 100;

        closeTweenRef.current = gsap.to(all, {
            xPercent: offscreen,
            duration: 0.32,
            ease: 'power3.in',
            overwrite: 'auto',
            onComplete: () => {
                busyRef.current = false;
            }
        });
    }, [position]);

    const animateIcon = useCallback(opening => {
        const icon = iconRef.current;
        if (!icon) return;
        spinTweenRef.current?.kill();
        if (opening) {
            spinTweenRef.current = gsap.to(icon, { rotate: 225, duration: 0.8, ease: 'power4.out', overwrite: 'auto' });
        } else {
            spinTweenRef.current = gsap.to(icon, { rotate: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' });
        }
    }, []);

    const animateColor = useCallback(opening => {
        const btn = toggleBtnRef.current;
        if (!btn) return;
        colorTweenRef.current?.kill();
        if (changeMenuColorOnOpen) {
            const targetColor = opening ? openMenuButtonColor : menuButtonColor;
            colorTweenRef.current = gsap.to(btn, {
                color: targetColor,
                delay: 0.18,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }, [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]);

    const animateText = useCallback(opening => {
        const inner = textInnerRef.current;
        if (!inner) return;
        textCycleAnimRef.current?.kill();

        const currentLabel = opening ? 'Menu' : 'Close';
        const targetLabel = opening ? 'Close' : 'Menu';
        const seq = [currentLabel, targetLabel === 'Close' ? 'Close' : 'Menu', targetLabel];
        setTextLines(seq);

        gsap.set(inner, { yPercent: 0 });
        const lineCount = seq.length;
        const finalShift = ((lineCount - 1) / lineCount) * 100;
        textCycleAnimRef.current = gsap.to(inner, {
            yPercent: -finalShift,
            duration: 0.6,
            ease: 'power4.out'
        });
    }, []);

    const toggleMenu = useCallback(() => {
        const target = !openRef.current;
        openRef.current = target;
        setOpen(target);
        if (target) {
            onMenuOpen?.();
            playOpen();
        } else {
            onMenuClose?.();
            playClose();
        }
        animateIcon(target);
        animateColor(target);
        animateText(target);
    }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

    const closeMenu = useCallback(() => {
        if (openRef.current) {
            openRef.current = false;
            setOpen(false);
            onMenuClose?.();
            playClose();
            animateIcon(false);
            animateColor(false);
            animateText(false);
        }
    }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/');
    };

    React.useEffect(() => {
        if (!closeOnClickAway || !open) return;
        const handleClickOutside = event => {
            if (panelRef.current && !panelRef.current.contains(event.target) && !toggleBtnRef.current.contains(event.target)) {
                closeMenu();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeOnClickAway, open, closeMenu]);

    return (
        <div
            className={(className ? className + ' ' : '') + 'staggered-menu-wrapper' + (isFixed ? ' fixed-wrapper' : '')}
            style={accentColor ? { ['--sm-accent']: accentColor } : undefined}
            data-position={position}
            data-open={open || undefined}
        >
            <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
                {colors.map((c, i) => <div key={i} className="sm-prelayer" style={{ background: c }} />)}
            </div>

            <header className="staggered-menu-header">
                <div className="sm-logo">
                    <Link to="/" onClick={closeMenu}>
                        <img src={logoUrl} alt="Logo" className="sm-logo-img" />
                    </Link>
                </div>
                <button
                    ref={toggleBtnRef}
                    className="sm-toggle"
                    onClick={toggleMenu}
                    aria-expanded={open}
                >
                    <span className="sm-toggle-textWrap">
                        <span ref={textInnerRef} className="sm-toggle-textInner">
                            {textLines.map((l, i) => <span className="sm-toggle-line" key={i}>{l}</span>)}
                        </span>
                    </span>
                    <span ref={iconRef} className="sm-icon">
                        <span ref={plusHRef} className="sm-icon-line" />
                        <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
                    </span>
                </button>
            </header>

            <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel">
                <div className="sm-panel-inner">
                    <ul className="sm-panel-list" data-numbering={displayItemNumbering || undefined}>
                        {menuItems.map((it, idx) => (
                            <li className="sm-panel-itemWrap" key={idx}>
                                <Link className="sm-panel-item" to={it.link} onClick={closeMenu} data-index={idx + 1}>
                                    <span className="sm-panel-itemLabel">{it.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="sm-auth-section">
                        <div className="sm-panel-itemLabel sm-auth-title">Account</div>
                        <div className="sm-auth-links">
                            {user.isAuthenticated ? (
                                <>
                                    <Link to={user.role === 'employer' ? '/employer' : '/dashboard'} className="sm-auth-link" onClick={closeMenu}>
                                        <LayoutDashboard size={20} /> Dashboard
                                    </Link>
                                    <button className="sm-auth-link btn-logout" onClick={handleLogout}>
                                        <LogOut size={20} /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="sm-auth-link" onClick={closeMenu}>
                                        <LogIn size={20} /> Login
                                    </Link>
                                    <Link to="/onboarding" className="sm-auth-link" onClick={closeMenu}>
                                        <UserPlus size={20} /> Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {displaySocials && (
                        <div className="sm-socials">
                            <h3 className="sm-socials-title">Socials</h3>
                            <ul className="sm-socials-list">
                                {socialItems.map((s, i) => (
                                    <li key={i} className="sm-socials-item">
                                        <a href={s.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link">
                                            {s.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
};

export default StaggeredMenu;
