import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import MatchScore from '../dashboard/MatchScore';
import { MapPin, Building2, Info, Upload } from 'lucide-react';

const JobCard = ({ job, onApply, hasResume }) => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [showTooltip, setShowTooltip] = useState(false);

    const handleApply = () => {
        if (onApply) {
            onApply(job);
        } else {
            // Navigate to interview bot with job details
            navigate('/interview', {
                state: {
                    title: job.title,
                    company: job.company,
                    matchScore: job.matchScore
                }
            });
        }
    };

    const handleDetails = () => {
        if (onApply) {
            onApply(job);
        }
    };

    return (
        <Card className="job-card">
            <div className="job-header">
                <div className="flex justify-between items-start w-full">
                    <div>
                        <h3 className="text-lg font-bold text-primary">{job.title}</h3>
                        <div className="flex items-center gap-2 text-secondary text-sm mt-1">
                            <Building2 size={16} />
                            <span>{job.company}</span>
                            {job.trusted && <Badge variant="success" className="ml-2">{t('trustedEmployer')}</Badge>}
                        </div>
                        <div className="flex items-center gap-2 text-secondary text-sm mt-1">
                            <MapPin size={16} />
                            <span>{job.location}</span>
                        </div>
                    </div>
                    <div className="relative">
                        {hasResume ? (
                            <>
                                <div
                                    className="cursor-pointer"
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                >
                                    <MatchScore score={job.matchScore} size={60} strokeWidth={6} />
                                </div>
                                {showTooltip && (
                                    <div className="match-tooltip">
                                        <h5>{t('whyMatch')}</h5>
                                        <ul className="text-xs list-disc pl-4 mt-1">
                                            {job.matchReasons.map((reason, idx) => (
                                                <li key={idx} className="text-success">{reason}</li>
                                            ))}
                                            {job.missingSkills && job.missingSkills.length > 0 && job.missingSkills.map((skill, idx) => (
                                                <li key={idx} className="text-error">{t('missing')}: {skill}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="no-resume-badge">
                                <Upload size={24} className="text-gray-400" />
                                <span className="text-xs text-gray-500 mt-1">{t('uploadForMatch')}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="job-tags mt-4 flex gap-2 flex-wrap">
                <Badge variant="neutral">₹{job.salary}</Badge>
                <Badge variant="neutral">{job.type}</Badge>
            </div>

            <div className="job-actions mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleDetails}>{t('details')}</Button>
                <Button size="sm" onClick={handleApply}>{t('applyNow')}</Button>
            </div>
        </Card>
    );
};

export default JobCard;
