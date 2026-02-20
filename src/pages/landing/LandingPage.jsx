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
import { useLanguage } from '../../context/LanguageContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLanguage();

    return (
        <div className="landing-page">
            {/* 1. Hero Section */}
            <section className="hero-section">
                <div className="container hero-grid">
                    <div className="hero-content">
                        <span className="hero-tag">{t('connectingTalent')}</span>
                        <h1 className="hero-title">
                            {t('getHired')} <span>{t('getVerified')}</span>
                        </h1>
                        <p className="hero-subtitle">
                            {t('platformDescription')}
                        </p>
                        <div className="hero-cta-row">
                            <Link to="/onboarding">
                                <button className="lp-btn lp-btn-primary">{t('imJobSeeker')}</button>
                            </Link>
                            <Link to="/learning">
                                <button className="lp-btn lp-btn-outline">{t('startLearning')}</button>
                            </Link>
                        </div>
                        <div className="hero-trust-row">
                            <span><ShieldCheck size={18} /> {t('govVerified')}</span>
                            <span><Users size={18} /> {t('candidatesCount')}</span>
                            <span><CheckCircle size={18} /> {t('hiringPartners')}</span>
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
                            <h3>{t('youthUnawareJobs')}</h3>
                            <p>{t('youthUnawareDesc')}</p>
                            <Link to="/jobs" className="learn-more-link">{t('learnMore')} <ArrowRight size={14} /></Link>
                        </div>
                        <div className="problem-card">
                            <div className="icon-circle"><ShieldCheck size={24} /></div>
                            <h3>{t('verifiedProfiles')}</h3>
                            <p>{t('verifiedProfilesDesc')}</p>
                            <Link to="/onboarding" className="learn-more-link">{t('learnMore')} <ArrowRight size={14} /></Link>
                        </div>
                        <div className="problem-card">
                            <div className="icon-circle"><CheckCircle size={24} /></div>
                            <h3>{t('trustedHiring')}</h3>
                            <p>{t('trustedHiringDesc')}</p>
                            <Link to="/employer" className="learn-more-link">{t('learnMore')} <ArrowRight size={14} /></Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Why SkillBridge Section */}
            <section className="why-section">
                <div className="container">
                    <h2 className="section-label">{t('whyChoose')}</h2>
                    <p className="section-subtext">{t('bridgingGap')}</p>

                    <div className="why-grid">
                        <div className="problem-card">
                            <div className="icon-circle"><ShieldCheck size={24} /></div>
                            <h3>{t('verifiedCredentials')}</h3>
                            <p>{t('verifiedCredentialsDesc')}</p>
                        </div>
                        <div className="problem-card">
                            <div className="icon-circle"><TrendingUp size={24} /></div>
                            <h3>{t('aiSkillGap')}</h3>
                            <p>{t('aiSkillGapDesc')}</p>
                        </div>
                        <div className="problem-card">
                            <div className="icon-circle"><Users size={24} /></div>
                            <h3>{t('directJobMatching')}</h3>
                            <p>{t('directJobMatchingDesc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Micro Learning Section */}
            <section className="learning-section">
                <div className="container learning-grid">
                    <div className="learning-text-block">
                        <span className="hero-tag">{t('skillUpAnywhere')}</span>
                        <h2 className="section-label" style={{ textAlign: 'left' }}>{t('masterMicroLearning')}</h2>
                        <p className="hero-subtitle">{t('microLearningDesc')}</p>
                        <Link to="/learning">
                            <button className="lp-btn lp-btn-primary" style={{ marginTop: '12px' }}>{t('startLearningNow')}</button>
                        </Link>
                    </div>
                    <div className="learning-mini-list">
                        <div className="mini-card">
                            <div className="mini-icon"><Clock size={24} /></div>
                            <div className="mini-text">
                                <h4>{t('shortLessons')}</h4>
                                <p>{t('shortLessonsDesc')}</p>
                            </div>
                        </div>
                        <div className="mini-card">
                            <div className="mini-icon"><BookOpen size={24} /></div>
                            <div className="mini-text">
                                <h4>{t('techModules')}</h4>
                                <p>{t('techModulesDesc')}</p>
                            </div>
                        </div>
                        <div className="mini-card">
                            <div className="mini-icon"><Award size={24} /></div>
                            <div className="mini-text">
                                <h4>{t('earnBadges')}</h4>
                                <p>{t('earnBadgesDesc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Quick Actions Section */}
            <section className="start-section" style={{ backgroundColor: 'transparent' }}>
                <div className="container">
                    <h2 className="section-label">{t('whereToStart')}</h2>
                    <p className="section-subtext">{t('findRightPath')}</p>

                    <div className="start-grid">
                        <div className="start-card">
                            <div className="start-illustration">
                                <img src={studentImage} alt="Courses" />
                            </div>
                            <h3>{t('microCourses')}</h3>
                            <p>{t('microCoursesDesc')}</p>
                            <Link to="/learning" style={{ width: '100%' }}>
                                <button className="lp-btn lp-btn-primary" style={{ width: '100%' }}>{t('searchCourses')}</button>
                            </Link>
                        </div>
                        <div className="start-card">
                            <div className="start-illustration">
                                <img src={opportunityImage} alt="Jobs" />
                            </div>
                            <h3>{t('exploreJobs')}</h3>
                            <p>{t('exploreJobsDesc')}</p>
                            <Link to="/jobs" style={{ width: '100%' }}>
                                <button className="lp-btn lp-btn-primary" style={{ width: '100%' }}>{t('findJobs')}</button>
                            </Link>
                        </div>
                        <div className="start-card">
                            <div className="start-illustration guidance-illustration">
                                <TrendingUp size={64} color="var(--accent)" />
                            </div>
                            <h3>{t('careerGuidance')}</h3>
                            <p>{t('careerGuidanceDesc')}</p>
                            <Link to="/onboarding" style={{ width: '100%' }}>
                                <button className="lp-btn lp-btn-accent" style={{ width: '100%' }}>{t('exploreGuidance')}</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container text-center">
                    <h2 className="cta-title">{t('readyToStart')}</h2>
                    <p className="cta-subtitle">{t('joinCandidates')}</p>
                    <div className="cta-actions">
                        <Link to="/onboarding">
                            <button className="lp-btn lp-btn-primary" style={{ padding: '0 40px' }}>{t('createProfile')}</button>
                        </Link>
                        {!user.isAuthenticated && (
                            <Link to="/login">
                                <button className="lp-btn lp-btn-outline-inverted">{t('login')}</button>
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
