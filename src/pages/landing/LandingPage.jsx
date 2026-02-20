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
import { useLanguage } from '../../context/LanguageContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLanguage();
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
                        <Badge variant="primary" className="mb-4">{t('heroTagline')}</Badge>
                        <h1 className="hero-title">
                            {t('heroTitle1')} <span className="text-accent">{t('heroTitle2')}</span>
                        </h1>
                        <p className="hero-subtitle">
                            {t('heroSubtitle')}
                        </p>
                        <div className="hero-actions">
                            <Link to="/onboarding">
                                <Button size="lg" variant="primary">{t('jobSeeker')}</Button>
                            </Link>
                            <Link to="/learning">
                                <Button size="lg" variant="secondary">
                                    <BookOpen size={20} style={{ marginRight: '8px' }} />
                                    {t('startLearning')}
                                </Button>
                            </Link>
                        </div>
                        <div className="trust-badges">
                            <div className="trust-item">
                                <ShieldCheck size={20} className="text-success" />
                                <span>{t('governmentVerified')}</span>
                            </div>
                            <div className="trust-item">
                                <Users size={20} className="text-primary" />
                                <span>{t('candidates10L')}</span>
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
                            <p className="stats-label">{t('youthUnaware')}</p>
                        </Card>
                        <Card className="stats-card">
                            <h3 className="stats-number">100%</h3>
                            <p className="stats-label">{t('verifiedProfiles')}</p>
                        </Card>
                        <Card className="stats-card">
                            <h3 className="stats-number">500+</h3>
                            <p className="stats-label">{t('corporatePartners')}</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Value Prop Section */}
            <section className="section bg-white">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">{t('whyChoose')}</h2>
                        <p className="section-subtitle">{t('bridgingGap')}</p>
                    </div>

                    <div className="process-flow">
                        <div className="process-step step-orange">
                            <div className="step-pin">
                                <div className="pin-icon">
                                    <Users size={28} />
                                </div>
                            </div>
                            <h3 className="step-title">{t('verifiedCredentialsTitle')}</h3>
                            <p className="step-description">{t('verifiedCredentialsDesc')}</p>
                        </div>

                        <div className="process-step step-green">
                            <div className="step-pin">
                                <div className="pin-icon">
                                    <TrendingUp size={28} />
                                </div>
                            </div>
                            <h3 className="step-title">{t('skillGapAnalysisTitle')}</h3>
                            <p className="step-description">{t('skillGapAnalysisDesc')}</p>
                        </div>

                        <div className="process-step step-red">
                            <div className="step-pin">
                                <div className="pin-icon">
                                    <CheckCircle size={28} />
                                </div>
                            </div>
                            <h3 className="step-title">{t('instantMatchingTitle')}</h3>
                            <p className="step-description">{t('instantMatchingDesc')}</p>
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
                            {t('microLearningTitle')}
                        </h2>
                        <p className="section-subtitle">{t('microLearningSubtitle')}</p>
                    </div>

                    <div className="microlearning-grid">
                        <Card className="microlearning-card">
                            <div className="microlearning-icon">
                                <Clock size={40} />
                            </div>
                            <h3>{t('lessonDuration')}</h3>
                            <p>{t('lessonDurationDesc')}</p>
                        </Card>

                        <Card className="microlearning-card">
                            <div className="microlearning-icon">
                                <BookOpen size={40} />
                            </div>
                            <h3>{t('techModules')}</h3>
                            <p>{t('techModulesDesc')}</p>
                        </Card>

                        <Card className="microlearning-card">
                            <div className="microlearning-icon">
                                <Award size={40} />
                            </div>
                            <h3>{t('earnBadges')}</h3>
                            <p>{t('earnBadgesDesc')}</p>
                        </Card>
                    </div>

                    <div className="microlearning-cta">
                        <Link to="/learning">
                            <Button size="lg" variant="primary">
                                <BookOpen size={20} style={{ marginRight: '8px' }} />
                                {t('startLearningNow')}
                            </Button>
                        </Link>
                        <p className="microlearning-cta-text">{t('freeSelfPaced')}</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container text-center">
                    <h2>{t('readyCareer')}</h2>
                    <p className="mb-6">{t('joinThousands')}</p>
                    <div className="hero-actions" style={{ justifyContent: 'center' }}>
                        {user.isAuthenticated ? (
                            <Link to={user.role === 'employer' ? '/employer' : '/dashboard'}>
                                <Button size="lg" variant="secondary">
                                    <LayoutDashboard size={20} style={{ marginRight: '8px' }} />
                                    {t('goToDashboard')}
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button size="lg" variant="secondary">
                                        <LogIn size={20} style={{ marginRight: '8px' }} />
                                        {t('login')}
                                    </Button>
                                </Link>
                                <Link to="/onboarding">
                                    <Button size="lg" variant="secondary">{t('createProfile')}</Button>
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
                        <span>{t('opportunitiesNear')}</span>
                    </div>

                    <div className="action-cards-grid">
                        {/* Student Card */}
                        <Card className="action-card student-card">
                            <h2 className="action-card-title">{t('studentTitle')}</h2>
                            <p className="action-card-subtitle">{t('student')}</p>

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
                                    <option value="">{t('selectInterest')}</option>
                                    <option value="automotive">Automotive</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="retail">Retail</option>
                                    <option value="hospitality">Hospitality</option>
                                </select>
                            </div>

                            <p className="card-hint">{t('interestHint')}</p>

                            <button className="action-button" onClick={handleFindCourse}>
                                {t('findCourse')}
                            </button>
                        </Card>

                        {/* Opportunities Card */}
                        <Card className="action-card opportunities-card">
                            <h2 className="action-card-title">{t('exploreTitle')}</h2>
                            <p className="action-card-subtitle">{t('opportunities')}</p>

                            <div className="card-illustration opportunities-illustration">
                                <img src={opportunityImage} alt="Opportunities" className="illustration-image" />
                            </div>

                            <div className="card-input">
                                <Grid size={20} className="input-icon" />
                                <input
                                    type="text"
                                    placeholder={t('searchJobExchange')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="text-input"
                                />
                                <Search size={20} className="search-icon" />
                            </div>

                            <p className="card-hint">{t('opportunitiesHint')}</p>

                            <button className="action-button" onClick={handleFindJob}>
                                {t('findJob')}
                            </button>
                        </Card>

                        {/* Guidance Card */}
                        <Card className="action-card guidance-card">
                            <div className="guidance-header">
                                <div>
                                    <h2 className="action-card-title">{t('notSure')}</h2>
                                    <h2 className="action-card-title">{t('whereBegin')}</h2>
                                </div>
                                <div className="help-icon">
                                    <HelpCircle size={32} />
                                </div>
                            </div>

                            <p className="guidance-subtitle">{t('guidanceSubtitle')}</p>

                            <div className="guidance-form">
                                <label className="guidance-label">{t('educationLevelQuestion')}</label>
                                <select
                                    value={educationLevel}
                                    onChange={(e) => setEducationLevel(e.target.value)}
                                    className="select-input"
                                >
                                    <option value="">{t('selectEducation')}</option>
                                    <option value="10th">10th Pass</option>
                                    <option value="12th">12th Pass</option>
                                    <option value="graduate">Graduate</option>
                                    <option value="postgraduate">Post Graduate</option>
                                    <option value="diploma">Diploma</option>
                                </select>
                            </div>

                            <button className="action-button guidance-button" onClick={handleGuidanceNext}>
                                {t('next')}
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
