import React, { useState, useEffect } from 'react';
import { Briefcase, TrendingUp, DollarSign, Clock, ExternalLink, Sparkles } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getJobRecommendations } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/JobRecommendation.css';

const JobRecommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getJobRecommendations(user.id);

      if (result.success) {
        setRecommendations(result.data.recommendations || []);
      } else {
        throw new Error(result.error || 'Failed to fetch recommendations');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'match-excellent';
    if (score >= 60) return 'match-good';
    if (score >= 40) return 'match-moderate';
    return 'match-low';
  };

  if (loading) {
    return (
      <div className="job-recommendation-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading AI-powered job recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-recommendation-container">
        <Card className="error-card">
          <h2>Failed to Load Recommendations</h2>
          <p>{error}</p>
          <Button onClick={fetchRecommendations}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="job-recommendation-container">
      <div className="recommendation-header">
        <div className="header-content">
          <Sparkles size={32} className="header-icon" />
          <div>
            <h1>AI-Powered Job Recommendations</h1>
            <p>Personalized job roles based on your skills and career goals</p>
          </div>
        </div>
        <Button onClick={fetchRecommendations} variant="outline">
          Refresh
        </Button>
      </div>

      {recommendationsthis.length === 0 ? (
        <Card className="empty-state">
          <Briefcase size={64} className="empty-icon" />
          <h2>No Recommendations Yet</h2>
          <p>Complete your profile and upload your resume to get personalized recommendations</p>
        </Card>
      ) : (
        <div className="recommendations-grid">
          {recommendations.map((job, index) => (
            <Card key={index} className="recommendation-card">
              {/* Match Score Badge */}
              <div className={`match-badge ${getMatchColor(job.matchScore)}`}>
                <TrendingUp size={16} />
                {job.matchScore}% Match
              </div>

              {/* Job Title */}
              <h3 className="job-title">{job.jobTitle}</h3>

              {/* Match Reason */}
              <p className="match-reason">{job.reason}</p>

              {/* Job Details */}
              <div className="job-details">
                <div className="detail-item">
                  <DollarSign size={18} />
                  <span>{job.salaryRange || 'Competitive'}</span>
                </div>
                <div className="detail-item">
                  <Clock size={18} />
                  <span>{job.experienceRequired || 'Entry Level'}</span>
                </div>
              </div>

              {/* Required Skills */}
              <div className="required-skills">
                <label>Key Skills Required:</label>
                <div className="skills-list">
                  {job.requiredSkills?.slice(0, 6).map((skill, idx) => (
                    <span key={idx} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button
                className="view-jobs-btn"
                onClick={() => window.open(`/job-matching?role=${encodeURIComponent(job.jobTitle)}`, '_self')}
              >
                <ExternalLink size={16} />
                Find Matching Jobs
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobRecommendation;
