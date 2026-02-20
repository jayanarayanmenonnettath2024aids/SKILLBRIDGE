import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, Users, CheckCircle, MapPin, Search, Grid, HelpCircle, BookOpen, Clock, Award, LogIn, LayoutDashboard } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import '../../styles/LandingPage.css';
import { Link, useNavigate } from 'react-router-dom';
import studentImage from '../../assets/images/studnt.png';
import opportunityImage from '../../assets/images/os.png';
import heroImage from '../../assets/images/image.png';
import { useAuth } from '../../context/AuthContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedInterest, setSelectedInterest] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [educationLevel, setEducationLevel] = useState('');

    const handleFindCourse = () => {
        navigate('/jobs?type=training');
    };

    const handleFindJob = () => {
        navigate('/certificate-upload');
    };

    const handleGuidanceNext = () => {
        navigate('/onboarding');
    };

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content">
                        <Badge variant="primary" className="mb-4">Connecting Talent to Opportunity</Badge>
                        <h1 className="hero-title">
                            Get Hired. Get Verified. <span className="text-accent">Get Ahead.</span>
                        </h1>
                        <p className="hero-subtitle">
                            India's first blockchain-verified employment platform for rural talent.
                            Connect with top employers and prove your skills instantly.
                        </p>
                        <div className="hero-actions">
                            <Link to="/onboarding">
                                <Button size="lg" variant="primary">I'm a Job Seeker</Button>
                            </Link>
                            <Link to="/learning">
                                <Button size="lg" variant="secondary">
                                    <BookOpen size={20} style={{ marginRight: '8px' }} />
                                    Start Learning
                                </Button>
                            </Link>
                        </div>
                        <div className="trust-badges">
                            <div className="trust-item">
                                <ShieldCheck size={20} className="text-success" />
                                <span>Government Verified</span>
                            </div>
                            <div className="trust-item">
                                <Users size={20} className="text-primary" />
                                <span>10L+ Candidates</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-image">
                        {/* Placeholder for Hero Image - would use an actual image here */}
                        <div className="hero-image-placeholder">
                            <img src={heroImage} alt="Rural Youth Empowerment" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <Card className="stats-card">
                            <h3 className="stats-number">72%</h3>
                            <p className="stats-label">Youth unaware of matching jobs</p>
                        </Card>
                        <Card className="stats-card">
                            <h3 className="stats-number">100%</h3>
                            <p className="stats-label">Verified Profiles</p>
                        </Card>
                        <Card className="stats-card">
                            <h3 className="stats-number">500+</h3>
                            <p className="stats-label">Corporate Partners</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Value Prop Section */}
            <section className="section bg-white">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">Why Choose SkillBridge?</h2>
                        <p className="section-subtitle">Bridging the gap between talent and opportunity.</p>
                    </div>

                    <div className="process-flow">
                        <div className="process-step step-orange">
                            <div className="step-pin">
                                <div className="pin-icon">
                                    <Users size={28} />
                                </div>
                            </div>
                            <h3 className="step-title">Verified Credentials</h3>
                            <p className="step-description">Your skills and education are verified on the blockchain. No more fake resumes.</p>
                        </div>

                        <div className="process-step step-green">
                            <div className="step-pin">
                                <div className="pin-icon">
                                    <TrendingUp size={28} />
                                </div>
                            </div>
                            <h3 className="step-title">Skill-Gap Analysis</h3>
                            <p className="step-description">Find out exactly what skills you need to get your dream job with our AI assessment.</p>
                        </div>

                        <div className="process-step step-red">
                            <div className="step-pin">
                                <div className="pin-icon">
                                    <CheckCircle size={28} />
                                </div>
                            </div>
                            <h3 className="step-title">Instant Matching</h3>
                            <p className="step-description">Our AI matches you with jobs that fit your profile perfectly. Apply with one click.</p>
                        </div>

                        <div className="arrow-point"></div>
                    </div>
                </div>
            </section>

            {/* Micro Learning Section */}
            <section className="section microlearning-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">
                            <BookOpen size={32} style={{ display: 'inline-block', marginRight: '12px', verticalAlign: 'middle', color: 'var(--color-primary)' }} />
                            Master Skills with Micro Learning
                        </h2>
                        <p className="section-subtitle">Learn new skills in bite-sized lessons. Master the basics in minutes, not hours.</p>
                    </div>

                    <div className="microlearning-grid">
                        <Card className="microlearning-card">
                            <div className="microlearning-icon">
                                <Clock size={40} />
                            </div>
                            <h3>5-15 Minute Lessons</h3>
                            <p>Short, focused lessons that fit into your busy schedule</p>
                        </Card>

                        <Card className="microlearning-card">
                            <div className="microlearning-icon">
                                <BookOpen size={40} />
                            </div>
                            <h3>22+ Tech Modules</h3>
                            <p>AI, Machine Learning, Web Dev, Cybersecurity & More</p>
                        </Card>

                        <Card className="microlearning-card">
                            <div className="microlearning-icon">
                                <Award size={40} />
                            </div>
                            <h3>Earn Points & Badges</h3>
                            <p>Track your progress and showcase your achievements</p>
                        </Card>
                    </div>

                    <div className="microlearning-cta">
                        <Link to="/learning">
                            <Button size="lg" variant="primary">
                                <BookOpen size={20} style={{ marginRight: '8px' }} />
                                Start Learning Now
                            </Button>
                        </Link>
                        <p className="microlearning-cta-text">Free • Self-paced • Certificate Ready</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container text-center">
                    <h2>Ready to start your career journey?</h2>
                    <p className="mb-6">Join thousands of others securing their future today.</p>
                    <div className="hero-actions" style={{ justifyContent: 'center' }}>
                        {user.isAuthenticated ? (
                            <Link to={user.role === 'employer' ? '/employer' : '/dashboard'}>
                                <Button size="lg" variant="secondary">
                                    <LayoutDashboard size={20} style={{ marginRight: '8px' }} />
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button size="lg" variant="secondary">
                                        <LogIn size={20} style={{ marginRight: '8px' }} />
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/onboarding">
                                    <Button size="lg" variant="secondary">Create Free Profile</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Quick Action Cards Section */}
            <section className="quick-actions-section">
                <div className="container">
                    <div className="opportunities-link">
                        <MapPin size={20} />
                        <span>Opportunities near you</span>
                    </div>

                    <div className="action-cards-grid">
                        {/* Student Card */}
                        <Card className="action-card student-card">
                            <h2 className="action-card-title">I want to be a...</h2>
                            <p className="action-card-subtitle">Student</p>

                            <div className="card-illustration student-illustration">
                                <img src={studentImage} alt="Student" className="illustration-image" />
                            </div>

                            <div className="card-input">
                                <Grid size={20} className="input-icon" />
                                <select
                                    value={selectedInterest}
                                    onChange={(e) => setSelectedInterest(e.target.value)}
                                    className="select-input"
                                >
                                    <option value="">Select Interest Area</option>
                                    <option value="automotive">Automotive</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="retail">Retail</option>
                                    <option value="hospitality">Hospitality</option>
                                </select>
                            </div>

                            <p className="card-hint">Interest areas like Automotive, Electronics etc.</p>

                            <button className="action-button" onClick={handleFindCourse}>
                                FIND COURSE
                            </button>
                        </Card>

                        {/* Opportunities Card */}
                        <Card className="action-card opportunities-card">
                            <h2 className="action-card-title">I want to explore...</h2>
                            <p className="action-card-subtitle">Opportunities</p>

                            <div className="card-illustration opportunities-illustration">
                                <img src={opportunityImage} alt="Opportunities" className="illustration-image" />
                            </div>

                            <div className="card-input">
                                <Grid size={20} className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="Search Job Exchange"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="text-input"
                                />
                                <Search size={20} className="search-icon" />
                            </div>

                            <p className="card-hint">Opportunities for Job Exchange, Apprenticeship and Entrepreneurship</p>

                            <button className="action-button" onClick={handleFindJob}>
                                FIND JOB
                            </button>
                        </Card>

                        {/* Guidance Card */}
                        <Card className="action-card guidance-card">
                            <div className="guidance-header">
                                <div>
                                    <h2 className="action-card-title">Not Sure</h2>
                                    <h2 className="action-card-title">Where To Begin?</h2>
                                </div>
                                <div className="help-icon">
                                    <HelpCircle size={32} />
                                </div>
                            </div>

                            <p className="guidance-subtitle">Answer a few simple questions and we will help you.</p>

                            <div className="guidance-form">
                                <label className="guidance-label">What is your highest education level?</label>
                                <select
                                    value={educationLevel}
                                    onChange={(e) => setEducationLevel(e.target.value)}
                                    className="select-input"
                                >
                                    <option value="">Select Education</option>
                                    <option value="10th">10th Pass</option>
                                    <option value="12th">12th Pass</option>
                                    <option value="graduate">Graduate</option>
                                    <option value="postgraduate">Post Graduate</option>
                                    <option value="diploma">Diploma</option>
                                </select>
                            </div>

                            <button className="action-button guidance-button" onClick={handleGuidanceNext}>
                                NEXT
                            </button>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
};
// Helper component for badges used in this file if not auto-imported
const Badge = ({ children, variant, className }) => (
    <span className={`badge badge-${variant} ${className}`}>{children}</span>
);

export default LandingPage;
