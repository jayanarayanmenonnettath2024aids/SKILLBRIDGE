import React from 'react';
import MatchScore from '../../components/dashboard/MatchScore';
import CredentialCard from '../../components/dashboard/CredentialCard';
import LearningCard from '../../components/dashboard/LearningCard';
import '../../styles/Dashboard.css';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { Briefcase, BookOpen, TrendingUp, Clock, MapPin, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

const CandidateDashboard = () => {
    const { user } = useAuth();

    // If user is not available, provide default values
    const userName = user?.name || 'User';

    // Mock Data - Internship Opportunities
    const internships = [
        { 
            title: 'Marketing Intern', 
            company: 'Reliance Industries', 
            location: 'Mumbai',
            duration: '3 Months',
            stipend: '₹15,000/month',
            logo: 'https://placehold.co/60x60/3b82f6/fff?text=R'
        },
        { 
            title: 'Data Entry Intern', 
            company: 'TCS', 
            location: 'Bangalore',
            duration: '6 Months',
            stipend: '₹12,000/month',
            logo: 'https://placehold.co/60x60/10b981/fff?text=T'
        },
        { 
            title: 'Customer Service Intern', 
            company: 'Flipkart', 
            location: 'Delhi',
            duration: '3 Months',
            stipend: '₹18,000/month',
            logo: 'https://placehold.co/60x60/f59e0b/fff?text=F'
        },
    ];

    // Mock Data - Micro Learning Courses
    const microLearningCourses = [
        { 
            title: 'Excel for Beginners', 
            provider: 'Skill India', 
            duration: '2 hrs',
            level: 'Beginner',
            enrolled: '2.4k',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&q=80'
        },
        { 
            title: 'English Communication', 
            provider: 'British Council', 
            duration: '3 hrs',
            level: 'Intermediate',
            enrolled: '5.2k',
            image: 'https://images.unsplash.com/photo-1517148815978-75f6acaaf32c?w=400&h=250&fit=crop&q=80'
        },
        { 
            title: 'Digital Marketing Basics', 
            provider: 'Google Digital Garage', 
            duration: '4 hrs',
            level: 'Beginner',
            enrolled: '8.1k',
            image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=250&fit=crop&q=80'
        },
        { 
            title: 'Customer Service Skills', 
            provider: 'TCS iON', 
            duration: '1.5 hrs',
            level: 'Beginner',
            enrolled: '3.7k',
            image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=400&h=250&fit=crop&q=80'
        },
    ];

    // Mock Data - Job Matches
    const jobMatches = [
        { title: 'Data Entry Operator', company: 'TechServe Solutions', score: 92 },
        { title: 'Retail Associate', company: 'Reliance Retail', score: 78 },
        { title: 'Delivery Partner', company: 'Swiggy', score: 65 },
    ];

    const credentials = [
        { title: '12th Standard Pass', issuer: 'CBSE Board', date: 'May 2023', hash: '0x7f...3a2b', verified: true },
        { title: 'Data Entry Basics', issuer: 'Skill India', date: 'Aug 2023', hash: '0x9c...1d4e', verified: true },
    ];

    const recommendedLearning = [
        { title: 'Advanced Excel for Business', provider: 'Skill India', duration: '4 Weeks', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&q=80' },
        { title: 'English Communication', provider: 'British Council', duration: '2 Weeks', level: 'Beginner', image: 'https://images.unsplash.com/photo-1517148815978-75f6acaaf32c?w=400&h=250&fit=crop&q=80' },
        { title: 'Customer Service 101', provider: 'TCS iON', duration: '1 Week', level: 'Beginner', image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=400&h=250&fit=crop&q=80' },
    ];

    return (
        <div className="container dashboard-container">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1 className="dashboard-title">Welcome back, {userName}!</h1>
                    <p className="dashboard-subtitle">Here is your career progress today.</p>
                </div>
                <Link to="/certificate-upload">
                    <Button>
                        <Briefcase size={18} />
                        <span style={{ marginLeft: '0.5rem' }}>Find Jobs</span>
                    </Button>
                </Link>
            </div>

            {/* Micro Learning Courses Section */}
            <div className="dashboard-section micro-learning-section">
                <div className="section-head">
                    <div className="section-head-left">
                        <BookOpen size={24} className="section-icon" />
                        <h3>Recommended Micro-Learning Courses</h3>
                    </div>
                    <Link to="/learning" className="view-all">View All Courses</Link>
                </div>
                <div className="micro-courses-grid">
                    {microLearningCourses.map((course, index) => (
                        <div key={index} className="micro-course-card">
                            <div className="course-image" style={{ backgroundImage: `url(${course.image})` }}>
                                <span className="course-badge">{course.level}</span>
                            </div>
                            <div className="course-content">
                                <h4 className="course-title">{course.title}</h4>
                                <p className="course-provider">{course.provider}</p>
                                <div className="course-meta">
                                    <span className="course-duration">
                                        <Clock size={14} /> {course.duration}
                                    </span>
                                    <span className="course-enrolled">{course.enrolled} enrolled</span>
                                </div>
                                <Link to="/learning">
                                    <Button variant="outline" size="sm" style={{ width: '100%', marginTop: '0.75rem' }}>
                                        Start Learning
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Internship Opportunities Section */}
            <div className="dashboard-section internships-section">
                <div className="section-head">
                    <div className="section-head-left">
                        <TrendingUp size={24} className="section-icon" />
                        <h3>Internship Opportunities</h3>
                    </div>
                    <Link to="/internships" className="view-all">View All Internships</Link>
                </div>
                <div className="internships-carousel-wrapper">
                    <div className="internships-carousel">
                        {/* Duplicate internships for seamless loop */}
                        {[...internships, ...internships, ...internships].map((internship, index) => (
                            <div key={index} className="internship-card">
                            <div className="internship-header">
                                <img src={internship.logo} alt={internship.company} className="company-logo" />
                                <div className="internship-info">
                                    <h4 className="internship-title">{internship.title}</h4>
                                    <p className="company-name">{internship.company}</p>
                                </div>
                            </div>
                            <div className="internship-details">
                                <div className="detail-item">
                                    <MapPin size={16} />
                                    <span>{internship.location}</span>
                                </div>
                                <div className="detail-item">
                                    <Clock size={16} />
                                    <span>{internship.duration}</span>
                                </div>
                                <div className="detail-item stipend">
                                    <Building size={16} />
                                    <span>{internship.stipend}</span>
                                </div>
                            </div>
                            <Link to="/internships">
                                <Button variant="primary" size="sm" style={{ width: '100%' }}>
                                    Apply Now
                                </Button>
                            </Link>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Section: Job Matches & Credentials */}
            <div className="dashboard-grid">
                {/* Job Matches */}
                <div className="dashboard-section job-matches-section">
                    <div className="section-head">
                        <h3>Top Job Matches</h3>
                        <Link to="/jobs" className="view-all">View All Jobs</Link>
                    </div>
                    <div className="job-matches-grid">
                        {jobMatches.map((job, index) => (
                            <div key={index} className="job-match-card">
                                <MatchScore score={job.score} size={100} />
                                <h4 className="job-match-title">{job.title}</h4>
                                <p className="job-match-company">{job.company}</p>
                                <Button variant="outline" size="sm" className="apply-btn">Apply</Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Credentials Preview */}
                <div className="dashboard-section credentials-section">
                    <div className="section-head">
                        <h3>Verified Credentials</h3>
                        <Link to="/wallet" className="view-all">Wallet</Link>
                    </div>
                    <div className="credentials-list">
                        {credentials.map((cred, index) => (
                            <CredentialCard key={index} {...cred} isVerified={cred.verified} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Recommended Learning */}
            <div className="dashboard-section learning-section">
                <div className="section-head">
                    <h3>Recommended Skilling</h3>
                    <Link to="/learning" className="view-all">Browse Courses</Link>
                </div>
                <div className="learning-grid">
                    {recommendedLearning.map((course, index) => (
                        <LearningCard key={index} {...course} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
