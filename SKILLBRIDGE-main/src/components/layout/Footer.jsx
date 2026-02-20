import React from 'react';
import '../../styles/Footer.css';
import logo from '../../assets/images/logo.png';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <img src={logo} alt="SkillBridgeAI" className="footer-logo" />
                        <p>Empowering rural youth with verified opportunities.</p>
                    </div>
                    <div className="footer-links">
                        <div>
                            <h4>Platform</h4>
                            <ul>
                                <li><a href="/jobs">Find Jobs</a></li>
                                <li><a href="/employer">For Employers</a></li>
                                <li><a href="/kiosk">Kiosk Locator</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4>Support</h4>
                            <ul>
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#">Contact Us</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} SkillBridgeAI. All rights reserved.</p>
                    <p>Made with ❤️ for India</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
