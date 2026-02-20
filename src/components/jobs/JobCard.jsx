import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Building2, CheckCircle, ChevronRight } from 'lucide-react';

const JobCard = ({ job, onApply, hasResume }) => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const {
        id,
        title,
        company,
        location,
        salary,
        type,
        matchScore,
        trusted,
        description
    } = job;

    const handleApply = () => {
        if (onApply) {
            onApply(job);
        } else {
            navigate('/interview', {
                state: { title, company, matchScore }
            });
        }
    };

    // Logic for match badge color
    const getMatchStyle = (score) => {
        if (score > 70) return { background: '#ECFDF5', color: '#065F46' }; // Green
        if (score >= 50) return { background: '#FFFBEB', color: '#92400E' }; // Yellow/Amber
        return { background: '#FEF2F2', color: '#B91C1C' }; // Red
    };

    return (
        <div className="job-card">
            <div className="job-card-header">
                <div>
                    <h3 className="job-title">{title}</h3>
                    <div className="company-info">
                        <Building2 size={14} />
                        <span>{company}</span>
                        {trusted && (
                            <span className="verified-employer ml-2">
                                <CheckCircle size={14} fill="currentColor" stroke="white" />
                                {t('trustedEmployer')}
                            </span>
                        )}
                    </div>
                    <div className="company-info mt-1">
                        <MapPin size={14} />
                        <span>{location}</span>
                    </div>
                </div>
                {hasResume && matchScore && (
                    <div className="match-badge" style={getMatchStyle(matchScore)}>
                        {matchScore}% {t('match')}
                    </div>
                )}
            </div>

            <div className="job-tags mt-4">
                <span className="job-tag">{salary}</span>
                <span className="job-tag">{type}</span>
            </div>

            <p className="job-description mt-4">
                {description}
            </p>

            <div className="job-actions mt-6">
                <button className="btn btn-outline h-10 px-6 rounded-md text-sm font-semibold border-gray-300">
                    {t('viewDetails')}
                </button>
                <button
                    onClick={handleApply}
                    className="search-btn h-10 px-8 rounded-md text-sm font-semibold flex items-center gap-2"
                >
                    {t('applyNow')} <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default JobCard;


