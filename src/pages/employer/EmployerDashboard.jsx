import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import MatchScore from '../../components/dashboard/MatchScore';
import { Search, Filter, MapPin, CheckCircle, Clock, Briefcase, Users, Calendar } from 'lucide-react';
import '../../styles/Employer.css';

const EmployerDashboard = () => {
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

    return (
        <div className="employer-page">
            <div className="employer-container">
                {/* Header Section */}
                <header className="employer-header">
                    <div className="header-content">
                        <h1 className="employer-title">Employer Portal</h1>
                        <p className="employer-subtitle">Find and hire verified rural talent.</p>
                    </div>
                    <Button className="post-job-btn">Post a Job</Button>
                </header>

                {/* Stats Section */}
                <div className="stats-grid">
                    <Card className="stat-card stat-card-primary">
                        <div className="stat-icon">
                            <Briefcase size={24} />
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-number">12</h3>
                            <p className="stat-label">Active Jobs</p>
                        </div>
                    </Card>
                    <Card className="stat-card stat-card-accent">
                        <div className="stat-icon">
                            <Users size={24} />
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-number">45</h3>
                            <p className="stat-label">New Applications</p>
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
                                    <Button className="action-btn-primary">Schedule Interview</Button>
                                    <Button variant="outline" className="action-btn-secondary">View Profile</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
