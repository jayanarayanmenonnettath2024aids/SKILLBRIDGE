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
            <div className="dashboard-header flex justify-between items-center">
                <div>
                    <h1 className="dashboard-title">Welcome back, {user.name || 'Rahul'}!</h1>
                    <p className="dashboard-subtitle">Here is your career progress today.</p>
                </div>
                <Link to="/jobs">
                    <Button>
                        <Briefcase size={18} className="mr-2" />
                        Find Jobs
                    </Button>
                </Link>
            </div>

            {/* Top Section: Job Matches & Credentials */}
            <div className="dashboard-grid mb-12">
                {/* Job Matches */}
                <div className="dashboard-section col-span-2">
                    <div className="section-head">
                        <h3>Top Job Matches</h3>
                        <Link to="/jobs" className="view-all">View All Jobs</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {jobMatches.map((job, index) => (
                            <div key={index} className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
                                <MatchScore score={job.score} size={100} />
                                <h4 className="mt-3 font-semibold text-center">{job.title}</h4>
                                <p className="text-sm text-secondary">{job.company}</p>
                                <Button variant="outline" size="sm" className="mt-3 w-full">Apply</Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Credentials Preview */}
                <div className="dashboard-section">
                    <div className="section-head">
                        <h3>Verified Credentials</h3>
                        <span className="view-all">Wallet</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        {credentials.map((cred, index) => (
                            <CredentialCard key={index} {...cred} isVerified={cred.verified} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Recommended Learning */}
            <div className="dashboard-section">
                <div className="section-head">
                    <h3>Recommended Skilling</h3>
                    <Link to="/learning" className="view-all">Browse Courses</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendedLearning.map((course, index) => (
                        <LearningCard key={index} {...course} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
