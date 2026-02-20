import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, MapPin, Clock, DollarSign, Briefcase, Building2,
    Calendar, Users, Users2, ChevronRight
} from 'lucide-react';
import '../../styles/Internships.css';

const Internships = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        domain: '',
        location: '',
        type: ''
    });

    const internships = [
        {
            id: 1,
            title: 'Frontend Development Intern',
            company: 'TechCorp Solutions',
            location: 'Remote',
            meta: 'Remote • 3 months',
            type: 'paid',
            stipend: '₹15,000 / month',
            duration: '3 Months',
            applicants: 45,
            postedDate: '2 days ago'
        },
        {
            id: 2,
            title: 'Digital Marketing Intern',
            company: 'Growth Marketing Inc',
            location: 'Mumbai',
            meta: 'Mumbai • 6 months',
            type: 'paid',
            stipend: '₹12,000 / month',
            duration: '6 Months',
            applicants: 67,
            postedDate: '1 week ago'
        },
        {
            id: 3,
            title: 'UI/UX Design Intern',
            company: 'Creative Studio',
            location: 'Bangalore',
            meta: 'Bangalore • 4 months',
            type: 'paid',
            stipend: '₹18,000 / month',
            duration: '4 Months',
            applicants: 89,
            postedDate: '3 days ago'
        },
        {
            id: 4,
            title: 'Content Writing Intern',
            company: 'Media House',
            location: 'Remote',
            meta: 'Remote • 2 months',
            type: 'unpaid',
            stipend: 'Certificate + LOR',
            duration: '2 Months',
            applicants: 23,
            postedDate: '5 days ago'
        }
    ];

    const handleApply = (id) => {
        alert(`Redirecting to application for internship ${id}`);
    };

    return (
        <div className="internships-page">
            {/* ── Page Header Section ── */}
            <header className="internships-header">
                <div className="header-container">
                    <h1 className="internships-title">Available Internships (4)</h1>
                    <p className="internships-subtitle">Gain real-world experience and kickstart your career.</p>
                </div>
            </header>

            {/* ── Results Toolbar ── */}
            <div className="results-toolbar">
                <div className="results-info">4 Internships Found</div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Sort by:</span>
                    <select className="sort-dropdown">
                        <option>Most Recent</option>
                        <option>Stipend (High to Low)</option>
                        <option>Relevant</option>
                    </select>
                </div>
            </div>

            {/* ── Main Grid Layout ── */}
            <div className="internships-layout">
                {/* ── Minimalist Sidebar ── */}
                <aside className="filter-sidebar">
                    <span className="sidebar-header">Filters</span>

                    <div className="filter-group">
                        <label className="filter-label">Job Type</label>
                        <select className="filter-dropdown">
                            <option>All Domains</option>
                            <option>Technology</option>
                            <option>Marketing</option>
                            <option>Design</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Location</label>
                        <select className="filter-dropdown">
                            <option>All Locations</option>
                            <option>Remote</option>
                            <option>Bangalore</option>
                            <option>Mumbai</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Internship Type</label>
                        <select className="filter-dropdown">
                            <option>All Types</option>
                            <option>Paid</option>
                            <option>Unpaid</option>
                        </select>
                    </div>

                    <button className="apply-filters-btn">Apply Filters</button>
                </aside>

                {/* ── Internship Cards ── */}
                <main className="internships-list">
                    {internships.map(internship => (
                        <div key={internship.id} className="internship-card">
                            {/* Card Top Branding Row */}
                            <div className="card-top-grid">
                                <div className="company-logo-64">
                                    <Building2 size={24} />
                                </div>
                                <div className="title-branding-stack">
                                    <h3 className="card-title-20">{internship.title}</h3>
                                    <span className="card-company-14">{internship.company}</span>
                                    <span className="card-meta-13">{internship.meta}</span>
                                </div>
                                <div className="status-tags-row">
                                    <span className={`status-tag-pill ${internship.type === 'paid' ? 'tag-paid-green' : 'tag-neutral'}`}>
                                        {internship.type === 'paid' ? 'PAID' : 'UNPAID'}
                                    </span>
                                    {internship.location === 'Remote' && (
                                        <span className="status-tag-pill tag-remote-blue">REMOTE</span>
                                    )}
                                </div>
                            </div>

                            {/* Card Metrics Grid */}
                            <div className="card-metrics-grid">
                                <div className="metric-block">
                                    <DollarSign size={16} className="metric-icon-16" />
                                    <span className="metric-text-14">{internship.stipend}</span>
                                </div>
                                <div className="metric-block">
                                    <Users size={16} className="metric-icon-16" />
                                    <span className="metric-text-14">{internship.applicants} Applicants</span>
                                </div>
                                <div className="metric-block">
                                    <Clock size={16} className="metric-icon-16" />
                                    <span className="metric-text-14">{internship.duration}</span>
                                </div>
                            </div>

                            {/* Card Action Footer */}
                            <div className="card-action-footer">
                                <button className="btn-details-outline">View Details</button>
                                <button
                                    className="btn-apply-gradient"
                                    onClick={() => handleApply(internship.id)}
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
};

export default Internships;
