import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import MatchScore from '../dashboard/MatchScore';
import { MapPin, Building2, Info } from 'lucide-react';

const JobCard = ({ job, onApply }) => {
    const navigate = useNavigate();
    const [showTooltip, setShowTooltip] = useState(false);

    const handleApply = () => {
        // Navigate to interview bot with job details
        navigate('/interview', {
            state: {
                title: job.title,
                company: job.company,
                matchScore: job.matchScore
            }
        });
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
                            {job.trusted && <Badge variant="success" className="ml-2">Trusted Employer</Badge>}
                        </div>
                        <div className="flex items-center gap-2 text-secondary text-sm mt-1">
                            <MapPin size={16} />
                            <span>{job.location}</span>
                        </div>
                    </div>
                    <div className="relative">
                        <div
                            className="cursor-pointer"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <MatchScore score={job.matchScore} size={60} strokeWidth={6} />
                        </div>
                        {showTooltip && (
                            <div className="match-tooltip">
                                <h5>Why you match:</h5>
                                <ul className="text-xs list-disc pl-4 mt-1">
                                    {job.matchReasons.map((reason, idx) => (
                                        <li key={idx} className="text-success">{reason}</li>
                                    ))}
                                    {job.missingSkills.map((skill, idx) => (
                                        <li key={idx} className="text-error">Missing: {skill}</li>
                                    ))}
                                </ul>
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
                <Button variant="outline" size="sm">Details</Button>
                <Button size="sm" onClick={handleApply}>Apply Now</Button>
            </div>
        </Card>
    );
};

export default JobCard;
