import React from 'react';

const JobFilter = ({ filters, setFilters }) => {
    const handleJobTypeChange = (jobType) => {
        setFilters(prev => ({
            ...prev,
            jobTypes: prev.jobTypes.includes(jobType)
                ? prev.jobTypes.filter(t => t !== jobType)
                : [...prev.jobTypes, jobType]
        }));
    };

    const handleLocationChange = (e) => {
        setFilters(prev => ({
            ...prev,
            location: e.target.value
        }));
    };

    const handleSalaryChange = (e) => {
        const value = parseInt(e.target.value);
        setFilters(prev => ({
            ...prev,
            salaryMin: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            jobTypes: ['Full Time', 'Part Time', 'Contract', 'Gig'],
            location: 'All Locations',
            salaryMin: 0
        });
    };

    return (
        <div className="jobs-sidebar-content">
            <span className="sidebar-header">Filters</span>
            <div className="sidebar-divider"></div>

            <div className="filter-section">
                <span className="filter-title">Job Type</span>
                <div className="flex flex-col gap-1">
                    <label className="checkbox-row">
                        <input 
                            type="checkbox" 
                            checked={filters.jobTypes.includes('Full Time')}
                            onChange={() => handleJobTypeChange('Full Time')}
                        />
                        <span className="checkbox-label">Full Time</span>
                    </label>
                    <label className="checkbox-row">
                        <input 
                            type="checkbox" 
                            checked={filters.jobTypes.includes('Part Time')}
                            onChange={() => handleJobTypeChange('Part Time')}
                        />
                        <span className="checkbox-label">Part Time</span>
                    </label>
                    <label className="checkbox-row">
                        <input 
                            type="checkbox" 
                            checked={filters.jobTypes.includes('Contract')}
                            onChange={() => handleJobTypeChange('Contract')}
                        />
                        <span className="checkbox-label">Contract</span>
                    </label>
                    <label className="checkbox-row">
                        <input 
                            type="checkbox" 
                            checked={filters.jobTypes.includes('Gig')}
                            onChange={() => handleJobTypeChange('Gig')}
                        />
                        <span className="checkbox-label">Gig</span>
                    </label>
                </div>
            </div>

            <div className="filter-section">
                <span className="filter-title">Location</span>
                <select 
                    className="filter-dropdown"
                    value={filters.location}
                    onChange={handleLocationChange}
                >
                    <option>All Locations</option>
                    <option>Bangalore, India</option>
                    <option>Chennai, India</option>
                    <option>Remote</option>
                    <option>Mumbai, India</option>
                </select>
            </div>

            <div className="filter-section">
                <span className="filter-title">Minimum Salary</span>
                <div className="salary-slider-container">
                    <input 
                        type="range" 
                        className="salary-slider" 
                        min="0" 
                        max="20" 
                        value={filters.salaryMin}
                        onChange={handleSalaryChange}
                    />
                    <div className="salary-values">
                        <span>₹{filters.salaryMin}L</span>
                        <span>₹20L+</span>
                    </div>
                </div>
            </div>

            <button className="apply-filters-btn" onClick={resetFilters}>
                Reset Filters
            </button>
        </div>
    );
};

export default JobFilter;
