import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { 
    Search, MapPin, Clock, DollarSign, Briefcase, Building2, Calendar, Users,
    Laptop, Megaphone, Palette, TrendingUp, UserCircle, BarChart3, PenTool, Settings,
    Home, Building, Repeat, Banknote, GraduationCap
} from 'lucide-react';
import '../../styles/Internships.css';

const Internships = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        domain: '',
        mode: '',
        type: ''
    });

    const domains = [
        { id: 'technology', name: 'Technology', icon: Laptop },
        { id: 'marketing', name: 'Marketing', icon: Megaphone },
        { id: 'design', name: 'Design', icon: Palette },
        { id: 'finance', name: 'Finance', icon: TrendingUp },
        { id: 'hr', name: 'Human Resources', icon: UserCircle },
        { id: 'sales', name: 'Sales', icon: BarChart3 },
        { id: 'content', name: 'Content Writing', icon: PenTool },
        { id: 'operations', name: 'Operations', icon: Settings }
    ];

    const modes = [
        { id: 'remote', name: 'Remote', icon: Home },
        { id: 'onsite', name: 'On-site', icon: Building },
        { id: 'hybrid', name: 'Hybrid', icon: Repeat }
    ];

    const types = [
        { id: 'paid', name: 'Paid', icon: Banknote },
        { id: 'unpaid', name: 'Unpaid', icon: GraduationCap }
    ];

    const internships = [
        {
            id: 1,
            title: 'Frontend Development Intern',
            company: 'TechCorp Solutions',
            location: 'Remote',
            domain: 'technology',
            mode: 'remote',
            type: 'paid',
            stipend: '₹15,000/month',
            duration: '3 months',
            applicants: 45,
            postedDate: '2 days ago'
        },
        {
            id: 2,
            title: 'Digital Marketing Intern',
            company: 'Growth Marketing Inc',
            location: 'Mumbai',
            domain: 'marketing',
            mode: 'hybrid',
            type: 'paid',
            stipend: '₹12,000/month',
            duration: '6 months',
            applicants: 67,
            postedDate: '1 week ago'
        },
        {
            id: 3,
            title: 'UI/UX Design Intern',
            company: 'Creative Studio',
            location: 'Bangalore',
            domain: 'design',
            mode: 'onsite',
            type: 'paid',
            stipend: '₹18,000/month',
            duration: '4 months',
            applicants: 89,
            postedDate: '3 days ago'
        },
        {
            id: 4,
            title: 'Content Writing Intern',
            company: 'Media House',
            location: 'Remote',
            domain: 'content',
            mode: 'remote',
            type: 'unpaid',
            stipend: 'Certificate + LOR',
            duration: '2 months',
            applicants: 23,
            postedDate: '5 days ago'
        }
    ];

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            domain: '',
            mode: '',
            type: ''
        });
    };

    const handleApplyInternship = (internship) => {
        navigate('/interview', {
            state: {
                title: internship.title,
                company: internship.company,
                matchScore: null
            }
        });
    };

    const filteredInternships = internships.filter(internship => {
        if (filters.domain && internship.domain !== filters.domain) return false;
        if (filters.mode && internship.mode !== filters.mode) return false;
        if (filters.type && internship.type !== filters.type) return false;
        return true;
    });

    return (
        <div className="internships-page">
            <div className="internships-container">
                {/* Header */}
                <header className="internships-header">
                    <div className="header-content">
                        <h1 className="internships-title">Find Your Dream Internship</h1>
                        <p className="internships-subtitle">Gain real-world experience and kickstart your career</p>
                    </div>
                </header>

                {/* Main Content Layout */}
                <div className="internships-layout">
                    {/* Filter Section - Left Sidebar */}
                    <aside className="filter-sidebar">
                        <Card className="filter-section">
                            <div className="filter-header">
                                <h2 className="filter-title">Filters</h2>
                                {(filters.domain || filters.mode || filters.type) && (
                                    <Button variant="outline" size="sm" onClick={clearFilters}>
                                        Clear All
                                    </Button>
                                )}
                            </div>

                            {/* Domain Filter */}
                            <div className="filter-group">
                                <label htmlFor="domain-select" className="filter-group-title">
                                    <Briefcase size={20} />
                                    Job Type
                                </label>
                                <select
                                    id="domain-select"
                                    className="filter-dropdown"
                                    value={filters.domain}
                                    onChange={(e) => handleFilterChange('domain', e.target.value)}
                                >
                                    <option value="">All Domains</option>
                                    {domains.map(domain => {
                                        const IconComponent = domain.icon;
                                        return (
                                            <option key={domain.id} value={domain.id}>
                                                {domain.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Mode Filter */}
                            <div className="filter-group">
                                <label htmlFor="mode-select" className="filter-group-title">
                                    <MapPin size={20} />
                                    Location
                                </label>
                                <select
                                    id="mode-select"
                                    className="filter-dropdown"
                                    value={filters.mode}
                                    onChange={(e) => handleFilterChange('mode', e.target.value)}
                                >
                                    <option value="">All Locations</option>
                                    {modes.map(mode => (
                                        <option key={mode.id} value={mode.id}>
                                            {mode.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Type Filter */}
                            <div className="filter-group">
                                <label htmlFor="type-select" className="filter-group-title">
                                    <DollarSign size={20} />
                                    Internship Type
                                </label>
                                <select
                                    id="type-select"
                                    className="filter-dropdown"
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                >
                                    <option value="">All Types</option>
                                    {types.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Button className="apply-filters-btn">Apply Filters</Button>
                        </Card>
                    </aside>

                    {/* Results Section - Right Main Content */}
                    <div className="results-section">
                    <div className="results-header">
                        <h2 className="results-title">
                            Available Internships
                            <span className="results-count">({filteredInternships.length})</span>
                        </h2>
                        {(filters.domain || filters.mode || filters.type) && (
                            <div className="active-filters">
                                {filters.domain && (
                                    <Badge variant="primary">
                                        {domains.find(d => d.id === filters.domain)?.name}
                                    </Badge>
                                )}
                                {filters.mode && (
                                    <Badge variant="accent">
                                        {modes.find(m => m.id === filters.mode)?.name}
                                    </Badge>
                                )}
                                {filters.type && (
                                    <Badge variant={filters.type === 'paid' ? 'success' : 'neutral'}>
                                        {types.find(t => t.id === filters.type)?.name}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>

                    {filteredInternships.length === 0 ? (
                        <Card className="no-results">
                            <div className="no-results-content">
                                <Briefcase size={64} className="no-results-icon" />
                                <h3>No internships found</h3>
                                <p>Try adjusting your filters to see more results</p>
                                <Button onClick={clearFilters}>Clear Filters</Button>
                            </div>
                        </Card>
                    ) : (
                        <div className="internships-list">
                            {filteredInternships.map(internship => (
                                <Card key={internship.id} className="internship-card">
                                    <div className="internship-header">
                                        <div className="company-logo">
                                            <Building2 size={32} />
                                        </div>
                                        <div className="internship-info">
                                            <h3 className="internship-title">{internship.title}</h3>
                                            <p className="company-name">{internship.company}</p>
                                            <div className="internship-meta">
                                                <span className="meta-item">
                                                    <MapPin size={14} />
                                                    {internship.location}
                                                </span>
                                                <span className="meta-item">
                                                    <Clock size={14} />
                                                    {internship.duration}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="internship-badges">
                                            <Badge variant={internship.type === 'paid' ? 'success' : 'neutral'}>
                                                {internship.type === 'paid' ? (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                        <Banknote size={14} /> Paid
                                                    </span>
                                                ) : (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                        <GraduationCap size={14} /> Unpaid
                                                    </span>
                                                )}
                                            </Badge>
                                            <Badge variant="primary">
                                                {modes.find(m => m.id === internship.mode)?.name}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="internship-details">
                                        <div className="detail-item">
                                            <DollarSign size={18} />
                                            <div>
                                                <span className="detail-label">Stipend</span>
                                                <span className="detail-value">{internship.stipend}</span>
                                            </div>
                                        </div>
                                        <div className="detail-item">
                                            <Users size={18} />
                                            <div>
                                                <span className="detail-label">Applicants</span>
                                                <span className="detail-value">{internship.applicants}</span>
                                            </div>
                                        </div>
                                        <div className="detail-item">
                                            <Calendar size={18} />
                                            <div>
                                                <span className="detail-label">Posted</span>
                                                <span className="detail-value">{internship.postedDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="internship-actions">
                                        <Button className="apply-btn" onClick={() => handleApplyInternship(internship)}>
                                            Apply Now
                                        </Button>
                                        <Button variant="outline" className="details-btn">View Details</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Internships;
