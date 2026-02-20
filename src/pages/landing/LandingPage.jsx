import React from 'react';
import {
    ShieldCheck, TrendingUp, Users, CheckCircle,
    BookOpen, Clock, Award, ArrowRight
} from 'lucide-react';
import '../../styles/LandingPage.css';
import { Link, useNavigate } from 'react-router-dom';
import studentImage from '../../assets/images/studnt.png';
import opportunityImage from '../../assets/images/os.png';
import heroImage from '../../assets/images/image.png';
import logo from '../../assets/images/logo.png';
import { useAuth } from '../../context/AuthContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="landing-page">
            {/* 1. Hero Section */}
            <section className="hero-section">
                <div className="container hero-grid">
                    <div className="hero-content">
                        <span className="hero-tag">Connecting Talent to Opportunity</span>
                        <h1 className="hero-title">
                            Get Hired. <span>Get Verified.</span>
                        </h1>
                        <p className="hero-subtitle">
                            India's first blockchain-verified employment platform for rural talent.
                            Connect with verified opportunities and prove your skills.
                        </p>
                        <div className="hero-cta-row">
                            <Link to="/onboarding">
                                <button className="lp-btn lp-btn-primary">I'm a Job Seeker</button>
                            </Link>
                            <Link to="/learning">
                                <button className="lp-btn lp-btn-outline">Start Learning</button>
                            </Link>
                        </div>
                        <div className="hero-trust-row">
                            <span><ShieldCheck size={18} /> Government Verified</span>
                            <span><Users size={18} /> 10L+ Candidates</span>
                            <span><CheckCircle size={18} /> 500+ Hiring Partners</span>
                        </div>
                    </div>
                    <div className="hero-image-wrap">
                        <img src={heroImage} alt="Rural Youth Empowerment" className="hero-img" />
                    </div>
                </div>
            </section>

            {/* 2. Problem + Solution Section */}
            <section className="problem-section">
                <div className="container">
                    <div className="problem-grid">
                        <div className="problem-card">
                            <div className="icon-circle"><Users size={24} /></div>
                            <h3>Youth unaware of matching jobs</h3>
                            <p>Millions of talented youth in rural India miss out on life-changing opportunities simply because they don't know they exist.</p>
                            <Link to="/jobs" className="learn-more-link">Learn More <ArrowRight size={14} /></Link>
                        </div>
                        <div className="problem-card">
                            <div className="icon-circle"><ShieldCheck size={24} /></div>
                            <h3>Verified Digital Profiles</h3>
                            <p>Build a trustworthy professional identity with blockchain-verified credentials that employers can rely on instantly.</p>
                            <Link to="/onboarding" className="learn-more-link">Learn More <ArrowRight size={14} /></Link>
                        </div>
                        <div className="problem-card">
                            <div className="icon-circle"><CheckCircle size={24} /></div>
                            <h3>Trusted Corporate Hiring Network</h3>
                            <p>Directly connect with India's top companies who are looking specifically for verified rural talent like you.</p>
                            <Link to="/employer" className="learn-more-link">Learn More <ArrowRight size={14} /></Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Why SkillBridge Section */}
            <section className="why-section">
                <div className="container">
                    <h2 className="section-label">Why Choose SkillBridge?</h2>
                    <p className="section-subtext">Bridging the gap between talent and opportunity with modern technology.</p>

                    <div className="why-grid">
                        <div className="problem-card">
                            <div className="icon-circle"><ShieldCheck size={24} /></div>
                            <h3>Verified Credentials</h3>
                            <p>Your records are secured by blockchain technology, making them tamper-proof and authentic.</p>
                        </div>
                        <div className="problem-card">
                            <div className="icon-circle"><TrendingUp size={24} /></div>
                            <h3>AI Skill Gap Analysis</h3>
                            <p>Our smart platform analyzes your current skills and guides you on exactly what you need to master next.</p>
                        </div>
                        <div className="problem-card">
                            <div className="icon-circle"><Users size={24} /></div>
                            <h3>Direct Job Matching</h3>
                            <p>No more long waits. Get matched with jobs that perfectly suit your verified skills and location.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Micro Learning Section */}
            <section className="learning-section">
                <div className="container learning-grid">
                    <div className="learning-text-block">
                        <span className="hero-tag">Skill Up Anywhere</span>
                        <h2 className="section-label" style={{ textAlign: 'left' }}>Master Skills with Micro Learning</h2>
                        <p className="hero-subtitle">Learn new skills in bite-sized lessons that fit into your daily life. Master the basics in minutes, not hours.</p>
                        <Link to="/learning">
                            <button className="lp-btn lp-btn-primary" style={{ marginTop: '12px' }}>Start Learning Now</button>
                        </Link>
                    </div>
                    <div className="learning-mini-list">
                        <div className="mini-card">
                            <div className="mini-icon"><Clock size={24} /></div>
                            <div className="mini-text">
                                <h4>5–15 Minute Lessons</h4>
                                <p>Short, focused modules designed for mobile engagement.</p>
                            </div>
                        </div>
                        <div className="mini-card">
                            <div className="mini-icon"><BookOpen size={24} /></div>
                            <div className="mini-text">
                                <h4>22+ Tech Modules</h4>
                                <p>From AI basics to digital literacy, curated for today's market.</p>
                            </div>
                        </div>
                        <div className="mini-card">
                            <div className="mini-icon"><Award size={24} /></div>
                            <div className="mini-text">
                                <h4>Earn Points & Badges</h4>
                                <p>Gamified learning that keeps you motivated and progress tracked.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Quick Actions Section */}
            <section className="start-section" style={{ backgroundColor: 'transparent' }}>
                <div className="container">
                    <h2 className="section-label">Where Do You Want to Start?</h2>
                    <p className="section-subtext">Find the right path — training, jobs, or guided career advice.</p>

                    <div className="start-grid">
                        <div className="start-card">
                            <div className="start-illustration">
                                <img src={studentImage} alt="Courses" />
                            </div>
                            <h3>Micro-Courses</h3>
                            <p>Explore verified courses specifically designed to bridge your skill gap.</p>
                            <Link to="/learning" style={{ width: '100%' }}>
                                <button className="lp-btn lp-btn-primary" style={{ width: '100%' }}>Search Courses</button>
                            </Link>
                        </div>
                        <div className="start-card">
                            <div className="start-illustration">
                                <img src={opportunityImage} alt="Jobs" />
                            </div>
                            <h3>Explore Jobs</h3>
                            <p>Search for verified job opportunities, apprenticeships, and localized roles.</p>
                            <Link to="/jobs" style={{ width: '100%' }}>
                                <button className="lp-btn lp-btn-primary" style={{ width: '100%' }}>Find Jobs</button>
                            </Link>
                        </div>
                        <div className="start-card">
                            <div className="start-illustration guidance-illustration">
                                <TrendingUp size={64} color="var(--accent)" />
                            </div>
                            <h3>Career Guidance</h3>
                            <p>Not sure where to begin? Use our AI to map your career path based on your potential.</p>
                            <Link to="/onboarding" style={{ width: '100%' }}>
                                <button className="lp-btn lp-btn-accent" style={{ width: '100%' }}>Explore Guidance</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container text-center">
                    <h2 className="cta-title">Ready to start your career journey?</h2>
                    <p className="cta-subtitle">Join 10L+ candidates securing their future today.</p>
                    <div className="cta-actions">
                        <Link to="/onboarding">
                            <button className="lp-btn lp-btn-primary" style={{ padding: '0 40px' }}>Create Free Profile</button>
                        </Link>
                        {!user.isAuthenticated && (
                            <Link to="/login">
                                <button className="lp-btn lp-btn-outline-inverted">Login</button>
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer is handled globally in App.jsx */}
        </div>
    );
};

export default LandingPage;
