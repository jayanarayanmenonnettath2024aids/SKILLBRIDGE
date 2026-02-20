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
import '../../styles/SkillGapDashboard.css';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {
    TrendingUp, Users, AlertCircle, CheckCircle, RefreshCw, Award,
    Target, Briefcase, BookOpen, Code, Lightbulb, Trophy, Youtube,
    Play, FileText, Menu, Plus, Calendar
} from 'lucide-react';
import { getAllUsers, getSkillGapAnalysis, seedSkillGapData, getResumeAnalysisAPI, analyzeResumeAPI, getLearningVideosAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const SkillGapDashboard = () => {
    // 1. SAFE STATE INITIALIZATION
    const { user } = useAuth();
    const { t } = useLanguage();
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [analysisData, setAnalysisData] = useState({
        skill_gaps: [],
        summary: {
            total_skills_required: 0,
            critical_gaps: 0,
            moderate_gaps: 0,
            good_skills: 0
        },
        user_info: { role: "" },
        match_percentage: 0,
        readiness_score: 0
    });
    const [resumeAnalysis, setResumeAnalysis] = useState(null);
    const [resumeLoading, setResumeLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reanalyzing, setReanalyzing] = useState(false);
    const [userResumeURL, setUserResumeURL] = useState(null);
    const [_error, setError] = useState(null);
    const [seeding, setSeeding] = useState(false);
    const [learningVideos, setLearningVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(false);

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
            setSelectedUserId(user.id);
        }
    }, [user]);

    /**
     * 3. PROTECT API CALLS (FRONTEND SIDE ONLY)
     */
    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            if (user && user.id) {
                setSelectedUserId(user.id);
                setLoading(false);
                return;
            }

            const usersData = await getAllUsers();
            setUsers(Array.isArray(usersData) ? usersData : []);

            if (!usersData || usersData.length === 0) {
                setError('No users found in database. Please seed data first.');
            } else {
                setSelectedUserId(usersData[0].user_id);
            }
        } catch (err) {
            setError('Failed to load users.');
            setUsers([]);
            console.error('Error loading users:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch skill gap analysis for selected user
     */
    const loadAnalysis = async (userId) => {
        try {
            const data = await getSkillGapAnalysis(userId);
            if (data && data.success && data.data) {
                if (data.data.geminiAnalysis) {
                    setResumeAnalysis(data.data.geminiAnalysis);
                }
                setAnalysisData({
                    skill_gaps: [],
                    summary: { total_skills_required: 0, critical_gaps: 0, moderate_gaps: 0, good_skills: 0 },
                    user_info: { role: "" },
                    match_percentage: 0,
                    readiness_score: 0
                });
            } else if (data && data.match_percentage !== undefined) {
                setAnalysisData(data);
            } else {
                setAnalysisData({
                    skill_gaps: [],
                    summary: { total_skills_required: 0, critical_gaps: 0, moderate_gaps: 0, good_skills: 0 },
                    user_info: { role: "" },
                    match_percentage: 0,
                    readiness_score: 0
                });
            }
            setError(null);
        } catch (err) {
            console.log('No skill gap analysis found:', err.message);
            setAnalysisData({
                skill_gaps: [],
                summary: { total_skills_required: 0, critical_gaps: 0, moderate_gaps: 0, good_skills: 0 },
                user_info: { role: "" },
                match_percentage: 0,
                readiness_score: 0
            });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch Gemini resume analysis for the user
     */
    const loadResumeAnalysis = async (userId) => {
        try {
            setResumeLoading(true);
            const data = await getResumeAnalysisAPI(userId);
            if (data && data.analysis) {
                setResumeAnalysis(data.analysis);
                setUserResumeURL(data.resumeURL || null);
            } else {
                setResumeAnalysis(null);
                setUserResumeURL(data?.resumeURL || null);
            }
        } catch (err) {
            if (err && err.resumeURL) {
                setUserResumeURL(err.resumeURL);
            } else {
                setUserResumeURL(null);
            }
            setResumeAnalysis(null);
        } finally {
            setResumeLoading(false);
        }
    };

    /**
     * Re-trigger resume analysis
     */
    const handleReanalyzeResume = async () => {
        if (!selectedUserId || !userResumeURL) return;
        try {
            setReanalyzing(true);
            const result = await analyzeResumeAPI({
                userId: selectedUserId,
                resumeURL: userResumeURL
            });
            if (result && result.success && result.analysis) {
                setResumeAnalysis(result.analysis);
            }
        } catch (error) {
            console.error('Re-analysis error:', error);
        } finally {
            setReanalyzing(false);
        }
    };

    /**
     * Fetch learning videos
     */
    const loadLearningVideos = async (userId) => {
        try {
            setVideosLoading(true);
            const data = await getLearningVideosAPI(userId);
            setLearningVideos(data && Array.isArray(data.videos) ? data.videos : []);
        } catch (err) {
            setLearningVideos([]);
            console.error('Learning videos error:', err);
        } finally {
            setVideosLoading(false);
        }
    };

    /**
     * Seed synthetic data
     */
    const handleSeedData = async () => {
        try {
            setSeeding(true);
            await seedSkillGapData();
            await loadUsers();
            alert('Seed successful');
        } catch (err) {
            console.error('Error seeding data:', err);
        } finally {
            setSeeding(false);
        }
    };

    // 4. STOP DASHBOARD FROM RENDERING BEFORE DATA READY
    if (!user) {
        return (
            <div className="skillgap-page">
                <div className="skillgap-loading">
                    <RefreshCw className="animate-spin" size={32} />
                    <p>{t('authenticating')}</p>
                </div>
            </div>
        );
    }

    if (loading && !selectedUserId) {
        return (
            <div className="skillgap-page">
                <div className="skillgap-loading">
                    <RefreshCw className="animate-spin" size={32} />
                    <p>{t('loadingDashboard')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="skillgap-page">
            {/* 1. Top Header Strip */}
            <div className="skillgap-header">
                <div className="header-left">
                    <h1 className="header-title">{t('skillGapDashboardTitle')}</h1>
                    <p className="header-subtitle">{t('aiWorkforceInsights')}</p>
                </div>
                <div className="header-right">
                    <Button variant="outline" onClick={handleSeedData} disabled={seeding} size="sm" className="ghost-btn">
                        {seeding ? t('seeding') : t('reseedDemoData')}
                    </Button>
                    <Button className="menu-plus-btn">
                        <Menu size={18} />
                        <span>{t('menu')}</span>
                        <Plus size={16} />
                    </Button>
                </div>
            </div>

            {/* 2. Main Dashboard Grid */}
            <div className="skillgap-grid">

                {/* LEFT SIDE (Main Content) */}
                <div className="skillgap-left">

                    {/* Resume Status Card */}
                    <Card className="skillgap-card resume-analysis-card">
                        <div className="card-header-row">
                            <div className="card-header-left">
                                <div className="icon-circle-box">
                                    <FileText size={20} />
                                </div>
                                <h3 className="card-title-text">{t('resumeAnalysis')}</h3>
                            </div>
                            <span className={`status-badge ${resumeAnalysis ? 'analyzed' : 'empty'}`}>
                                {resumeAnalysis ? t('analyzed') : t('empty')}
                            </span>
                        </div>

                        {!resumeAnalysis ? (
                            <div className="resume-empty-cta">
                                <FileText size={64} className="cta-icon-large" />
                                <h4 className="cta-headline">{t('noResumeAnalysisFound')}</h4>
                                <p className="cta-subtext">
                                    {t('uploadResumeUnlock')}
                                </p>
                                <button
                                    className="button-primary"
                                    onClick={() => window.location.href = '/resume-upload'}
                                    style={{ margin: '0 auto' }}
                                >
                                    {t('uploadResumeBtn')}
                                </button>
                            </div>
                        ) : (
                            <div className="resume-analyzed-content">
                                <p className="analysis-summary-text">{resumeAnalysis?.summary}</p>
                                <div className="analysis-metrics-row">
                                    {resumeAnalysis?.overallScore && (
                                        <div className="analysis-metric">
                                            <span className="metric-label">{t('resumeScore')}</span>
                                            <span className="metric-value">{resumeAnalysis?.overallScore}/100</span>
                                        </div>
                                    )}
                                    {resumeAnalysis?.experienceLevel && (
                                        <div className="analysis-metric">
                                            <span className="metric-label">{t('experienceLevel')}</span>
                                            <span className="metric-value">{resumeAnalysis?.experienceLevel}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Analysis Results (Summary & Table) - Only show if analysis results are valid */}
                    {analysisData?.match_percentage > 0 && (
                        <div className="analysis-results-section" style={{ marginBottom: '64px' }}>
                            <div className="learning-section-title-row">
                                <h3 className="learning-title">{t('detailedAnalysisResults')}</h3>
                                <p className="learning-subtitle">{t('skillMatchingFor')} {analysisData?.user_info?.role || t('selectedRole')}</p>
                            </div>

                            <div className="skillgap-summary-grid" style={{ marginBottom: '32px' }}>
                                <Card className="skillgap-card skillgap-center">
                                    <span className="stat-label">{t('matchPercentage')}</span>
                                    <div className="score-main" style={{ fontSize: '36px', margin: '12px 0' }}>{analysisData?.match_percentage}%</div>
                                    <p className="stat-label">{t('requiredSkillsPossessed')}</p>
                                </Card>
                                <Card className="skillgap-card skillgap-center">
                                    <span className="stat-label">{t('readinessScore')}</span>
                                    <div className="score-main" style={{ fontSize: '36px', margin: '12px 0', color: 'var(--success)' }}>{analysisData?.readiness_score}</div>
                                    <p className="stat-label">{t('outOf100')}</p>
                                </Card>
                                <Card className="skillgap-card">
                                    <span className="stat-label">{t('gapOverview')}</span>
                                    <div className="gap-mini-stats" style={{ marginTop: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span className="stat-label">{t('critical')}:</span>
                                            <span style={{ fontWeight: 700, color: 'var(--error)' }}>{analysisData?.summary?.critical_gaps || 0}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span className="stat-label">{t('good')}:</span>
                                            <span style={{ fontWeight: 700, color: 'var(--success)' }}>{analysisData?.summary?.good_skills || 0}</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <Card className="skillgap-card">
                                <div className="skill-gap-table">
                                    <div className="skill-gap-header-row">
                                        <span>{t('skillName')}</span>
                                        <span>{t('required')}</span>
                                        <span>{t('user')}</span>
                                        <span>{t('status')}</span>
                                    </div>
                                    {analysisData?.skill_gaps?.map((skill, index) => (
                                        <div key={index} className="skill-gap-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1.5fr' }}>
                                            <span className="skill-name">{skill?.skill_name}</span>
                                            <span className="level-badge">{skill?.required_level}/10</span>
                                            <span className="level-badge muted">{skill?.user_level}/10</span>
                                            <span className={`status-badge ${skill?.status?.toLowerCase() || 'good'}`}>
                                                {skill?.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* AI Recommended Videos */}
                    <div className="learning-section-title-row">
                        <h3 className="learning-title">{t('recommendedLearningAI')}</h3>
                        <p className="learning-subtitle">{t('personalizedTutorials')}</p>
                    </div>

                    <div className="video-grid">
                        {videosLoading ? (
                            <div className="loading-box" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
                                <RefreshCw className="animate-spin" size={32} />
                                <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>{t('curatingVideos')}</p>
                            </div>
                        ) : learningVideos?.length > 0 ? (
                            learningVideos.map((video, index) => (
                                <div key={index} className="video-card">
                                    <a href={`https://www.youtube.com/watch?v=${video?.videoId}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                        <div className="video-thumbnail-wrap">
                                            <img src={video?.thumbnail} alt={video?.title} />
                                            <div className="video-play-hint">
                                                <Play size={24} fill="currentColor" />
                                            </div>
                                        </div>
                                        <div className="video-body">
                                            <h4 className="video-card-title">{video?.title}</h4>
                                            <span className="video-channel">{video?.channelTitle}</span>
                                            <p className="video-desc-short">{video?.description}</p>
                                            <div className="video-footer-row">
                                                <button className="watch-now-btn-small">{t('watchNow')}</button>
                                                <span className="duration-tag">{t('tutorial')}</span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            ))
                        ) : (
                            <Card className="skillgap-card" style={{ gridColumn: '1/-1', textAlign: 'center' }}>
                                <p className="cta-subtext">{t('noVideoRecommendations')}</p>
                            </Card>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE (Profile + Upload) */}
                <div className="skillgap-right">

                    {/* Profile Overview Card */}
                    <Card className="skillgap-card profile-overview-card">
                        <div className="profile-summary-header">
                            <h3 className="profile-name">{user?.name || user?.email || 'John Doe'}</h3>
                            <div className="profile-meta-muted">
                                <Calendar size={12} style={{ marginRight: '4px' }} />
                                {t('lastUpdated')}: 21 Feb 2026
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div className="stat-label" style={{ marginBottom: '8px' }}>{t('resumeStatus')}</div>
                            <span className={`status-badge ${resumeAnalysis ? 'analyzed' : 'empty'}`}>
                                {resumeAnalysis ? t('verified') : t('pendingUpload')}
                            </span>
                        </div>

                        <div className="quick-stats-grid">
                            <div className="stat-item">
                                <span className="stat-number">{analysisData?.match_percentage || 0}%</span>
                                <span className="stat-label">{t('skillScore')}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{resumeAnalysis?.overallScore || 0}%</span>
                                <span className="stat-label">{t('matchStrength')}</span>
                            </div>
                            <div className="stat-item" style={{ gridColumn: '1/-1' }}>
                                <span className="stat-number">
                                    {resumeAnalysis ? '85%' : '45%'}
                                </span>
                                <span className="stat-label">{t('profileCompletion')}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Actions Card */}
                    <Card className="skillgap-card quick-actions-card">
                        <h3 className="card-title-text" style={{ marginBottom: '20px' }}>{t('quickActions')}</h3>
                        <div className="action-stack">
                            <button className="button-primary" onClick={() => window.location.href = '/resume-upload'} style={{ width: '100%', height: '44px' }}>
                                <FileText size={18} />
                                {t('uploadResumeBtn')}
                            </button>
                            <button className="button-secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ width: '100%', height: '44px', marginTop: '12px' }}>
                                <TrendingUp size={18} />
                                {t('viewSkillGapReport')}
                            </button>
                            <button className="button-secondary" onClick={() => window.location.href = '/learning'} style={{ width: '100%', height: '44px', marginTop: '12px' }}>
                                <BookOpen size={18} />
                                {t('exploreCourses')}
                            </button>
                        </div>
                    </Card>

                    {/* Match Score Hint */}
                    <Card className="skillgap-card" style={{ marginTop: '24px', background: 'var(--bg-secondary)', border: 'none' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <AlertCircle size={20} color="var(--primary)" />
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                                **{t('tip')}:** {t('completeCriticalSkills')}
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SkillGapDashboard;
