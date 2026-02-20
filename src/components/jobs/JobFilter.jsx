import React from 'react';

const JobFilter = () => {
    return (
        <div className="jobs-sidebar-content">
            <span className="sidebar-header">Filters</span>
            <div className="sidebar-divider"></div>

            <div className="filter-section">
                <span className="filter-title">Job Type</span>
                <div className="flex flex-col gap-1">
                    <label className="checkbox-row">
                        <input type="checkbox" defaultChecked />
                        <span className="checkbox-label">Full Time</span>
                    </label>
                    <label className="checkbox-row">
                        <input type="checkbox" />
                        <span className="checkbox-label">Part Time</span>
                    </label>
                    <label className="checkbox-row">
                        <input type="checkbox" />
                        <span className="checkbox-label">Contract</span>
                    </label>
                    <label className="checkbox-row">
                        <input type="checkbox" />
                        <span className="checkbox-label">Gig</span>
                    </label>
                </div>
            </div>

            <div className="filter-section">
                <span className="filter-title">Location</span>
                <select className="filter-dropdown">
                    <option>All Locations</option>
                    <option>Bangalore, India</option>
                    <option>Chennai, India</option>
                    <option>Remote</option>
                    <option>Mumbai, India</option>
                </select>
            </div>

            <div className="filter-section">
                <span className="filter-title">Salary Range</span>
                <div className="salary-slider-container">
                    <input type="range" className="salary-slider" min="0" max="100" defaultValue="40" />
                    <div className="salary-values">
                        <span>₹0</span>
                        <span>₹5L+</span>
                    </div>
                </div>
            </div>

            <button className="apply-filters-btn">
                Apply Filters
            </button>
        </div>
    );
};

export default JobFilter;
