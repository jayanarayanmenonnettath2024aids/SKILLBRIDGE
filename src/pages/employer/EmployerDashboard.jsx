import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import MatchScore from '../../components/dashboard/MatchScore';
import { useAuth } from '../../context/AuthContext';
import {
    Search, Filter, MapPin, CheckCircle, Clock, Briefcase, Users, Calendar,
    X, Plus, Video
} from 'lucide-react';
import '../../styles/Employer.css';

const EmployerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showPostJob, setShowPostJob] = useState(false);
    const [postedJobs, setPostedJobs] = useState([
        { id: 1, title: 'Data Entry Operator', location: 'Bangalore', applicants: 24, status: 'Active' },
        { id: 2, title: 'Customer Support Executive', location: 'Remote', applicants: 18, status: 'Active' },
    ]);
    const [jobForm, setJobForm] = useState({
        title: '', description: '', location: '', salaryMin: '', salaryMax: '', skills: ''
    });

    const [candidates] = useState([
        {
            id: 1,
            name: 'Rahul Kumar',
            role: 'Data Entry Operator',
            location: 'Bangalore',
            match: 95,
            verified: true,
            skills: ['Typing (40wpm)', 'Excel', 'English (Basic)'],
            status: 'New'
        },
        {
            id: 2,
            name: 'Priya Sharma',
            role: 'Customer Support',
            location: 'Remote',
            match: 88,
            verified: true,
            skills: ['Communication', 'CRM', 'Hindi', 'English'],
            status: 'Interviewed'
        },
        {
            id: 3,
            name: 'Amit Singh',
            role: 'Warehouse Associate',
            location: 'Mumbai',
            match: 72,
            verified: false,
            skills: ['Inventory', 'Physical Fitness'],
            status: 'Screening'
        }
    ]);

    const handlePostJob = (e) => {
        e.preventDefault();
        const newJob = {
            id: postedJobs.length + 1,
            title: jobForm.title,
            location: jobForm.location,
            applicants: 0,
            status: 'Active'
        };
        setPostedJobs(prev => [newJob, ...prev]);
        setJobForm({ title: '', description: '', location: '', salaryMin: '', salaryMax: '', skills: '' });
        setShowPostJob(false);
    };

    const handleScheduleInterview = (candidate) => {
        navigate('/interview', {
            state: {
                title: candidate.role,
                company: user.name || 'Employer',
                candidateName: candidate.name,
                matchScore: candidate.match,
                scheduledByEmployer: true
            }
        });
    };

    return (
        <div className="employer-page">
            <div className="employer-container">
                {/* Header Section */}
                <header className="employer-header">
                    <div className="header-content">
                        <h1 className="employer-title">Welcome, {user.name || 'Employer'}!</h1>
                        <p className="employer-subtitle">Find and hire verified rural talent.</p>
                    </div>
                    <Button className="post-job-btn" onClick={() => setShowPostJob(true)}>
                        <Plus size={18} /> Post a Job
                    </Button>
                </header>

                {/* Stats Section */}
                <div className="stats-grid">
                    <Card className="stat-card stat-card-primary">
                        <div className="stat-icon">
                            <Briefcase size={24} />
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-number">{postedJobs.length}</h3>
                            <p className="stat-label">Active Jobs</p>
                        </div>
                    </Card>
                    <Card className="stat-card stat-card-accent">
                        <div className="stat-icon">
                            <Users size={24} />
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-number">{postedJobs.reduce((sum, j) => sum + j.applicants, 0)}</h3>
                            <p className="stat-label">Total Applications</p>
                        </div>
                    </Card>
                    <Card className="stat-card stat-card-success">
                        <div className="stat-icon">
                            <Calendar size={24} />
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-number">8</h3>
                            <p className="stat-label">Interviews Today</p>
                        </div>
                    </Card>
                </div>

                {/* Posted Jobs Section */}
                <div className="posted-jobs-section">
                    <h3 className="section-title">Your Job Postings</h3>
                    <div className="posted-jobs-list">
                        {postedJobs.map(job => (
                            <Card key={job.id} className="posted-job-card">
                                <div className="posted-job-info">
                                    <div className="posted-job-icon">
                                        <Briefcase size={20} />
                                    </div>
                                    <div>
                                        <h4 className="posted-job-title">{job.title}</h4>
                                        <div className="posted-job-meta">
                                            <span><MapPin size={14} /> {job.location}</span>
                                            <span><Users size={14} /> {job.applicants} applicants</span>
                                        </div>
                                    </div>
                                </div>
                                <Badge variant={job.status === 'Active' ? 'success' : 'neutral'}>{job.status}</Badge>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Search Section */}
                <Card className="search-section">
                    <h3 className="section-title">Search Candidates</h3>
                    <div className="search-controls">
                        <div className="search-input-wrapper">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search by skill, role, or location..."
                                className="search-input"
                            />
                        </div>
                        <div className="search-actions">
                            <Button variant="outline" className="filter-btn">
                                <Filter size={18} /> Filters
                            </Button>
                            <Button className="search-btn">Search</Button>
                        </div>
                    </div>
                    <div className="active-filters">
                        <span className="filters-label">Active Filters:</span>
                        <Badge variant="neutral" className="filter-badge">
                            <CheckCircle size={14} /> Verified Only
                        </Badge>
                        <Badge variant="neutral" className="filter-badge">Bangalore</Badge>
                        <Badge variant="neutral" className="filter-badge">Data Entry</Badge>
                    </div>
                </Card>

                {/* Candidates Section */}
                <div className="candidates-section">
                    <h3 className="section-title">Recent Applicants</h3>
                    <div className="candidates-list">
                        {candidates.map(candidate => (
                            <Card key={candidate.id} className="candidate-card">
                                <div className="candidate-header">
                                    <div className="candidate-avatar">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${candidate.name.replace(' ', '+')}&background=4F46E5&color=fff&bold=true`}
                                            alt={candidate.name}
                                            className="avatar-image"
                                        />
                                    </div>
                                    <div className="candidate-info">
                                        <div className="candidate-name-row">
                                            <h4 className="candidate-name">{candidate.name}</h4>
                                            {candidate.verified && (
                                                <CheckCircle size={18} className="verified-icon" title="Identity Verified" />
                                            )}
                                        </div>
                                        <p className="candidate-role">{candidate.role}</p>
                                        <div className="candidate-location">
                                            <MapPin size={14} />
                                            <span>{candidate.location}</span>
                                        </div>
                                    </div>
                                    <div className="candidate-match">
                                        <MatchScore score={candidate.match} size={60} strokeWidth={4} />
                                        <span className="match-label">Match</span>
                                    </div>
                                </div>
                                <div className="candidate-skills">
                                    {candidate.skills.map(skill => (
                                        <span key={skill} className="skill-tag">{skill}</span>
                                    ))}
                                </div>
                                <div className="candidate-actions">
                                    <Button className="action-btn-primary" onClick={() => handleScheduleInterview(candidate)}>
                                        <Video size={18} style={{ marginRight: '6px' }} />
                                        Schedule Interview
                                    </Button>
                                    <Button variant="outline" className="action-btn-secondary">View Profile</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Post Job Modal */}
            {showPostJob && (
                <div className="modal-overlay" onClick={() => setShowPostJob(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Post a New Job</h2>
                            <button className="modal-close" onClick={() => setShowPostJob(false)}>
                                <X size={22} />
                            </button>
                        </div>
                        <form onSubmit={handlePostJob} className="job-form">
                            <div className="form-group">
                                <label>Job Title *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Data Entry Operator"
                                    value={jobForm.title}
                                    onChange={e => setJobForm({ ...jobForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description *</label>
                                <textarea
                                    placeholder="Describe the role, responsibilities..."
                                    rows={4}
                                    value={jobForm.description}
                                    onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Location *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Bangalore, Remote"
                                    value={jobForm.location}
                                    onChange={e => setJobForm({ ...jobForm, location: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Min Salary (₹/month)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 15000"
                                        value={jobForm.salaryMin}
                                        onChange={e => setJobForm({ ...jobForm, salaryMin: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Max Salary (₹/month)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 25000"
                                        value={jobForm.salaryMax}
                                        onChange={e => setJobForm({ ...jobForm, salaryMax: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Required Skills</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Excel, Typing, English (comma separated)"
                                    value={jobForm.skills}
                                    onChange={e => setJobForm({ ...jobForm, skills: e.target.value })}
                                />
                            </div>
                            <div className="form-actions">
                                <Button variant="outline" type="button" onClick={() => setShowPostJob(false)}>Cancel</Button>
                                <Button type="submit">
                                    <Briefcase size={18} style={{ marginRight: '6px' }} /> Post Job
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployerDashboard;
