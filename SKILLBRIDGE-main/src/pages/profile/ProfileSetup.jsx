import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Code, Briefcase, MapPin, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { updateUserProfileAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/ProfileSetup.css';

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    interestedDomain: '',
    skillsSelected: [],
    fieldOfInterest: '',
    experienceLevel: 'Fresher',
    location: 'Remote'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Job Domain Options
  const domainOptions = [
    { value: 'AI Engineer', label: 'AI Engineer', icon: '🤖' },
    { value: 'Web Developer', label: 'Web Developer', icon: '💻' },
    { value: 'Data Analyst', label: 'Data Analyst', icon: '📊' },
    { value: 'Mobile App Developer', label: 'Mobile Developer', icon: '📱' },
    { value: 'DevOps Engineer', label: 'DevOps Engineer', icon: '⚙️' },
    { value: 'Cloud Engineer', label: 'Cloud Engineer', icon: '☁️' },
    { value: 'Full Stack Developer', label: 'Full Stack Developer', icon: '🌐' },
    { value: 'Machine Learning Engineer', label: 'ML Engineer', icon: '🧠' },
    { value: 'Cybersecurity Analyst', label: 'Cybersecurity', icon: '🔒' },
    { value: 'UI/UX Designer', label: 'UI/UX Designer', icon: '🎨' }
  ];

  // Skills Options
  const skillsOptions = [
    'Python', 'JavaScript', 'Java', 'C++', 'React', 'Node.js',
    'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning',
    'SQL', 'MongoDB', 'AWS', 'Azure', 'Docker', 'Kubernetes',
    'Git', 'REST API', 'GraphQL', 'TypeScript', 'HTML/CSS',
    'Angular', 'Vue.js', 'Django', 'Flask', 'Spring Boot',
    'Data Analysis', 'Pandas', 'NumPy', 'Excel', 'Tableau',
    'Power BI', 'Figma', 'Adobe XD', 'UI Design', 'UX Research'
  ];

  // Experience Level Options
  const experienceLevels = [
    { value: 'Fresher', label: 'Fresher (0-1 years)' },
    { value: 'Junior', label: 'Junior (1-3 years)' },
    { value: 'Mid-Level', label: 'Mid-Level (3-5 years)' },
    { value: 'Senior', label: 'Senior (5+ years)' }
  ];

  const handleDomainSelect = (domain) => {
    setFormData({ ...formData, interestedDomain: domain });
  };

  const handleSkillToggle = (skill) => {
    const skills = formData.skillsSelected;
    if (skills.includes(skill)) {
      setFormData({
        ...formData,
        skillsSelected: skills.filter(s => s !== skill)
      });
    } else {
      setFormData({
        ...formData,
        skillsSelected: [...skills, skill]
      });
    }
  };

  const handleSubmit = async () => {
    setError('');

    // Validation
    if (!formData.interestedDomain) {
      setError('Please select your interested domain');
      return;
    }

    if (formData.skillsSelected.length === 0) {
      setError('Please select at least one skill');
      return;
    }

    if (!formData.fieldOfInterest) {
      setError('Please enter your field of interest');
      return;
    }

    setLoading(true);

    try {
      // Update user profile in backend
      const result = await updateUserProfileAPI({
        userId: user.id,
        ...formData
      });

      if (result.success) {
        // Navigate to skill gap dashboard
        navigate('/dashboard/skills');
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-setup-container">
      <div className="setup-content">
        <div className="setup-header">
          <div className="icon-bg">
            <Target size={32} />
          </div>
          <h1>Complete Your Profile</h1>
          <p>Tell us about your skills and career interests</p>
        </div>

        <Card className="setup-card">
          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}

          {/* Domain Selection */}
          <div className="form-section">
            <label className="section-label">
              <Briefcase size={20} />
              Select Your Interested Domain *
            </label>
            <div className="domain-grid">
              {domainOptions.map((domain) => (
                <button
                  key={domain.value}
                  className={`domain-card ${
                    formData.interestedDomain === domain.value ? 'selected' : ''
                  }`}
                  onClick={() => handleDomainSelect(domain.value)}
                  type="button"
                >
                  <span className="domain-icon">{domain.icon}</span>
                  <span className="domain-label">{domain.label}</span>
                  {formData.interestedDomain === domain.value && (
                    <CheckCircle size={20} className="check-icon" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Selection */}
          <div className="form-section">
            <label className="section-label">
              <Code size={20} />
              Select Your Skills * (Choose at least 3)
            </label>
            <div className="skills-selected-count">
              {formData.skillsSelected.length} skills selected
            </div>
            <div className="skills-grid">
              {skillsOptions.map((skill) => (
                <button
                  key={skill}
                  className={`skill-tag ${
                    formData.skillsSelected.includes(skill) ? 'selected' : ''
                  }`}
                  onClick={() => handleSkillToggle(skill)}
                  type="button"
                >
                  {skill}
                  {formData.skillsSelected.includes(skill) && (
                    <CheckCircle size={14} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Field of Interest */}
          <div className="form-section">
            <label className="section-label">
              <Target size={20} />
              Field of Interest *
            </label>
            <input
              type="text"
              placeholder="E.g., Natural Language Processing, Full Stack Web Development"
              value={formData.fieldOfInterest}
              onChange={(e) =>
                setFormData({ ...formData, fieldOfInterest: e.target.value })
              }
              className="text-input"
            />
          </div>

          {/* Experience Level */}
          <div className="form-section">
            <label className="section-label">
              <Briefcase size={20} />
              Experience Level
            </label>
            <div className="experience-options">
              {experienceLevels.map((level) => (
                <button
                  key={level.value}
                  className={`experience-btn ${
                    formData.experienceLevel === level.value ? 'selected' : ''
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, experienceLevel: level.value })
                  }
                  type="button"
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location Preference */}
          <div className="form-section">
            <label className="section-label">
              <MapPin size={20} />
              Location Preference
            </label>
            <input
              type="text"
              placeholder="E.g., Remote, Bangalore, Mumbai"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="text-input"
            />
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Saving...' : 'Continue to Dashboard'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
