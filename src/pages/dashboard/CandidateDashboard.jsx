import React from 'react';
import MatchScore from '../../components/dashboard/MatchScore';
import CredentialCard from '../../components/dashboard/CredentialCard';
import LearningCard from '../../components/dashboard/LearningCard';
import '../../styles/Dashboard.css';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { Briefcase } from 'lucide-react';
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

    const recommendedLearning = [
        { title: 'Advanced Excel for Business', provider: 'Skill India', duration: '4 Weeks', level: 'Intermediate', image: 'https://placehold.co/300x200/e0e7ff/1e3a8a?text=Excel' },
        { title: 'English Communication', provider: 'British Council', duration: '2 Weeks', level: 'Beginner', image: 'https://placehold.co/300x200/fef3c7/92400e?text=English' },
        { title: 'Customer Service 101', provider: 'TCS iON', duration: '1 Week', level: 'Beginner', image: 'https://placehold.co/300x200/d1fae5/065f46?text=Service' },
    ];

    return (
        <div className="container dashboard-container">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1 className="dashboard-title">Welcome back, {user.name || 'Rahul'}!</h1>
                    <p className="dashboard-subtitle">Here is your career progress today.</p>
                </div>
                <Link to="/certificate-upload">
                    <Button>
                        <Briefcase size={18} />
                        <span style={{ marginLeft: '0.5rem' }}>Find Jobs</span>
                    </Button>
                </Link>
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
