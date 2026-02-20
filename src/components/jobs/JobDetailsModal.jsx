import React from 'react';
import { X, MapPin, Building2, Briefcase, DollarSign, Clock, Users } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import MatchScore from '../dashboard/MatchScore';
import '../../styles/JobDetailsModal.css';

const JobDetailsModal = ({ job, onClose, onApply, hasResume }) => {
    if (!job) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <Card className="job-details-modal">
                    <div className="modal-header">
                        <div>
                            <h2 className="job-title">{job.title}</h2>
                            <div className="company-info">
                                <Building2 size={18} />
                                <span>{job.company}</span>
                                {job.trusted && <Badge variant="success">Trusted Employer</Badge>}
                            </div>
                        </div>
                        <button onClick={onClose} className="close-btn">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="modal-body">
                        <div className="job-meta">
                            <div className="meta-item">
                                <MapPin size={18} />
                                <span>{job.location}</span>
                            </div>
                            <div className="meta-item">
                                <DollarSign size={18} />
                                <span>₹{job.salary}</span>
                            </div>
                            <div className="meta-item">
                                <Briefcase size={18} />
                                <span>{job.type}</span>
                            </div>
                        </div>

                        {hasResume && job.matchScore && (
                            <div className="match-section">
                                <div className="match-score-display">
                                    <MatchScore score={job.matchScore} size={80} strokeWidth={8} />
                                    <div className="match-info">
                                        <h3>Your Match Score</h3>
                                        <p>Based on your resume and skills</p>
                                    </div>
                                </div>

                                <div className="match-reasons">
                                    <div className="reasons-col">
                                        <h4 className="text-success">✓ Why you match:</h4>
                                        <ul>
                                            {job.matchReasons?.map((reason, idx) => (
                                                <li key={idx}>{reason}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    {job.missingSkills && job.missingSkills.length > 0 && (
                                        <div className="reasons-col">
                                            <h4 className="text-warning">⚠ Skills to improve:</h4>
                                            <ul>
                                                {job.missingSkills.map((skill, idx) => (
                                                    <li key={idx}>{skill}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="job-description">
                            <h3>Job Description</h3>
                            <p>
                                We are looking for a dedicated {job.title} to join our team at {job.company}. 
                                This is a {job.type.toLowerCase()} position based in {job.location}.
                            </p>
                            <h4>Responsibilities:</h4>
                            <ul>
                                <li>Perform day-to-day tasks related to {job.title.toLowerCase()}</li>
                                <li>Collaborate with team members to achieve goals</li>
                                <li>Maintain quality standards and meet deadlines</li>
                                <li>Follow safety and company guidelines</li>
                            </ul>
                            <h4>Requirements:</h4>
                            <ul>
                                <li>Relevant experience or certifications preferred</li>
                                <li>Good communication skills</li>
                                <li>Willingness to learn and adapt</li>
                                <li>Reliable and punctual</li>
                            </ul>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <Button variant="outline" onClick={onClose}>Close</Button>
                        <Button onClick={() => onApply(job)}>Apply Now</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default JobDetailsModal;
