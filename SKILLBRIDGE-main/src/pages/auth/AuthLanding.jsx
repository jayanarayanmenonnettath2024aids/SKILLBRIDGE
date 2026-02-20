import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { UserCircle, Mail, Phone, CreditCard, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerUser, loginUser } from '../../services/api';
import '../../styles/AuthLanding.css';

const AuthLanding = () => {
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        phone: '',
        aadhaar: ''
    });
    const [loginData, setLoginData] = useState({
        name: '',
        email: ''
    });
    const [registerLoading, setRegisterLoading] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [registerError, setRegisterError] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
        setRegisterError('');
    };

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        setLoginError('');
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setRegisterError('');
        setRegisterLoading(true);

        if (!validateEmail(registerData.email)) {
            setRegisterError('Please enter a valid email address');
            setRegisterLoading(false);
            return;
        }

        if (registerData.phone.length !== 10 || !/^\d+$/.test(registerData.phone)) {
            setRegisterError('Phone number must be 10 digits');
            setRegisterLoading(false);
            return;
        }

        if (registerData.aadhaar.length !== 12 || !/^\d+$/.test(registerData.aadhaar)) {
            setRegisterError('Aadhaar number must be 12 digits');
            setRegisterLoading(false);
            return;
        }

        try {
            const response = await registerUser(registerData);
            login('candidate', response.name, response.userId, response.email);
            navigate('/resume-upload');
        } catch (err) {
            setRegisterError(err.error || err.message || 'Registration failed. Please try again.');
        } finally {
            setRegisterLoading(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);

        if (!validateEmail(loginData.email)) {
            setLoginError('Please enter a valid email address');
            setLoginLoading(false);
            return;
        }

        try {
            const response = await loginUser(loginData.name, loginData.email);
            login('candidate', response.name, response.userId, response.email);
            navigate('/resume-upload');
        } catch (err) {
            setLoginError(err.error || err.message || 'Login failed. Please try again.');
        } finally {
            setLoginLoading(false);
        }
    };

    return (
        <div className="auth-landing">
            <div className="auth-landing-header">
                <h1 className="auth-landing-title">Welcome to SkillBridge AI</h1>
                <p className="auth-landing-subtitle">
                    Your AI-Powered Career Intelligence Platform - Upload your resume, get skill gap analysis, 
                    and discover perfect job matches
                </p>
            </div>

            <div className="auth-cards-container">
                {/* Login Card */}
                <Card className="auth-card login-card">
                    <div className="auth-card-header">
                        <div className="auth-icon-wrapper">
                            <UserCircle size={40} className="text-primary" />
                        </div>
                        <h2 className="auth-card-title">Login</h2>
                        <p className="auth-card-description">
                            Already have an account? Sign in to continue
                        </p>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="auth-form">
                        {loginError && (
                            <div className="error-message">
                                <AlertCircle size={16} />
                                <span>{loginError}</span>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="login-name">
                                <UserCircle size={16} className="inline-icon" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="login-name"
                                name="name"
                                placeholder="Enter your full name"
                                value={loginData.name}
                                onChange={handleLoginChange}
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="login-email">
                                <Mail size={16} className="inline-icon" />
                                Gmail ID
                            </label>
                            <input
                                type="email"
                                id="login-email"
                                name="email"
                                placeholder="youremail@gmail.com"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                className="input-field"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="auth-submit-btn"
                            disabled={loginLoading}
                        >
                            {loginLoading ? 'Logging in...' : 'Login'}
                            <ArrowRight size={20} />
                        </Button>
                    </form>
                </Card>

                {/* Registration Card */}
                <Card className="auth-card register-card">
                    <div className="auth-card-header">
                        <div className="auth-icon-wrapper register-icon">
                            <UserCircle size={40} className="text-success" />
                        </div>
                        <h2 className="auth-card-title">Register</h2>
                        <p className="auth-card-description">
                            New user? Create your account to get started
                        </p>
                    </div>

                    <form onSubmit={handleRegisterSubmit} className="auth-form">
                        {registerError && (
                            <div className="error-message">
                                <AlertCircle size={16} />
                                <span>{registerError}</span>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="reg-name">
                                <UserCircle size={16} className="inline-icon" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="reg-name"
                                name="name"
                                placeholder="Enter your full name"
                                value={registerData.name}
                                onChange={handleRegisterChange}
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-email">
                                <Mail size={16} className="inline-icon" />
                                Gmail ID
                            </label>
                            <input
                                type="email"
                                id="reg-email"
                                name="email"
                                placeholder="youremail@gmail.com"
                                value={registerData.email}
                                onChange={handleRegisterChange}
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-phone">
                                <Phone size={16} className="inline-icon" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="reg-phone"
                                name="phone"
                                placeholder="10-digit mobile number"
                                value={registerData.phone}
                                onChange={handleRegisterChange}
                                className="input-field"
                                maxLength="10"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-aadhaar">
                                <CreditCard size={16} className="inline-icon" />
                                Aadhaar Number
                            </label>
                            <input
                                type="text"
                                id="reg-aadhaar"
                                name="aadhaar"
                                placeholder="12-digit Aadhaar number"
                                value={registerData.aadhaar}
                                onChange={handleRegisterChange}
                                className="input-field"
                                maxLength="12"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="success"
                            size="lg"
                            className="auth-submit-btn"
                            disabled={registerLoading}
                        >
                            {registerLoading ? 'Creating Account...' : 'Register'}
                            <ArrowRight size={20} />
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default AuthLanding;
