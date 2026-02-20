import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, MapPin, Building2, TrendingUp, RefreshCw, Filter, UserCheck, Target, Award } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { searchMatchingJobs, getSkillGapAnalysis } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/JobMatching.css';

const JobMatching = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [filters, setFilters] = useState({
    jobTitle: '',
    location: 'Remote'
  });
  const { user } = useAuth();

  useEffect(() => {
    loadUserProfileAndJobs();
  }, []);

  const loadUserProfileAndJobs = async () => {
    try {
      // First fetch user profile with resume analysis
      const analysisResult = await getSkillGapAnalysis(user.id);
      if (analysisResult.success && analysisResult.data) {
        setUserProfile(analysisResult.data);
      }
      // Then fetch jobs
      await fetchMatchingJobs();
    } catch (err) {
      console.error('Error loading profile:', err);
      // Continue to fetch jobs even if profile fails
      await fetchMatchingJobs();
    }
  };

  const fetchMatchingJobs = async (customFilters = null) => {
    setLoading(true);
    setError('');

    try {
      const searchFilters = customFilters || filters;
      console.log('🔍 Searching jobs with filters:', { userId: user.id, ...searchFilters });
      
      const result = await searchMatchingJobs({
        userId: user.id,
        ...searchFilters
      });

      console.log('📊 Job search result:', result);

      if (result.success) {
        setJobs(result.data.matchedJobs || []);
        // Store search criteria returned from backend
        if (result.searchCriteria) {
          setSearchCriteria(result.searchCriteria);
        }
        
        // Check if using mock data
        if (result.data.note) {
          console.log(`ℹ️ ${result.data.note}`);
        }
        
        console.log(`✅ Found ${result.data.matchedJobs?.length || 0} jobs`);
      } else {
        console.error('❌ Job search failed:', result.error);
        throw new Error(result.error || 'Failed to fetch jobs');
      }
    } catch (err) {
      console.error('❌ Job search error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchMatchingJobs(filters);
  };

  const getMatchColor = (score) => {
    if (score >= 75) return 'match-high';
    if (score >= 50) return 'match-medium';
    return 'match-low';
  };

  const getMatchLabel = (score) => {
    if (score >= 75) return 'Excellent Match';
    if (score >= 50) return 'Good Match';
    return 'Potential Match';
  };

  if (loading) {
    return (
      <div className="job-matching-container">
        <div className="loading-state">
          <RefreshCw size={48} className="spin" />
          <p>Analyzing your resume and searching real job listings...</p>
          <p className="loading-subtext">Searching LinkedIn, Indeed, Naukri & Glassdoor</p>
        </div>
      </div>
    );
  }

  const resumeAnalysis = userProfile?.geminiAnalysis;
  const userSkills = resumeAnalysis?.extractedSkills?.slice(0, 5) || [];
  const recommendedRoles = resumeAnalysis?.recommendedRoles?.slice(0, 3) || [];

  return (
    <div className="job-matching-container">
      {/* Header */}
      <div className="matching-header">
        <div className="header-content">
          <Search size={32} className="header-icon" />
          <div>
            <h1>Job Matching Dashboard</h1>
            <p>Real job listings matched to your skills and experience</p>
          </div>
        </div>
      </div>

      {/* User Profile Summary */}
      {resumeAnalysis && (
        <Card className="profile-summary-card">
          <div className="profile-summary-header">
            <UserCheck size={24} />
            <h3>Your Profile Match Criteria</h3>
          </div>
          
          <div className="profile-summary-content">
            {/* Top Skills */}
            {userSkills.length > 0 && (
              <div className="profile-section">
                <div className="section-header">
                  <Award size={18} />
                  <span>Top Skills</span>
                </div>
                <div className="skills-badges">
                  {userSkills.map((skillObj, idx) => (
                    <Badge key={idx} variant="primary">
                      {typeof skillObj === 'object' ? skillObj.skill : skillObj}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Roles */}
            {recommendedRoles.length > 0 && (
              <div className="profile-section">
                <div className="section-header">
                  <Target size={18} />
                  <span>Recommended Roles</span>
                </div>
                <div className="roles-list">
                  {recommendedRoles.map((role, idx) => (
                    <span key={idx} className="role-tag">{role}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Level */}
            {resumeAnalysis.experienceLevel && (
              <div className="profile-section">
                <div className="section-header">
                  <Building2 size={18} />
                  <span>Experience Level</span>
                </div>
                <p className="experience-text">{resumeAnalysis.experienceLevel}</p>
              </div>
            )}
          </div>

          {/* Active Search Criteria */}
          {searchCriteria && (
            <div className="active-search-banner">
              <Search size={16} />
              <span>
                Searching for: <strong>{searchCriteria.domain}</strong> in <strong>{searchCriteria.location}</strong>
              </span>
            </div>
          )}
        </Card>
      )}

      {/* Search Filters */}
      <Card className="search-filters">
        <div className="filter-group">
          <div className="filter-input">
            <label>
              <Building2 size={18} />
              Job Title / Role {!filters.jobTitle && <span className="optional-label">(optional - uses your recommended roles)</span>}
            </label>
            <input
              type="text"
              placeholder={recommendedRoles.length > 0 ? `E.g., ${recommendedRoles[0]}` : "E.g., Software Engineer"}
              value={filters.jobTitle}
              onChange={(e) => setFilters({ ...filters, jobTitle: e.target.value })}
            />
          </div>

          <div className="filter-input">
            <label>
              <MapPin size={18} />
              Location
            </label>
            <input
              type="text"
              placeholder="E.g., Remote, Bangalore, India"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>

          <Button onClick={handleSearch} className="search-btn">
            <Search size={18} />
            {filters.jobTitle ? 'Search Jobs' : 'Search Recommended Jobs'}
          </Button>
        </div>
        
        {!resumeAnalysis && (
          <div className="profile-warning">
            <p>💡 Upload your resume to get AI-powered job recommendations based on your skills!</p>
          </div>
        )}
      </Card>

      {/* Error State */}
      {error && (
        <Card className="error-card">
          <p>{error}</p>
          <Button onClick={() => fetchMatchingJobs()}>Try Again</Button>
        </Card>
      )}

      {/* Results Summary */}
      {!error && jobs.length > 0 && (
        <div className="results-summary">
          <p>
            <strong>{jobs.length}</strong> matching jobs found
          </p>
        </div>
      )}

      {/* Job Listings */}
      {!error && jobs.length === 0 ? (
        <Card className="empty-state">
          <Search size={64} className="empty-icon" />
          <h2>No Jobs Found</h2>
          <p>Try adjusting your search filters or complete your profile for better matches</p>
          <Button onClick={() => fetchMatchingJobs()}>Search Again</Button>
        </Card>
      ) : (
        <div className="jobs-list">
          {jobs.map((job, index) => (
            <Card key={index} className="job-card">
              {/* Match Score */}
              <div className="job-card-header">
                <div className={`match-score ${getMatchColor(job.matchScore)}`}>
                  <TrendingUp size={16} />
                  <div>
                    <div className="score-value">{job.matchScore}%</div>
                    <div className="score-label">{getMatchLabel(job.matchScore)}</div>
                  </div>
                </div>
                <span className="job-source">{job.source}</span>
              </div>

              {/* Job Title */}
              <h3 className="job-title">{job.title}</h3>

              {/* Job Description */}
              <p className="job-snippet">{job.snippet}</p>

              {/* Job Link */}
              <div className="job-actions">
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apply-link"
                >
                  <ExternalLink size={18} />
                  View Job Details
                </a>
                <span className="job-platform">{job.displayLink}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      {!loading && jobs.length > 0 && (
        <div className="load-more-section">
          <Button onClick={() => fetchMatchingJobs()} variant="outline">
            <RefreshCw size={18} />
            Refresh Results
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobMatching;
