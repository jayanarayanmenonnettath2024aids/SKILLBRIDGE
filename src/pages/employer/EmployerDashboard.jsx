import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import {
    Search, Filter, MapPin, CheckCircle, Briefcase, Users, Calendar,
    X, Plus, Video, ChevronRight
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
            skills: ['Typing (40wpm)', 'Excel', 'Communication'],
            initials: 'RK'
        },
        {
            id: 2,
            name: 'Priya Sharma',
            role: 'Customer Support',
            location: 'Remote',
            match: 88,
            verified: true,
            skills: ['CRM', 'English', 'Hindi'],
            initials: 'PS'
        },
        {
            id: 3,
            name: 'Amit Singh',
            role: 'Warehouse Associate',
            location: 'Mumbai',
            match: 72,
            verified: false,
            skills: ['Inventory', 'Logistics'],
            initials: 'AS'
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
        <div className="employer-dashboard-page">
            <div className="employer-dashboard-container">
                {/* 1. Header Section */}
                <header className="dashboard-hero-header">
                    <div className="hero-text-content">
                        <h1 className="hero-welcome-title">Welcome back, {user.name || 'Employer'}</h1>
                        <p className="hero-welcome-subtitle">Find and hire verified rural talent</p>
                    </div>
                    <Button className="primary-gradient-btn" onClick={() => setShowPostJob(true)}>
                        <Plus size={18} />
                        Post a Job
                    </Button>
                </header>

                {/* 2. Stats Cards Grid */}
                <div className="metrics-summary-grid">
                    <div className="metric-card-item">
                        <div className="metric-icon-box blue-bg">
                            <Briefcase size={22} />
                        </div>
                        <div className="metric-values">
                            <span className="metric-number-val">{postedJobs.length}</span>
                            <span className="metric-label-text">Active Jobs</span>
                        </div>
                    </div>
                    <div className="metric-card-item">
                        <div className="metric-icon-box purple-bg">
                            <Users size={22} />
                        </div>
                        <div className="metric-values">
                            <span className="metric-number-val">{postedJobs.reduce((sum, j) => sum + j.applicants, 0)}</span>
                            <span className="metric-label-text">Total Applications</span>
                        </div>
                    </div>
                    <div className="metric-card-item">
                        <div className="metric-icon-box green-bg">
                            <Calendar size={22} />
                        </div>
                        <div className="metric-values">
                            <span className="metric-number-val">8</span>
                            <span className="metric-label-text">Interviews Today</span>
                        </div>
                    </div>
                </div>

                {/* 3. Job Postings List */}
                <section className="dashboard-jobs-section">
                    <div className="section-header-row">
                        <h2 className="dashboard-section-title">Your Job Postings</h2>
                    </div>
                    <div className="jobs-compact-list">
                        {postedJobs.map(job => (
                            <div key={job.id} className="job-row-item">
                                <div className="job-info-block">
                                    <h4 className="job-item-title">{job.title}</h4>
                                    <div className="job-item-meta">
                                        <span>{job.location}</span>
                                        <span className="meta-dot">•</span>
                                        <span>{job.applicants} Applicants</span>
                                    </div>
                                </div>
                                <div className="job-status-pill active-pill">
                                    {job.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Search Candidates Toolbar */}
                <Card className="candidate-search-toolbar">
                    <div className="toolbar-top-row">
                        <div className="search-input-group">
                            <Search className="search-field-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search by skill, role, or location..."
                                className="toolbar-search-field"
                            />
                        </div>
                        <Button variant="outline" className="toolbar-filter-btn">
                            <Filter size={18} />
                            Filters
                        </Button>
                        <Button className="toolbar-primary-search-btn">Search</Button>
                    </div>
                    <div className="toolbar-active-filters">
                        <span className="filters-caption">Active:</span>
                        <div className="filter-chip-list">
                            <div className="filter-item-chip">Verified Only</div>
                            <div className="filter-item-chip">Bangalore</div>
                            <div className="filter-item-chip">Data Entry</div>
                        </div>
                    </div>
                </Card>

                {/* 5. Recent Applicants Section */}
                <section className="dashboard-applicants-section">
                    <div className="section-header-row">
                        <h2 className="dashboard-section-title">Recent Applicants</h2>
                    </div>
                    <div className="applicants-card-list">
                        {candidates.map(candidate => (
                            <div key={candidate.id} className="applicant-grid-card">
                                {/* LEFT - Avatar */}
                                <div className="applicant-avatar-wrap">
                                    <div className="applicant-initials-avatar">
                                        {candidate.initials}
                                    </div>
                                </div>

                                {/* CENTER - Info */}
                                <div className="applicant-info-wrap">
                                    <div className="name-status-row">
                                        <h4 className="applicant-full-name">{candidate.name}</h4>
                                        {candidate.verified && (
                                            <CheckCircle size={16} className="verified-check-icon" />
                                        )}
                                    </div>
                                    <p className="applicant-role-text">{candidate.role}</p>
                                    <div className="applicant-location-meta">
                                        <MapPin size={13} />
                                        <span>{candidate.location}</span>
                                    </div>
                                    <div className="applicant-skill-chips-row">
                                        {candidate.skills.map(skill => (
                                            <span key={skill} className="mini-skill-chip">{skill}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* RIGHT - Match & Actions */}
                                <div className="applicant-actions-wrap">
                                    <div className="match-badge-pill">
                                        {candidate.match}% Match
                                    </div>
                                    <div className="actions-button-row">
                                        <Button
                                            className="action-primary-btn"
                                            onClick={() => handleScheduleInterview(candidate)}
                                        >
                                            <Video size={16} />
                                            Schedule
                                        </Button>
                                        <Button variant="outline" className="action-secondary-btn">
                                            View Profile
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Post Job Modal (Retained Logic) */}
            {showPostJob && (
                <div className="dashboard-modal-overlay" onClick={() => setShowPostJob(false)}>
                    <Card className="job-submission-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header-section">
                            <h2 className="modal-title-text">Post a New Job</h2>
                            <button className="modal-close-trigger" onClick={() => setShowPostJob(false)}>
                                <X size={22} />
                            </button>
                        </div>
                        <form onSubmit={handlePostJob} className="job-submission-form">
                            <div className="form-input-group">
                                <label className="form-label-text">Job Title *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Data Entry Operator"
                                    className="form-text-input"
                                    value={jobForm.title}
                                    onChange={e => setJobForm({ ...jobForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-input-group">
                                <label className="form-label-text">Description *</label>
                                <textarea
                                    placeholder="Describe the role, responsibilities..."
                                    className="form-textarea-input"
                                    rows={4}
                                    value={jobForm.description}
                                    onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-double-row">
                                <div className="form-input-group">
                                    <label className="form-label-text">Location *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Bangalore"
                                        className="form-text-input"
                                        value={jobForm.location}
                                        onChange={e => setJobForm({ ...jobForm, location: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-input-group">
                                    <label className="form-label-text">Required Skills</label>
                                    <input
                                        type="text"
                                        placeholder="Excel, Typing"
                                        className="form-text-input"
                                        value={jobForm.skills}
                                        onChange={e => setJobForm({ ...jobForm, skills: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-actions-footer">
                                <Button variant="ghost" type="button" onClick={() => setShowPostJob(false)}>Cancel</Button>
                                <Button type="submit" className="primary-gradient-btn">
                                    <Briefcase size={18} />
                                    Post Job
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default EmployerDashboard;
