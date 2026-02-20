import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Building2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import FaceCapture from './FaceCapture';
import '../../styles/Login.css';

const LoginPage = () => {
    const [mode, setMode] = useState('candidate'); // 'candidate' or 'employer'
    const [step, setStep] = useState('form'); // 'form' or 'face'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'employer') {
            const name = email.split('@')[0] || 'User';
            login('employer', name);
            navigate('/employer');
        } else {
            // Candidate: go to face verification step
            setStep('face');
        }
    };

    const handleFaceComplete = () => {
        const name = email.split('@')[0] || 'User';
        login('candidate', name);
        navigate('/dashboard');
    };

    const handleFaceBack = () => {
        setStep('form');
    };

    // Face verification step
    if (step === 'face') {
        return (
            <div className="login-page">
                <div className="login-card login-card-wide">
                    <div className="login-header">
                        <button className="back-to-form" onClick={handleFaceBack}>
                            <ArrowLeft size={18} />
                            <span>Back to Login</span>
                        </button>
                        <h1 className="welcome-title">Face Verification</h1>
                        <p>Capture your photo to verify your identity</p>
                    </div>
                    <FaceCapture onComplete={handleFaceComplete} onBack={handleFaceBack} />
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-card">
                {mode === 'employer' ? (
                    <div className="login-header">
                        <div className="login-icon employer-icon">
                            <Building2 size={28} />
                        </div>
                        <h1>Employer Login</h1>
                        <p>Sign in to manage your job postings</p>
                    </div>
                ) : (
                    <div className="login-header">
                        <h1 className="welcome-title">Welcome Back</h1>
                        <p>Sign in to access your SkillBridge account</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-field">
                        <label>
                            <Mail size={16} />
                            <span>Email or Phone Number</span>
                        </label>
                        <div className="login-input-wrap">
                            <input
                                type="text"
                                placeholder="Enter your email or phone"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="login-field">
                        <label>
                            <Lock size={16} />
                            <span>Password</span>
                        </label>
                        <div className="login-input-wrap">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-pw"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-submit">
                        {mode === 'candidate' ? 'Continue to Face Verification' : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    {mode === 'employer' ? (
                        <>
                            <p>
                                Don't have an account?{' '}
                                <Link to="/onboarding">Register as Employer</Link>
                            </p>
                            <p>
                                Looking for a job?{' '}
                                <button
                                    className="link-btn"
                                    onClick={() => setMode('candidate')}
                                >
                                    Candidate Login
                                </button>
                            </p>
                        </>
                    ) : (
                        <>
                            <p>
                                Don't have an account?{' '}
                                <Link to="/onboarding">Register here</Link>
                            </p>
                            <p>
                                Hiring talent?{' '}
                                <button
                                    className="link-btn"
                                    onClick={() => setMode('employer')}
                                >
                                    Employer Login
                                </button>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
