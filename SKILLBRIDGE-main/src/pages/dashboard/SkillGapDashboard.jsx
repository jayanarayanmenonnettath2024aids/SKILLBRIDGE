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
  const [error, setError] = useState(null);
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
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
            <p>Loading your profile data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header flex justify-between items-center mb-6">
        <div>
          <h1 className="dashboard-title flex items-center gap-2">
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
      <Card className="mb-6 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Users size={20} />
            {user ? (
              <div>
                <label className="font-semibold">Viewing Profile:</label>
                <span className="ml-2 text-lg font-bold text-purple-600">
                  {user.name || user.email || 'Current User'}
                </span>
              </div>
            ) : (
              <label className="font-semibold">Select User:</label>
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
        <Card className="mb-8 p-8 text-center">
          <RefreshCw className="animate-spin mx-auto mb-3" size={32} color="#667eea" />
          <p className="text-secondary">Loading your resume analysis...</p>
        </Card>
      )}
      
      {!resumeLoading && !resumeAnalysis && selectedUserId && (
        <Card className="mb-8 p-8 text-center">
          <AlertCircle className="mx-auto mb-3" size={48} color="#F59E0B" />
          <h3 className="text-lg font-semibold mb-2">No Resume Analysis Found</h3>
          {userResumeURL ? (
            <>
              <p className="text-secondary mb-4">
                Your resume was uploaded but analysis is missing. This may happen if the AI analysis failed.
                Click below to re-analyze your resume.
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={handleReanalyzeResume}
                  disabled={reanalyzing}
                >
                  {reanalyzing ? (
                    <>
                      <RefreshCw className="animate-spin mr-2" size={16} />
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
              <p className="text-secondary mb-4">
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
        <div className="mb-8">
          <div className="section-head mb-4">
            <h3>Professional Summary from Resume</h3>
          </div>
          
          {/* Summary Card */}
          {resumeAnalysis.summary && (
            <Card className="mb-4 p-6" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
              <div className="flex items-start gap-3">
                <Award size={32} className="flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-bold mb-2">About You</h4>
                  <p className="text-white/90 leading-relaxed">{resumeAnalysis.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {resumeAnalysis.experienceLevel && (
                      <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
                        {resumeAnalysis.experienceLevel}
                      </span>
                    )}
                    {resumeAnalysis.totalYearsOfExperience && (
                      <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
                        {resumeAnalysis.totalYearsOfExperience} years experience
                      </span>
                    )}
                    {resumeAnalysis.overallScore && (
                      <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-semibold">
                        Overall Score: {resumeAnalysis.overallScore}/100
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths Card */}
            {resumeAnalysis.strengths && resumeAnalysis.strengths.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div style={{padding: '8px', borderRadius: '8px', background: '#D1FAE5'}}>
                    <CheckCircle size={24} color="#10B981" />
                  </div>
                  <h4 className="text-lg font-bold">Key Strengths</h4>
                </div>
                <ul className="space-y-2">
                  {resumeAnalysis.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle size={16} color="#10B981" className="flex-shrink-0 mt-1" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Areas for Improvement Card */}
            {resumeAnalysis.improvements && resumeAnalysis.improvements.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div style={{padding: '8px', borderRadius: '8px', background: '#FEF3C7'}}>
                    <Target size={24} color="#F59E0B" />
                  </div>
                  <h4 className="text-lg font-bold">Areas for Improvement</h4>
                </div>
                <ul className="space-y-2">
                  {resumeAnalysis.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <AlertCircle size={16} color="#F59E0B" className="flex-shrink-0 mt-1" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Education Card */}
            {resumeAnalysis.education && resumeAnalysis.education.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div style={{padding: '8px', borderRadius: '8px', background: '#DBEAFE'}}>
                    <BookOpen size={24} color="#3B82F6" />
                  </div>
                  <h4 className="text-lg font-bold">Education</h4>
                </div>
                <div className="space-y-3">
                  {resumeAnalysis.education.map((edu, idx) => (
                    <div key={idx} className="border-l-2 border-blue-500 pl-3">
                      <div className="font-semibold">{edu.degree}</div>
                      <div className="text-sm text-secondary">{edu.field}</div>
                      <div className="text-sm text-secondary">{edu.institution}</div>
                      {edu.year && <div className="text-xs text-secondary mt-1">{edu.year}</div>}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Recommended Roles Card */}
            {resumeAnalysis.recommendedRoles && resumeAnalysis.recommendedRoles.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div style={{padding: '8px', borderRadius: '8px', background: '#E9D5FF'}}>
                    <Briefcase size={24} color="#9333EA" />
                  </div>
                  <h4 className="text-lg font-bold">Recommended Roles</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeAnalysis.recommendedRoles.map((role, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                      {role}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Projects Section */}
          {resumeAnalysis.projects && resumeAnalysis.projects.length > 0 && (
            <div className="mt-6">
              <div className="section-head mb-4">
                <h3 className="flex items-center gap-2">
                  <Code size={24} />
                  Projects Portfolio
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {resumeAnalysis.projects.map((project, idx) => (
                  <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div style={{padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', flexShrink: 0}}>
                        <Lightbulb size={28} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-xl font-bold mb-1">{project.name}</h4>
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                              {project.type}
                            </span>
                          </div>
                        </div>
                        <p className="text-secondary mb-3 leading-relaxed">
                          {project.description}
                        </p>
                        
                        {/* Technologies */}
                        <div className="mb-3">
                          <strong className="text-sm text-gray-600">Technologies:</strong>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.technologies.map((tech, techIdx) => (
                              <span key={techIdx} className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Highlights */}
                        {project.highlights && project.highlights.length > 0 && (
                          <div>
                            <strong className="text-sm text-gray-600">Key Highlights:</strong>
                            <ul className="mt-2 space-y-1">
                              {project.highlights.map((highlight, highlightIdx) => (
                                <li key={highlightIdx} className="flex items-start gap-2 text-sm">
                                  <CheckCircle size={16} color="#10B981" className="flex-shrink-0 mt-0.5" />
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
            <div className="mt-6">
              <div className="section-head mb-4">
                <h3 className="flex items-center gap-2">
                  <Trophy size={24} />
                  Achievements & Recognition
                </h3>
              </div>
              <Card className="p-6">
                <ul className="space-y-3">
                  {resumeAnalysis.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div style={{padding: '6px', borderRadius: '6px', background: '#FEF3C7', flexShrink: 0}}>
                        <Trophy size={18} color="#F59E0B" />
                      </div>
                      <span className="text-sm leading-relaxed">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}

          {/* Certifications Section */}
          {resumeAnalysis.certifications && resumeAnalysis.certifications.length > 0 && (
            <div className="mt-6">
              <div className="section-head mb-4">
                <h3 className="flex items-center gap-2">
                  <Award size={24} />
                  Certifications
                </h3>
              </div>
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {resumeAnalysis.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-green-50">
                      <CheckCircle size={18} color="#10B981" className="flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{cert}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Match Percentage Card */}
            <Card className="skill-gap-card text-center">
              <h3 className="text-sm text-secondary mb-2">Skill Match Percentage</h3>
              <div className="score-circle mx-auto mb-3">
                <span className="score-main">{analysisData.match_percentage}%</span>
              </div>
              <p className="text-xs text-secondary">
                How much of required skills the user currently possesses
              </p>
            </Card>

            {/* Readiness Score Card */}
            <Card className="skill-gap-card text-center">
              <h3 className="text-sm text-secondary mb-2">Overall Readiness Score</h3>
              <div className="score-circle mx-auto mb-3" style={{
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
              <p className="text-xs text-secondary">
                Job readiness considering gap severity
              </p>
            </Card>

            {/* Summary Stats Card */}
            <Card className="skill-gap-card">
              <h3 className="text-sm text-secondary mb-3">Gap Summary</h3>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Skills Required:</span>
                  <span className="font-semibold">{analysisData.summary.total_skills_required}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Critical Gaps:</span>
                  <span className="font-semibold text-red-600">
                    {analysisData.summary.critical_gaps}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Moderate Gaps:</span>
                  <span className="font-semibold text-orange-600">
                    {analysisData.summary.moderate_gaps}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Good Skills:</span>
                  <span className="font-semibold text-green-600">
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

                    <div className="text-center">
                      <span className="level-badge">{skill.required_level} / 10</span>
                    </div>

                    <div className="text-center">
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
                        {skill.status === 'Good' && <CheckCircle size={12} className="inline mr-1" />}
                        {skill.status === 'Critical' && <AlertCircle size={12} className="inline mr-1" />}
                        {skill.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recommendations Section */}
          <div className="dashboard-section mt-8">
            <div className="section-head">
              <h3>Priority Actions & Recommendations</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisData.skill_gaps
                .filter(s => s.status === 'Critical' || s.status === 'Moderate')
                .slice(0, 4)
                .map((skill, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`priority-icon ${skill.status === 'Critical' ? 'bg-red-100' : 'bg-orange-100'}`}>
                        <AlertCircle size={20} color={skill.status === 'Critical' ? '#EF4444' : '#F59E0B'} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{skill.skill_name}</h4>
                        <p className="text-sm text-secondary mb-2">
                          Current: {skill.user_level}/10 → Target: {skill.required_level}/10
                        </p>
                        <p className="text-sm">
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
        <div className="dashboard-section mt-12 video-section">
          <div className="video-section-header">
            <div className="flex items-center gap-3 mb-2">
              <div className="video-icon-wrapper">
                <Youtube size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  Recommended Learning Videos
                  <span className="video-badge">AI-Powered</span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">Personalized tutorials based on your resume skills</p>
              </div>
            </div>
          </div>
          
          {videosLoading ? (
            <div className="video-loading">
              <RefreshCw className="animate-spin" size={32} />
              <p className="mt-3 text-lg font-medium">Finding the best videos for you...</p>
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
                          <Play size={24} className="text-white" fill="white" />
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
              <Button variant="primary" className="mt-4" onClick={() => window.location.href = '/resume-upload'}>
                <BookOpen size={16} className="mr-2" />
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
