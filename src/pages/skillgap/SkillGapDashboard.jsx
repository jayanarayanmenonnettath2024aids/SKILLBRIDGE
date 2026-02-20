/**
 * Skill Gap Analysis Dashboard
 * 
 * Comprehensive dashboard for analyzing skill gaps between user's current skills
 * and required skills for their job role. Fetches data from Firebase Firestore
 * and displays:
 * - Overall match percentage
 * - Skill readiness score
 * - Detailed skill gap table
 * - Recommended learning paths
 * 
 * Data is dynamically loaded from Firestore with proper error handling.
 */

import React, { useState, useEffect } from 'react';
import '../../styles/Dashboard.css';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { TrendingUp, Users, AlertCircle, CheckCircle, RefreshCw, Award, Target, Briefcase, BookOpen, Code, Lightbulb, Trophy, Youtube, Play } from 'lucide-react';
import { getAllUsers, getSkillGapAnalysis, seedSkillGapData, getResumeAnalysisAPI, analyzeResumeAPI, getLearningVideosAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SkillGapDashboard = () => {
    // State management
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [analysisData, setAnalysisData] = useState(null);
    const [resumeAnalysis, setResumeAnalysis] = useState(null);
    const [resumeLoading, setResumeLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reanalyzing, setReanalyzing] = useState(false);
    const [userResumeURL, setUserResumeURL] = useState(null);
    const [_error, setError] = useState(null);
    const [seeding, setSeeding] = useState(false);
    const [learningVideos, setLearningVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(false);
    const { user } = useAuth();

    /**
     * Fetch all users from Firestore on component mount
     */
    useEffect(() => {
        loadUsers();
    }, []);

    /**
     * Load skill gap analysis when a user is selected
     */
    useEffect(() => {
        if (selectedUserId) {
            loadAnalysis(selectedUserId);
            loadResumeAnalysis(selectedUserId);
            loadLearningVideos(selectedUserId);
        }
    }, [selectedUserId]);

    /**
     * Auto-select logged-in user if available
     */
    useEffect(() => {
        if (user && user.id && !selectedUserId) {
            console.log('Auto-selecting logged-in user:', user);
            setSelectedUserId(user.id);
        }
    }, [user]);

    /**
     * Fetch all available users from Firestore
     */
    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            // If logged in, use current user
            if (user && user.id) {
                setSelectedUserId(user.id);
                setLoading(false);
                return;
            }

            const usersData = await getAllUsers();

            if (usersData.length === 0) {
                setError('No users found in database. Please seed data first.');
            } else {
                setUsers(usersData);
                // Auto-select first user
                setSelectedUserId(usersData[0].user_id);
            }
        } catch (err) {
            setError('Failed to load users. Please ensure backend is running and Firestore is configured.');
            console.error('Error loading users:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch skill gap analysis for selected user
     * @param {string} userId - The user ID to analyze
     */
    const loadAnalysis = async (userId) => {
        try {
            const data = await getSkillGapAnalysis(userId);

            // Check if this is user data (with geminiAnalysis) or actual skill gap data
            if (data.success && data.data) {
                // This is user profile data from /api/users endpoint
                // Check if it has the geminiAnalysis
                if (data.data.geminiAnalysis) {
                    // Set resume analysis from the user data
                    setResumeAnalysis(data.data.geminiAnalysis);
                }
                // Don't set analysisData since this isn't skill gap analysis
                setAnalysisData(null);
            } else if (data.match_percentage !== undefined) {
                // This is actual skill gap analysis data
                setAnalysisData(data);
            } else {
                setAnalysisData(null);
            }

            setError(null);
        } catch (err) {
            console.log('No skill gap analysis found (this is normal for new users):', err.message);
            // Don't set error - skill gap analysis is optional
            setAnalysisData(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch Gemini resume analysis for the user
     * @param {string} userId - The user ID
     */
    const loadResumeAnalysis = async (userId) => {
        try {
            console.log('Loading resume analysis for user:', userId);
            setResumeLoading(true);
            const data = await getResumeAnalysisAPI(userId);
            console.log('Resume analysis loaded:', data);
            if (data && data.analysis) {
                setResumeAnalysis(data.analysis);
                setUserResumeURL(data.resumeURL || null);
            } else {
                setResumeAnalysis(null);
                setUserResumeURL(data.resumeURL || null);
            }
        } catch (err) {
            console.log('Resume analysis error:', err);
            // Check if error is the structured error object with resumeURL
            if (err && err.resumeURL) {
                // Resume exists but analysis doesn't
                console.log('Resume exists but no analysis found. Resume URL:', err.resumeURL);
                setUserResumeURL(err.resumeURL);
                setResumeAnalysis(null);
            } else {
                // No resume uploaded at all
                console.log('No resume found for this user');
                setUserResumeURL(null);
                setResumeAnalysis(null);
            }
        } finally {
            setResumeLoading(false);
        }
    };

    /**
     * Re-trigger resume analysis for a user who has uploaded a resume
     */
    const handleReanalyzeResume = async () => {
        if (!selectedUserId || !userResumeURL) {
            alert('Cannot re-analyze: Resume URL not found');
            return;
        }

        try {
            setReanalyzing(true);
            console.log('Re-analyzing resume for user:', selectedUserId);

            const result = await analyzeResumeAPI({
                userId: selectedUserId,
                resumeURL: userResumeURL
            });

            if (result.success && result.analysis) {
                setResumeAnalysis(result.analysis);
                alert('Resume analysis completed successfully!');
            } else if (result.warning) {
                alert(`Warning: ${result.warning}`);
            } else {
                alert('Analysis completed but no data returned');
            }
        } catch (error) {
            console.error('Re-analysis error:', error);
            alert(`Failed to re-analyze resume: ${error.message || 'Unknown error'}`);
        } finally {
            setReanalyzing(false);
        }
    };

    /**
     * Fetch learning videos based on user's resume analysis
     * @param {string} userId - The user ID
     */
    const loadLearningVideos = async (userId) => {
        try {
            console.log('Loading learning videos for user:', userId);
            setVideosLoading(true);
            const data = await getLearningVideosAPI(userId);
            console.log('Learning videos loaded:', data);
            if (data && data.videos) {
                setLearningVideos(data.videos);
            } else {
                setLearningVideos([]);
            }
        } catch (err) {
            console.log('Learning videos error:', err);
            setLearningVideos([]);
        } finally {
            setVideosLoading(false);
        }
    };

    /**
     * Seed synthetic data into Firestore
     * Useful for quick setup during hackathon demos
     */
    const handleSeedData = async () => {
        try {
            setSeeding(true);
            await seedSkillGapData();
            alert('Synthetic data seeded successfully! Reloading users...');
            await loadUsers();
        } catch (err) {
            alert(`Failed to seed data: ${err.message}`);
            console.error('Error seeding data:', err);
        } finally {
            setSeeding(false);
        }
    };

    /**
     * Get appropriate CSS class for gap status badge
     */
    const getStatusClass = (status) => {
        const statusMap = {
            'Critical': 'priority-critical',
            'Moderate': 'priority-moderate',
            'Good': 'priority-good'
        };
        return statusMap[status] || 'priority-good';
    };

    /**
     * Render loading state (only if no data at all)
     */
    if ((loading || resumeLoading) && !resumeAnalysis && !analysisData && !selectedUserId) {
        return (
            <div className="container dashboard-container">
                <div className="skillgap-loading">
                    <RefreshCw className="animate-spin" size={32} />
                    <p>Loading your profile data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container dashboard-container">
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-content">
                    <h1 className="dashboard-title skillgap-title-row">
                        <TrendingUp size={28} />
                        Skill Gap Analysis Dashboard
                    </h1>
                    <p className="dashboard-subtitle">
                        Comprehensive workforce skill assessment powered by Firebase Firestore
                    </p>
                </div>
                <Button variant="outline" onClick={handleSeedData} disabled={seeding} size="sm">
                    {seeding ? 'Seeding...' : 'Reseed Demo Data'}
                </Button>
            </div>

            {/* User Selector or Display */}
            <Card className="skillgap-user-selector">
                <div className="skillgap-user-selector-inner">
                    <div className="skillgap-user-label">
                        <Users size={20} />
                        {user ? (
                            <div>
                                <label className="skillgap-label-bold">Viewing Profile:</label>
                                <span className="skillgap-user-name">
                                    {user.name || user.email || 'Current User'}
                                </span>
                            </div>
                        ) : (
                            <label className="skillgap-label-bold">Select User:</label>
                        )}
                    </div>
                    {!user && users.length > 0 && (
                        <select
                            value={selectedUserId || ''}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="user-selector"
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid #E5E7EB',
                                fontSize: '0.95rem',
                                minWidth: '250px'
                            }}
                        >
                            {users.map((user) => (
                                <option key={user.user_id} value={user.user_id}>
                                    {user.name} - {user.role}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </Card>

            {/* Resume Analysis Summary Section */}
            {resumeLoading && (
                <Card className="skillgap-status-card">
                    <RefreshCw className="animate-spin" size={32} color="#667eea" />
                    <p className="skillgap-status-text">Loading your resume analysis...</p>
                </Card>
            )}

            {!resumeLoading && !resumeAnalysis && selectedUserId && (
                <Card className="skillgap-status-card">
                    <AlertCircle size={48} color="#F59E0B" />
                    <h3 className="skillgap-status-title">No Resume Analysis Found</h3>
                    {userResumeURL ? (
                        <>
                            <p className="skillgap-status-text">
                                Your resume was uploaded but analysis is missing. This may happen if the AI analysis failed.
                                Click below to re-analyze your resume.
                            </p>
                            <div className="skillgap-action-buttons">
                                <Button
                                    onClick={handleReanalyzeResume}
                                    disabled={reanalyzing}
                                >
                                    {reanalyzing ? (
                                        <>
                                            <RefreshCw className="animate-spin" size={16} style={{ marginRight: '0.5rem' }} />
                                            Analyzing...
                                        </>
                                    ) : (
                                        'Re-analyze Resume'
                                    )}
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => window.location.href = '/resume-upload'}
                                >
                                    Upload New Resume
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="skillgap-status-text">
                                We couldn't find a resume analysis for this profile. Upload your resume to get started!
                            </p>
                            <Button onClick={() => window.location.href = '/resume-upload'}>
                                Upload Resume
                            </Button>
                        </>
                    )}
                </Card>
            )}

            {resumeAnalysis && (
                <div className="skillgap-resume-section">
                    <div className="section-head">
                        <h3>Professional Summary from Resume</h3>
                    </div>

                    {/* Summary Card */}
                    {resumeAnalysis.summary && (
                        <Card className="skillgap-summary-card">
                            <div className="skillgap-summary-inner">
                                <Award size={32} className="skillgap-summary-icon" />
                                <div>
                                    <h4 className="skillgap-summary-title">About You</h4>
                                    <p className="skillgap-summary-text">{resumeAnalysis.summary}</p>
                                    <div className="skillgap-badges">
                                        {resumeAnalysis.experienceLevel && (
                                            <span className="skillgap-badge">
                                                {resumeAnalysis.experienceLevel}
                                            </span>
                                        )}
                                        {resumeAnalysis.totalYearsOfExperience && (
                                            <span className="skillgap-badge">
                                                {resumeAnalysis.totalYearsOfExperience} years experience
                                            </span>
                                        )}
                                        {resumeAnalysis.overallScore && (
                                            <span className="skillgap-badge skillgap-badge-bold">
                                                Overall Score: {resumeAnalysis.overallScore}/100
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    <div className="skillgap-two-col">
                        {/* Strengths Card */}
                        {resumeAnalysis.strengths && resumeAnalysis.strengths.length > 0 && (
                            <Card className="skillgap-detail-card">
                                <div className="skillgap-detail-header">
                                    <div className="skillgap-icon-wrap" style={{ background: '#D1FAE5' }}>
                                        <CheckCircle size={24} color="#10B981" />
                                    </div>
                                    <h4 className="skillgap-detail-title">Key Strengths</h4>
                                </div>
                                <ul className="skillgap-list">
                                    {resumeAnalysis.strengths.map((strength, idx) => (
                                        <li key={idx} className="skillgap-list-item">
                                            <CheckCircle size={16} color="#10B981" className="skillgap-list-icon" />
                                            <span>{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        )}

                        {/* Areas for Improvement Card */}
                        {resumeAnalysis.improvements && resumeAnalysis.improvements.length > 0 && (
                            <Card className="skillgap-detail-card">
                                <div className="skillgap-detail-header">
                                    <div className="skillgap-icon-wrap" style={{ background: '#FEF3C7' }}>
                                        <Target size={24} color="#F59E0B" />
                                    </div>
                                    <h4 className="skillgap-detail-title">Areas for Improvement</h4>
                                </div>
                                <ul className="skillgap-list">
                                    {resumeAnalysis.improvements.map((improvement, idx) => (
                                        <li key={idx} className="skillgap-list-item">
                                            <AlertCircle size={16} color="#F59E0B" className="skillgap-list-icon" />
                                            <span>{improvement}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        )}

                        {/* Education Card */}
                        {resumeAnalysis.education && resumeAnalysis.education.length > 0 && (
                            <Card className="skillgap-detail-card">
                                <div className="skillgap-detail-header">
                                    <div className="skillgap-icon-wrap" style={{ background: '#DBEAFE' }}>
                                        <BookOpen size={24} color="#3B82F6" />
                                    </div>
                                    <h4 className="skillgap-detail-title">Education</h4>
                                </div>
                                <div className="skillgap-edu-list">
                                    {resumeAnalysis.education.map((edu, idx) => (
                                        <div key={idx} className="skillgap-edu-item">
                                            <div className="skillgap-edu-degree">{edu.degree}</div>
                                            <div className="skillgap-edu-field">{edu.field}</div>
                                            <div className="skillgap-edu-field">{edu.institution}</div>
                                            {edu.year && <div className="skillgap-edu-year">{edu.year}</div>}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Recommended Roles Card */}
                        {resumeAnalysis.recommendedRoles && resumeAnalysis.recommendedRoles.length > 0 && (
                            <Card className="skillgap-detail-card">
                                <div className="skillgap-detail-header">
                                    <div className="skillgap-icon-wrap" style={{ background: '#E9D5FF' }}>
                                        <Briefcase size={24} color="#9333EA" />
                                    </div>
                                    <h4 className="skillgap-detail-title">Recommended Roles</h4>
                                </div>
                                <div className="skillgap-roles">
                                    {resumeAnalysis.recommendedRoles.map((role, idx) => (
                                        <span key={idx} className="skillgap-role-badge">
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Projects Section */}
                    {resumeAnalysis.projects && resumeAnalysis.projects.length > 0 && (
                        <div className="skillgap-projects-section">
                            <div className="section-head">
                                <h3 className="skillgap-section-title">
                                    <Code size={24} />
                                    Projects Portfolio
                                </h3>
                            </div>
                            <div className="skillgap-projects-list">
                                {resumeAnalysis.projects.map((project, idx) => (
                                    <Card key={idx} className="skillgap-project-card">
                                        <div className="skillgap-project-inner">
                                            <div className="skillgap-project-icon">
                                                <Lightbulb size={28} />
                                            </div>
                                            <div className="skillgap-project-content">
                                                <div className="skillgap-project-header">
                                                    <div>
                                                        <h4 className="skillgap-project-name">{project.name}</h4>
                                                        <span className="skillgap-project-type">
                                                            {project.type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="skillgap-project-desc">
                                                    {project.description}
                                                </p>

                                                {/* Technologies */}
                                                <div className="skillgap-tech-section">
                                                    <strong className="skillgap-tech-label">Technologies:</strong>
                                                    <div className="skillgap-tech-tags">
                                                        {project.technologies.map((tech, techIdx) => (
                                                            <span key={techIdx} className="skillgap-tech-tag">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Highlights */}
                                                {project.highlights && project.highlights.length > 0 && (
                                                    <div>
                                                        <strong className="skillgap-tech-label">Key Highlights:</strong>
                                                        <ul className="skillgap-highlights">
                                                            {project.highlights.map((highlight, highlightIdx) => (
                                                                <li key={highlightIdx} className="skillgap-highlight-item">
                                                                    <CheckCircle size={16} color="#10B981" className="skillgap-list-icon" />
                                                                    <span>{highlight}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Achievements Section */}
                    {resumeAnalysis.achievements && resumeAnalysis.achievements.length > 0 && (
                        <div className="skillgap-achievements-section">
                            <div className="section-head">
                                <h3 className="skillgap-section-title">
                                    <Trophy size={24} />
                                    Achievements & Recognition
                                </h3>
                            </div>
                            <Card className="skillgap-detail-card">
                                <ul className="skillgap-achievements-list">
                                    {resumeAnalysis.achievements.map((achievement, idx) => (
                                        <li key={idx} className="skillgap-achievement-item">
                                            <div className="skillgap-icon-wrap-sm" style={{ background: '#FEF3C7' }}>
                                                <Trophy size={18} color="#F59E0B" />
                                            </div>
                                            <span>{achievement}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>
                    )}

                    {/* Certifications Section */}
                    {resumeAnalysis.certifications && resumeAnalysis.certifications.length > 0 && (
                        <div className="skillgap-certs-section">
                            <div className="section-head">
                                <h3 className="skillgap-section-title">
                                    <Award size={24} />
                                    Certifications
                                </h3>
                            </div>
                            <Card className="skillgap-detail-card">
                                <div className="skillgap-certs-grid">
                                    {resumeAnalysis.certifications.map((cert, idx) => (
                                        <div key={idx} className="skillgap-cert-item">
                                            <CheckCircle size={18} color="#10B981" className="skillgap-list-icon" />
                                            <span className="skillgap-cert-text">{cert}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            )}

            {/* Analysis Results */}
            {analysisData && analysisData.summary && analysisData.skill_gaps && (
                <>
                    {/* Summary Cards Row */}
                    <div className="skillgap-summary-grid">
                        {/* Match Percentage Card */}
                        <Card className="skill-gap-card skillgap-center">
                            <h3 className="skillgap-card-label">Skill Match Percentage</h3>
                            <div className="score-circle skillgap-score-circle">
                                <span className="score-main">{analysisData.match_percentage}%</span>
                            </div>
                            <p className="skillgap-card-sublabel">
                                How much of required skills the user currently possesses
                            </p>
                        </Card>

                        {/* Readiness Score Card */}
                        <Card className="skill-gap-card skillgap-center">
                            <h3 className="skillgap-card-label">Overall Readiness Score</h3>
                            <div className="score-circle skillgap-score-circle" style={{
                                borderColor: analysisData.readiness_score >= 70 ? '#10B981' :
                                    analysisData.readiness_score >= 50 ? '#F59E0B' : '#EF4444'
                            }}>
                                <span className="score-main" style={{
                                    color: analysisData.readiness_score >= 70 ? '#10B981' :
                                        analysisData.readiness_score >= 50 ? '#F59E0B' : '#EF4444'
                                }}>
                                    {analysisData.readiness_score}
                                </span>
                                <span className="score-label">/ 100</span>
                            </div>
                            <p className="skillgap-card-sublabel">
                                Job readiness considering gap severity
                            </p>
                        </Card>

                        {/* Summary Stats Card */}
                        <Card className="skill-gap-card">
                            <h3 className="skillgap-card-label">Gap Summary</h3>
                            <div className="skillgap-stats-list">
                                <div className="skillgap-stat-row">
                                    <span>Total Skills Required:</span>
                                    <span className="skillgap-stat-value">{analysisData.summary.total_skills_required}</span>
                                </div>
                                <div className="skillgap-stat-row">
                                    <span>Critical Gaps:</span>
                                    <span className="skillgap-stat-value skillgap-stat-critical">
                                        {analysisData.summary.critical_gaps}
                                    </span>
                                </div>
                                <div className="skillgap-stat-row">
                                    <span>Moderate Gaps:</span>
                                    <span className="skillgap-stat-value skillgap-stat-moderate">
                                        {analysisData.summary.moderate_gaps}
                                    </span>
                                </div>
                                <div className="skillgap-stat-row">
                                    <span>Good Skills:</span>
                                    <span className="skillgap-stat-value skillgap-stat-good">
                                        {analysisData.summary.good_skills}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Detailed Skill Gap Table */}
                    <div className="dashboard-section">
                        <div className="section-head">
                            <h3>Detailed Skill Gap Analysis</h3>
                            <span className="view-all">
                                Role: {analysisData.user_info.role}
                            </span>
                        </div>
                        <Card className="skill-gap-card">
                            <div className="skill-gap-table">
                                {/* Table Header */}
                                <div className="skill-gap-header-row">
                                    <span>Skill Name</span>
                                    <span>Required Level</span>
                                    <span>User Level</span>
                                    <span>Gap</span>
                                    <span>Status</span>
                                </div>

                                {/* Table Rows - Data from Firestore */}
                                {analysisData.skill_gaps.map((skill, index) => (
                                    <div key={index} className="skill-gap-row">
                                        <div className="skill-main">
                                            <span className="skill-name">{skill.skill_name}</span>
                                        </div>

                                        <div className="skillgap-level-cell">
                                            <span className="level-badge">{skill.required_level} / 10</span>
                                        </div>

                                        <div className="skillgap-level-cell">
                                            <span className="level-badge muted">{skill.user_level} / 10</span>
                                        </div>

                                        <div className="gap-bar-cell">
                                            <div className="gap-bar-track">
                                                <div
                                                    className="gap-bar-fill"
                                                    style={{
                                                        width: `${(skill.gap / 10) * 100}%`,
                                                        background: skill.status === 'Critical' ? '#EF4444' :
                                                            skill.status === 'Moderate' ? '#F59E0B' : '#10B981'
                                                    }}
                                                />
                                            </div>
                                            <span className="gap-percent">
                                                {skill.gap} point{skill.gap !== 1 ? 's' : ''} gap
                                            </span>
                                        </div>

                                        <div className="priority-cell">
                                            <span className={`priority-badge ${getStatusClass(skill.status)}`}>
                                                {skill.status === 'Good' && <CheckCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />}
                                                {skill.status === 'Critical' && <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />}
                                                {skill.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Recommendations Section */}
                    <div className="dashboard-section skillgap-recommendations">
                        <div className="section-head">
                            <h3>Priority Actions & Recommendations</h3>
                        </div>
                        <div className="skillgap-recommendations-grid">
                            {analysisData.skill_gaps
                                .filter(s => s.status === 'Critical' || s.status === 'Moderate')
                                .slice(0, 4)
                                .map((skill, index) => (
                                    <Card key={index} className="skillgap-recommendation-card">
                                        <div className="skillgap-recommendation-inner">
                                            <div className={`priority-icon ${skill.status === 'Critical' ? 'skillgap-icon-red' : 'skillgap-icon-orange'}`}>
                                                <AlertCircle size={20} color={skill.status === 'Critical' ? '#EF4444' : '#F59E0B'} />
                                            </div>
                                            <div className="skillgap-recommendation-content">
                                                <h4 className="skillgap-recommendation-title">{skill.skill_name}</h4>
                                                <p className="skillgap-recommendation-levels">
                                                    Current: {skill.user_level}/10 → Target: {skill.required_level}/10
                                                </p>
                                                <p className="skillgap-recommendation-text">
                                                    <strong>Recommendation:</strong> Complete training modules, practice exercises,
                                                    and seek mentorship to bridge the {skill.gap}-point gap.
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                        </div>
                    </div>
                </>
            )}

            {/* Learning Videos Section - Always visible when user is selected */}
            {selectedUserId && (
                <div className="dashboard-section video-section skillgap-video-section">
                    <div className="video-section-header">
                        <div className="skillgap-video-header-row">
                            <div className="video-icon-wrapper">
                                <Youtube size={28} color="white" />
                            </div>
                            <div>
                                <h3 className="skillgap-video-title">
                                    Recommended Learning Videos
                                    <span className="video-badge">AI-Powered</span>
                                </h3>
                                <p className="skillgap-video-subtitle">Personalized tutorials based on your resume skills</p>
                            </div>
                        </div>
                    </div>

                    {videosLoading ? (
                        <div className="video-loading">
                            <RefreshCw className="animate-spin" size={32} />
                            <p className="skillgap-video-loading-text">Finding the best videos for you...</p>
                        </div>
                    ) : learningVideos.length > 0 ? (
                        <div className="video-grid">
                            {learningVideos.map((video, index) => (
                                <div key={index} className="video-card-wrapper" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <a
                                        href={`https://www.youtube.com/watch?v=${video.videoId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="video-card-link"
                                    >
                                        {/* Video Thumbnail with Play Overlay */}
                                        <div className="video-thumbnail-container">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="video-thumbnail"
                                            />
                                            <div className="video-overlay">
                                                <div className="video-play-button">
                                                    <Play size={24} color="white" fill="white" />
                                                </div>
                                            </div>
                                            <div className="video-duration-badge">
                                                <span>Tutorial</span>
                                            </div>
                                        </div>

                                        {/* Video Info */}
                                        <div className="video-info">
                                            <h4 className="video-title">
                                                {video.title}
                                            </h4>
                                            <div className="video-channel">
                                                <div className="channel-icon">
                                                    <Code size={14} />
                                                </div>
                                                <span>{video.channelTitle}</span>
                                            </div>
                                            <p className="video-description">
                                                {video.description}
                                            </p>
                                            <div className="video-footer">
                                                <span className="watch-now-badge">
                                                    <Play size={12} />
                                                    <span>Watch Now</span>
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="video-empty-state">
                            <div className="empty-state-icon">
                                <Youtube size={64} />
                            </div>
                            <h4 className="empty-state-title">No Videos Available Yet</h4>
                            <p className="empty-state-text">Upload your resume to get personalized video recommendations!</p>
                            <Button variant="primary" onClick={() => window.location.href = '/resume-upload'}>
                                <BookOpen size={16} style={{ marginRight: '0.5rem' }} />
                                Upload Resume
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SkillGapDashboard;
