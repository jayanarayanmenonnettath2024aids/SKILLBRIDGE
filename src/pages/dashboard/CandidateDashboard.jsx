import React, { useRef } from 'react';
import MatchScore from '../../components/dashboard/MatchScore';
import CredentialCard from '../../components/dashboard/CredentialCard';
import '../../styles/Dashboard.css';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { Briefcase, TrendingUp, BookOpen, Clock, Users, MapPin, Calendar, IndianRupee, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CandidateDashboard = () => {
    const { user } = useAuth();
    const internshipScrollRef = useRef(null);

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
        {
            title: 'Customer Service Skills',
            provider: 'TCS iON',
            duration: '1.5 hrs',
            level: 'Beginner',
            enrolled: '3.7k enrolled',
            image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=250&fit=crop',
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
        {
            title: 'Operations Intern',
            company: 'Amazon',
            initial: 'A',
            color: '#f97316',
            location: 'Hyderabad',
            duration: '6 Months',
            stipend: '₹20,000/month',
        },
        {
            title: 'Sales Intern',
            company: 'Infosys',
            initial: 'I',
            color: '#10b981',
            location: 'Pune',
            duration: '3 Months',
            stipend: '₹14,000/month',
        },
    ];

    const scrollInternships = (direction) => {
        if (internshipScrollRef.current) {
            const amount = 380;
            internshipScrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
        }
    };

    return (
        <div className="container dashboard-container">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1 className="dashboard-title">Welcome back, {user.name || 'Rahul'}!</h1>
                    <p className="dashboard-subtitle">Here is your career progress today.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link to="/skillgap">
                        <Button variant="outline">
                            <TrendingUp size={18} />
                            <span style={{ marginLeft: '0.5rem' }}>Skill Gap Analysis</span>
                        </Button>
                    </Link>
                    <Link to="/certificate-upload">
                        <Button>
                            <Briefcase size={18} />
                            <span style={{ marginLeft: '0.5rem' }}>Find Jobs</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* ======= Micro-Learning Courses ======= */}
            <div className="dashboard-section micro-courses-section">
                <div className="section-head">
                    <h3><BookOpen size={20} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />Recommended Micro-Learning Courses</h3>
                    <Link to="/learning" className="view-all">View All Courses</Link>
                </div>
                <div className="micro-courses-grid">
                    {microCourses.map((course, index) => (
                        <div key={index} className="micro-course-card">
                            <div className="micro-course-thumb">
                                <img src={course.image} alt={course.title} />
                                <span className={`micro-course-badge ${course.level === 'Intermediate' ? 'badge-intermediate' : 'badge-beginner'}`}>
                                    {course.level}
                                </span>
                            </div>
                            <div className="micro-course-body">
                                <h4 className="micro-course-title">{course.title}</h4>
                                <p className="micro-course-provider">{course.provider}</p>
                                <div className="micro-course-meta">
                                    <span><Clock size={13} /> {course.duration}</span>
                                    <span><Users size={13} /> {course.enrolled}</span>
                                </div>
                                <Link to="/learning" className="micro-course-btn">Start Learning</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ======= Internship Opportunities ======= */}
            <div className="dashboard-section internship-section">
                <div className="section-head">
                    <h3><TrendingUp size={20} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />Internship Opportunities</h3>
                    <Link to="/internships" className="view-all">View All Internships</Link>
                </div>
                <div className="internship-scroll-wrap">
                    <button className="scroll-arrow scroll-left" onClick={() => scrollInternships('left')} aria-label="Scroll left">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="internship-scroll" ref={internshipScrollRef}>
                        {internships.map((intern, index) => (
                            <div key={index} className="internship-card">
                                <div className="internship-card-top">
                                    <div className="internship-logo" style={{ backgroundColor: intern.color }}>
                                        {intern.initial}
                                    </div>
                                    <div className="internship-info">
                                        <h4 className="internship-title">{intern.title}</h4>
                                        <p className="internship-company">{intern.company}</p>
                                    </div>
                                </div>
                                <div className="internship-details">
                                    <span><MapPin size={14} /> {intern.location}</span>
                                    <span><Calendar size={14} /> {intern.duration}</span>
                                    <span className="internship-stipend"><IndianRupee size={14} /> {intern.stipend}</span>
                                </div>
                                <Link to="/internships" className="internship-apply-btn">Apply Now</Link>
                            </div>
                        ))}
                    </div>
                    <button className="scroll-arrow scroll-right" onClick={() => scrollInternships('right')} aria-label="Scroll right">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* ======= Job Matches & Credentials ======= */}
            <div className="dashboard-grid">
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
        </div>
    );
};

export default CandidateDashboard;
