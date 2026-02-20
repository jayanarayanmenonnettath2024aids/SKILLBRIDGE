import React from 'react';
import MatchScore from '../../components/dashboard/MatchScore';
import CredentialCard from '../../components/dashboard/CredentialCard';
import '../../styles/Dashboard.css';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { Briefcase, TrendingUp, BookOpen, Clock, Users, MapPin, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

const CandidateDashboard = () => {
    const { user } = useAuth();

    // Mock Data
    const jobMatches = [
        { title: 'Data Entry Operator', company: 'TechServe Solutions', score: 92 },
        { title: 'Retail Associate', company: 'Reliance Retail', score: 78 },
        { title: 'Delivery Partner', company: 'Swiggy', score: 65 },
    ];

    const credentials = [
        { title: '12th Standard Pass', issuer: 'CBSE Board', date: 'May 2023', hash: '0x7f...3a2b', verified: true },
        { title: 'Data Entry Basics', issuer: 'Skill India', date: 'Aug 2023', hash: '0x9c...1d4e', verified: true },
    ];

    const microCourses = [
        {
            title: 'Excel for Beginners',
            provider: 'Skill India',
            duration: '2 hrs',
            level: 'Beginner',
            enrolled: '2.4k enrolled',
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
        },
        {
            title: 'English Communication',
            provider: 'British Council',
            duration: '3 hrs',
            level: 'Intermediate',
            enrolled: '5.2k enrolled',
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop',
        },
        {
            title: 'Digital Marketing Basics',
            provider: 'Google Digital Garage',
            duration: '4 hrs',
            level: 'Beginner',
            enrolled: '8.1k enrolled',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
        },
    ];

    const internships = [
        {
            title: 'Data Entry Intern',
            company: 'TCS',
            initial: 'T',
            color: '#6366f1',
            location: 'Bangalore',
            duration: '6 Months',
            stipend: '₹12,000/month',
        },
        {
            title: 'Customer Service Intern',
            company: 'Flipkart',
            initial: 'F',
            color: '#f59e0b',
            location: 'Delhi',
            duration: '3 Months',
            stipend: '₹18,000/month',
        },
        {
            title: 'Marketing Intern',
            company: 'Reliance',
            initial: 'R',
            color: '#3b82f6',
            location: 'Mumbai',
            duration: '4 Months',
            stipend: '₹15,000/month',
        },
    ];

    return (
        <div className="dashboard-container">
            {/* 1. Header Strip */}
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Good Morning, {user.name || 'Rahul'}</h1>
                    <p className="dashboard-subtitle">Here is your career progress overview</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Link to="/skillgap">
                        <Button variant="ghost" style={{ padding: '0 20px' }}>
                            Skill Gap Analysis
                        </Button>
                    </Link>
                    <Link to="/jobs">
                        <Button className="onboarding-btn-primary" style={{ padding: '0 24px', height: '44px' }}>
                            Find Jobs
                        </Button>
                    </Link>
                </div>
            </header>

            {/* 2. Top Grid - Overview */}
            <div className="dashboard-top-grid">
                {/* Left - Career Matches */}
                <div className="dashboard-card">
                    <div className="section-title-row">
                        <h3>Your Career Matches</h3>
                        <Link to="/jobs" className="view-all-link">View All</Link>
                    </div>
                    <div className="job-matches-inner-grid">
                        {jobMatches.map((job, index) => (
                            <div key={index} className="job-match-card-premium">
                                <MatchScore score={job.score} size={80} strokeWidth={8} />
                                <h4>{job.title}</h4>
                                <p>{job.company}</p>
                                <Button variant="outline" size="sm" style={{ width: '100%', borderRadius: '10px' }}>
                                    Apply
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right - Verified Credentials */}
                <div className="dashboard-card">
                    <div className="section-title-row">
                        <h3>Verified Credentials</h3>
                    </div>
                    <div className="credentials-minimal-list">
                        {credentials.map((cred, index) => (
                            <CredentialCard key={index} {...cred} isVerified={cred.verified} />
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Internship Opportunities */}
            <section className="internships-full-section">
                <div className="section-title-row" style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '20px' }}>Internship Opportunities</h3>
                    <Link to="/internships" className="view-all-link">View All</Link>
                </div>
                <div className="internships-grid-premium">
                    {internships.map((intern, index) => (
                        <div key={index} className="internship-card-modern">
                            <div className="internship-header-row">
                                <div className="company-logo-circle" style={{ backgroundColor: intern.color }}>
                                    {intern.initial}
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>{intern.title}</h4>
                                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--dash-text-muted)' }}>{intern.company}</p>
                                </div>
                            </div>
                            <div className="internship-meta-row">
                                <span><MapPin size={14} /> {intern.location}</span>
                                <span><Clock size={14} /> {intern.duration}</span>
                                <span className="stipend-text"><IndianRupee size={14} /> {intern.stipend}</span>
                            </div>
                            <Button style={{ width: '100%', height: '44px', borderRadius: '12px' }}>
                                Apply Now
                            </Button>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Micro-Learning Courses */}
            <section className="courses-section">
                <div className="section-title-row" style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '20px' }}>Recommended Micro-Learning</h3>
                    <Link to="/learning" className="view-all-link">View All</Link>
                </div>
                <div className="courses-grid-premium">
                    {microCourses.map((course, index) => (
                        <div key={index} className="course-card-premium">
                            <div className="course-image-top">
                                <img src={course.image} alt={course.title} />
                                <span className="course-level-tag">{course.level}</span>
                            </div>
                            <div className="course-content-body">
                                <p className="course-provider-muted">{course.provider}</p>
                                <h4 className="course-title-bold">{course.title}</h4>
                                <div className="course-stats-row">
                                    <span><Clock size={14} /> {course.duration}</span>
                                    <span><Users size={14} /> {course.enrolled}</span>
                                </div>
                                <Button variant="outline" style={{ width: '100%', marginTop: 'auto', borderRadius: '12px' }}>
                                    Start Learning
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default CandidateDashboard;
