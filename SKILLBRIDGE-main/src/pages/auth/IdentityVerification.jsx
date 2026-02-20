import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { UserCircle, Mail, Phone, CreditCard, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerUser, loginUser } from '../../services/api';
import '../../styles/Onboarding.css';

const IdentityVerification = () => {
    const [activeTab, setActiveTab] = useState('register');
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        setError('');
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!validateEmail(registerData.email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        if (registerData.phone.length !== 10 || !/^\d+$/.test(registerData.phone)) {
            setError('Phone number must be 10 digits');
            setLoading(false);
            return;
        }

        if (registerData.aadhaar.length !== 12 || !/^\d+$/.test(registerData.aadhaar)) {
            setError('Aadhaar number must be 12 digits');
            setLoading(false);
            return;
        }

        try {
            const response = await registerUser(registerData);
            login('candidate', response.name, response.userId, response.email);
            navigate('/dashboard');
        } catch (err) {
            setError(err.error || err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!validateEmail(loginData.email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            const response = await loginUser(loginData.name, loginData.email);
            login('candidate', response.name, response.userId, response.email);
            navigate('/dashboard');
        } catch (err) {
            setError(err.error || err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="onboarding-step fade-in">
            <div className="step-header">
                <div className="icon-bg bg-indigo-100 text-primary">
                    <UserCircle size={32} />
                </div>
                <h2>Welcome to SkillBridge AI</h2>
                <p>Sign up or login to get started with skill gap analysis and job matching</p>
            </div>

            <Card className="onboarding-card">
                {/* Tab Navigation */}
                <div className="auth-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('register'); setError(''); }}
                    >
                        Register
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('login'); setError(''); }}
                    >
                        Login
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Registration Form */}
                {activeTab === 'register' && (
                    <form onSubmit={handleRegisterSubmit}>
                        <div className="form-group">
                            <label htmlFor="reg-name">
                                <UserCircle size={16} className="inline mr-1" />
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
                                <Mail size={16} className="inline mr-1" />
                                Gmail ID
                            </label>
                            <input
                                type="email"
                                id="reg-email"
                                name="email"
                                placeholder="your.email@gmail.com"
                                value={registerData.email}
                                onChange={handleRegisterChange}
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-phone">
                                <Phone size={16} className="inline mr-1" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="reg-phone"
                                name="phone"
                                placeholder="10-digit phone number"
                                value={registerData.phone}
                                onChange={handleRegisterChange}
                                className="input-field"
                                maxLength="10"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-aadhaar">
                                <CreditCard size={16} className="inline mr-1" />
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

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Processing...' : 'Register'}
                        </Button>
                    </form>
                )}

                {/* Login Form */}
                {activeTab === 'login' && (
                    <form onSubmit={handleLoginSubmit}>
                        <div className="form-group">
                            <label htmlFor="login-name">
                                <UserCircle size={16} className="inline mr-1" />
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
                                <Mail size={16} className="inline mr-1" />
                                Gmail ID
                            </label>
                            <input
                                type="email"
                                id="login-email"
                                name="email"
                                placeholder="your.email@gmail.com"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                className="input-field"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Processing...' : 'Login'}
                        </Button>
                    </form>
                )}
            </Card>

            <div className="trust-note">
                <Mail size={16} />
                <span>Your data is encrypted and stored securely in Firebase</span>
            </div>
        </div>
    );
};

export default IdentityVerification;
