import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import '../../styles/Onboarding.css';

const API_URL = 'http://localhost:5000/api';

function EmployerLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Check if user is an employer
      if (data.user.role !== 'employer') {
        console.log('User role:', data.user.role); // Debug log
        throw new Error('This account is registered as a candidate. Please use the candidate login or register a new employer account with a different email.');
      }

      // Store auth data (no face verification needed for employers)
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update auth context
      login('employer', data.user);
      
      // Navigate to employer dashboard
      navigate('/employer');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="login-wrapper">
        <Card className="login-card">
          <div className="login-step fade-in">
            <div className="step-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Building2 size={40} color="#3B82F6" />
                <h2 style={{ margin: 0 }}>{t('auth.employerLogin')}</h2>
              </div>
              <p>{t('auth.signInEmployer')}</p>
            </div>

            {error && (
              <div className="error-banner">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="identifier">
                  <Mail size={18} />
                  {t('auth.emailOrPhone')}
                </label>
                <input
                  id="identifier"
                  type="text"
                  placeholder="Enter your email or phone"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <Lock size={18} />
                  {t('auth.password')}
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <Button type="submit" disabled={loading} className="login-btn">
                {loading ? t('auth.signingIn') : t('auth.signInButton')}
              </Button>
            </form>

            <div className="login-footer">
              <p>
                {t('auth.noAccount')}{' '}
                <Link to="/employer-register" className="link">
                  {t('auth.registerHere')}
                </Link>
              </p>
              <p>
                {t('auth.lookingForJob')}{' '}
                <Link to="/login" className="link">
                  {t('auth.candidateLogin')}
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default EmployerLogin;
