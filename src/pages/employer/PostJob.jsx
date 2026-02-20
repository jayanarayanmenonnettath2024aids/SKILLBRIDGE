import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Briefcase, MapPin, DollarSign, Users, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import '../../styles/Employer.css';

const API_URL = 'http://localhost:5000/api';

function PostJob() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    skills: '',
    location: '',
    workType: 'Full-time',
    salaryMin: '',
    salaryMax: '',
    experienceLevel: 'Entry Level',
    educationRequired: '10th Pass',
    openings: 1,
    applicationDeadline: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.company || !formData.description || !formData.location) {
        throw new Error('Please fill in all required fields');
      }

      if (!user || !user.id) {
        throw new Error('Please login as an employer to post jobs');
      }

      // Prepare job data
      const jobData = {
        title: formData.title,
        company: formData.company,
        employerId: user.id,
        employerName: user.name,
        employerEmail: user.email,
        description: formData.description,
        requirements: formData.requirements.split('\n').filter(r => r.trim()),
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        location: formData.location,
        workType: formData.workType,
        salary: {
          min: parseInt(formData.salaryMin) || 0,
          max: parseInt(formData.salaryMax) || 0,
          currency: 'INR'
        },
        experienceLevel: formData.experienceLevel,
        educationRequired: formData.educationRequired,
        openings: parseInt(formData.openings) || 1,
        applicationDeadline: formData.applicationDeadline || null
      };

      const response = await fetch(`${API_URL}/jobs/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to post job');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/employer');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0', maxWidth: '900px' }}>
      <Card style={{ padding: '2.5rem' }}>
        <div className="post-job-header" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <Briefcase size={32} color="#3B82F6" />
            <h1 style={{ margin: 0, fontSize: '2rem', color: '#1F2937' }}>Post a New Job</h1>
          </div>
          <p style={{ color: '#6B7280', margin: 0 }}>Fill in the details to attract the right candidates</p>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-banner">
            <CheckCircle size={20} />
            <span>Job posted successfully! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="job-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="title">Job Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Data Entry Operator"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="company">Company Name *</label>
              <input
                id="company"
                name="company"
                type="text"
                placeholder="Your company name"
                value={formData.company}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                name="description"
                rows="6"
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="requirements">Requirements (one per line)</label>
              <textarea
                id="requirements"
                name="requirements"
                rows="4"
                placeholder="- 10th pass or above&#10;- Basic computer knowledge&#10;- Good communication skills"
                value={formData.requirements}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="skills">Required Skills (comma separated)</label>
              <input
                id="skills"
                name="skills"
                type="text"
                placeholder="e.g., MS Excel, Data Entry, English"
                value={formData.skills}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Job Details */}
          <div className="form-section">
            <h3 className="section-title">Job Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">
                  <MapPin size={16} />
                  Location *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g., Mumbai, Remote"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="workType">Work Type</label>
                <select
                  id="workType"
                  name="workType"
                  value={formData.workType}
                  onChange={handleInputChange}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="salaryMin">
                  <DollarSign size={16} />
                  Minimum Salary (₹/month)
                </label>
                <input
                  id="salaryMin"
                  name="salaryMin"
                  type="number"
                  placeholder="12000"
                  value={formData.salaryMin}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="salaryMax">Maximum Salary (₹/month)</label>
                <input
                  id="salaryMax"
                  name="salaryMax"
                  type="number"
                  placeholder="20000"
                  value={formData.salaryMax}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="experienceLevel">Experience Level</label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                >
                  <option value="Fresher">Fresher</option>
                  <option value="Entry Level">Entry Level (0-2 years)</option>
                  <option value="Mid Level">Mid Level (2-5 years)</option>
                  <option value="Senior Level">Senior Level (5+ years)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="educationRequired">Education Required</label>
                <select
                  id="educationRequired"
                  name="educationRequired"
                  value={formData.educationRequired}
                  onChange={handleInputChange}
                >
                  <option value="8th Pass">8th Pass</option>
                  <option value="10th Pass">10th Pass</option>
                  <option value="12th Pass">12th Pass</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post Graduate">Post Graduate</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="openings">
                  <Users size={16} />
                  Number of Openings
                </label>
                <input
                  id="openings"
                  name="openings"
                  type="number"
                  min="1"
                  value={formData.openings}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="applicationDeadline">
                  <Calendar size={16} />
                  Application Deadline
                </label>
                <input
                  id="applicationDeadline"
                  name="applicationDeadline"
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/employer')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || success}>
              {loading ? 'Posting Job...' : success ? 'Posted!' : 'Post Job'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default PostJob;
