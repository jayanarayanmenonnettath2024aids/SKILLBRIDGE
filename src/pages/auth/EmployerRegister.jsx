import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Mail, Phone, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import '../../styles/Onboarding.css';

const API_URL = 'http://localhost:5000/api';

function EmployerRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    designation: '',
    companyWebsite: ''
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
      if (!formData.companyName || !formData.fullName || !formData.email || 
          !formData.phoneNumber || !formData.password) {
        throw new Error('Please fill in all required fields');
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate phone
      if (formData.phoneNumber.length < 10) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Validate password
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Validate company website URL format if provided
      if (formData.companyWebsite && formData.companyWebsite.trim() !== '') {
        const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
        if (!urlRegex.test(formData.companyWebsite)) {
          throw new Error('Please enter a valid website URL (e.g., www.company.com or https://company.com)');
        }
      }

      // Prepare registration data
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: 'employer',
        companyName: formData.companyName,
        designation: formData.designation,
        companyWebsite: formData.companyWebsite,
        // Dummy data for required fields
        dateOfBirth: new Date('1990-01-01'),
        gender: 'other',
        faceImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==' // Small dummy base64
      };

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Provide more helpful error message for existing users
        if (data.message && data.message.includes('already exists')) {
          throw new Error('An account with this email or phone already exists. If you registered as a candidate, please use candidate login. Otherwise, use a different email/phone number.');
        }
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/employer-login');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="login-wrapper">
        <Card className="login-card" style={{ maxWidth: '600px' }}>
          <div className="login-step fade-in">
            <div className="step-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Building2 size={40} color="#3B82F6" />
                <h2 style={{ margin: 0 }}>Employer Registration</h2>
              </div>
              <p>Create your employer account to start hiring</p>
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
                <span>Registration successful! Redirecting to login...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {/* Company Details */}
              <div className="form-section">
                <h4 style={{ marginBottom: '1rem', color: '#1F2937' }}>Company Information</h4>
                
                <div className="form-group">
                  <label htmlFor="companyName">
                    <Building2 size={18} />
                    Company Name *
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="companyWebsite">
                    <Building2 size={18} />
                    Company Website (Optional)
                  </label>
                  <input
                    id="companyWebsite"
                    name="companyWebsite"
                    type="text"
                    placeholder="https://www.company.com"
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Personal Details */}
              <div className="form-section">
                <h4 style={{ marginBottom: '1rem', color: '#1F2937' }}>Your Information</h4>
                
                <div className="form-group">
                  <label htmlFor="fullName">
                    <User size={18} />
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="designation">
                    <User size={18} />
                    Designation (Optional)
                  </label>
                  <input
                    id="designation"
                    name="designation"
                    type="text"
                    placeholder="e.g., HR Manager, Recruiter"
                    value={formData.designation}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <Mail size={18} />
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">
                    <Phone size={18} />
                    Phone Number *
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    maxLength="10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-section">
                <h4 style={{ marginBottom: '1rem', color: '#1F2937' }}>Create Password</h4>
                
                <div className="form-group">
                  <label htmlFor="password">
                    <Lock size={18} />
                    Password *
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password (min 6 characters)"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <Lock size={18} />
                    Confirm Password *
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading || success} className="login-btn">
                {loading ? 'Registering...' : success ? 'Success!' : 'Register as Employer'}
              </Button>
            </form>

            <div className="login-footer">
              <p>
                Already have an account?{' '}
                <Link to="/employer-login" className="link">
                  Login here
                </Link>
              </p>
              <p>
                Looking for a job?{' '}
                <Link to="/onboarding" className="link">
                  Register as Candidate
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default EmployerRegister;
