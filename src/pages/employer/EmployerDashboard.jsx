import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import InterviewScheduler from '../../components/employer/InterviewScheduler';
import { Briefcase, Users, Calendar, MapPin, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import '../../styles/Employer.css';

const API_URL = 'http://localhost:5000/api';

const EmployerDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [schedulingApplication, setSchedulingApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.id) {
            fetchEmployerJobs();
        }
    }, [user]);

    const fetchEmployerJobs = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/jobs?employerId=${user.id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch jobs');
            }

            setJobs(data.jobs || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateApplicationStatus = async (jobId, applicationId, newStatus) => {
        try {
            const response = await fetch(
                `${API_URL}/jobs/${jobId}/applications/${applicationId}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update application status');
            }

            // Refresh jobs to get updated data
            fetchEmployerJobs();
        } catch (err) {
            console.error(err);
            alert('Failed to update application status');
        }
    };

    const getStatusBadgeVariant = (status) => {
        const variants = {
            'Applied': 'info',
            'Screening': 'warning',
            'Interview Scheduled': 'accent',
            'Interviewed': 'primary',
            'Selected': 'success',
            'Rejected': 'danger'
        };
        return variants[status] || 'neutral';
    };

    // Calculate stats
    const stats = {
        activeJobs: jobs.filter(j => j.status === 'Active').length,
        totalApplications: jobs.reduce((acc, job) => acc + (job.applications?.length || 0), 0),
        interviewsScheduled: jobs.reduce((acc, job) => 
            acc + (job.applications?.filter(app => app.status === 'Interview Scheduled').length || 0), 0
        )
    };

    return (
        <div className="employer-page">
            <div className="employer-container">
                {/* Header Section */}
                <header className="employer-header">
                    <div className="header-content">
                        <h1 className="employer-title">Employer Portal</h1>
                        <p className="employer-subtitle">Manage your job postings and applications</p>
                    </div>
                    <Button className="post-job-btn" onClick={() => navigate('/post-job')}>
                        <Briefcase size={18} />
                        Post a Job
                    </Button>
                </header>

                {/* Stats Section */}
                <div className="stats-grid">
                    <Card className="stat-card stat-card-primary">
                        <div className="stat-icon">
                            <Briefcase size={24} />
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-number">{stats.activeJobs}</h3>
                            <p className="stat-label">Active Jobs</p>
                        </div>
                    </Card>
                    <Card className="stat-card stat-card-accent">
                        <div className="stat-icon">
                            <Users size={24} />
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-number">{stats.totalApplications}</h3>
                            <p className="stat-label">Total Applications</p>
                        </div>
                    </Card>
                    <Card className="stat-card stat-card-success">
                        <div className="stat-icon">
                            <Calendar size={24} />
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-number">{stats.interviewsScheduled}</h3>
                            <p className="stat-label">Interviews Scheduled</p>
                        </div>
                    </Card>
                </div>

                {error && (
                    <div className="error-banner">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>Loading jobs...</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <Card style={{ padding: '3rem', textAlign: 'center' }}>
                        <Briefcase size={64} color="#CBD5E1" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>No Jobs Posted Yet</h3>
                        <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
                            Start by posting your first job to attract candidates
                        </p>
                        <Button onClick={() => navigate('/post-job')}>
                            Post Your First Job
                        </Button>
                    </Card>
                ) : (
                    <div className="jobs-section">
                        <h3 className="section-title">Your Posted Jobs</h3>
                        <div className="jobs-list">
                            {jobs.map(job => (
                                <Card key={job._id} className="job-card">
                                    <div className="job-card-header">
                                        <div>
                                            <h4 className="job-title">{job.title}</h4>
                                            <p className="job-company">{job.company}</p>
                                            <div className="job-meta">
                                                <span>
                                                    <MapPin size={14} /> {job.location}
                                                </span>
                                                <span>•</span>
                                                <span>{job.workType}</span>
                                                <span>•</span>
                                                <span>{job.applications?.length || 0} Applications</span>
                                            </div>
                                        </div>
                                        <Badge variant={job.status === 'Active' ? 'success' : 'neutral'}>
                                            {job.status}
                                        </Badge>
                                    </div>

                                    {job.applications && job.applications.length > 0 ? (
                                        <div className="applications-list">
                                            <h5 style={{ marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
                                                Applications ({job.applications.length})
                                            </h5>
                                            {job.applications.slice(0, 3).map((app) => (
                                                <div key={app._id} className="application-item">
                                                    <div className="application-info">
                                                        <div className="applicant-avatar">
                                                            {app.candidateName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="applicant-name">{app.candidateName}</p>
                                                            <p className="applicant-email">{app.candidateEmail}</p>
                                                            <p className="applied-date">
                                                                <Clock size={12} />
                                                                Applied {new Date(app.appliedDate).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="application-actions">
                                                        <Badge variant={getStatusBadgeVariant(app.status)}>
                                                            {app.status}
                                                        </Badge>
                                                        {app.status === 'Applied' && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => setSchedulingApplication({ ...app, jobId: job._id })}
                                                            >
                                                                Schedule Interview
                                                            </Button>
                                                        )}
                                                        {app.status === 'Interview Scheduled' && app.interviewSchedule && (
                                                            <div className="interview-details">
                                                                <Calendar size={14} />
                                                                <span>
                                                                    {new Date(app.interviewSchedule.date).toLocaleDateString()}{' '}
                                                                    at {app.interviewSchedule.time}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {job.applications.length > 3 && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedJob(job)}
                                                    style={{ width: '100%', marginTop: '0.5rem' }}
                                                >
                                                    View All {job.applications.length} Applications
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <p style={{ color: '#6B7280', fontSize: '0.875rem', marginTop: '1rem' }}>
                                            No applications yet
                                        </p>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Interview Scheduler Modal */}
                {schedulingApplication && (
                    <InterviewScheduler
                        application={schedulingApplication}
                        jobId={schedulingApplication.jobId}
                        onClose={() => setSchedulingApplication(null)}
                        onSuccess={fetchEmployerJobs}
                    />
                )}
            </div>
        </div>
    );
};

export default EmployerDashboard;
