import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const JobFilter = ({ filters, setFilters }) => {
    const { t } = useLanguage();
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
            <span className="sidebar-header">{t('filters')}</span>
            <div className="sidebar-divider"></div>

            <div className="filter-section">
                <span className="filter-title">{t('jobType')}</span>
                <div className="flex flex-col gap-1">
                    <label className="checkbox-row">
                        <input 
                            type="checkbox" 
                            checked={filters.jobTypes.includes('Full Time')}
                            onChange={() => handleJobTypeChange('Full Time')}
                        />
                        <span className="checkbox-label">{t('fullTime')}</span>
                    </label>
                    <label className="checkbox-row">
                        <input 
                            type="checkbox" 
                            checked={filters.jobTypes.includes('Part Time')}
                            onChange={() => handleJobTypeChange('Part Time')}
                        />
                        <span className="checkbox-label">{t('partTime')}</span>
                    </label>
                    <label className="checkbox-row">
                        <input 
                            type="checkbox" 
                            checked={filters.jobTypes.includes('Contract')}
                            onChange={() => handleJobTypeChange('Contract')}
                        />
                        <span className="checkbox-label">{t('contract')}</span>
                    </label>
                    <label className="checkbox-row">
                        <input 
                            type="checkbox" 
                            checked={filters.jobTypes.includes('Gig')}
                            onChange={() => handleJobTypeChange('Gig')}
                        />
                        <span className="checkbox-label">{t('gig')}</span>
                    </label>
                </div>
            </div>

            <div className="filter-section">
                <span className="filter-title">{t('location')}</span>
                <select 
                    className="filter-dropdown"
                    value={filters.location}
                    onChange={handleLocationChange}
                >
                    <option>{t('allLocations')}</option>
                    <option>Bangalore, India</option>
                    <option>Chennai, India</option>
                    <option>{t('remote')}</option>
                    <option>Mumbai, India</option>
                </select>
            </div>

            <div className="filter-section">
                <span className="filter-title">{t('minimumSalary')}</span>
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
                {t('resetFilters')}
            </button>
        </div>
    );
};

export default JobFilter;
