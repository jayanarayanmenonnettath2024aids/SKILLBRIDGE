import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/LandingPage.css'; // Shared styles for footer
import logo from '../../assets/images/logo.png';

const Footer = () => {
    return (
        <footer className="footer-new">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <img src={logo} alt="SkillBridge" style={{ height: '40px' }} />
                        <p>Empowering rural India with blockchain-verified employment and AI-driven growth.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Platform</h4>
                        <ul>
                            <li><Link to="/jobs">Find Jobs</Link></li>
                            <li><Link to="/learning">Micro Learning</Link></li>
                            <li><Link to="/internships">Internships</Link></li>
                            <li><Link to="/skillgap">Skill Gap Analysis</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/employer">For Employers</Link></li>
                            <li><Link to="/kiosk">Kiosk Mode</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Contact Support</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 SkillBridge AI Platform. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
