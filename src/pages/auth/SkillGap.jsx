import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const SkillGap = ({ data, onBack }) => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFinish = async () => {
        setLoading(true);
        setError('');

        try {
            // Convert File objects to base64 for resume and certificates
            const processedData = { ...data };
            
            // Handle resume - convert File to base64 or set to null
            if (data.resume && data.resume.file instanceof File) {
                processedData.resume = await fileToBase64(data.resume.file);
            } else if (data.resume && typeof data.resume === 'object') {
                // If resume is an object without file, set to null
                processedData.resume = null;
            }
            
            // Handle certificates - convert array of Files to array of base64 strings
            if (data.certificates && Array.isArray(data.certificates)) {
                processedData.certificates = await Promise.all(
                    data.certificates.map(async (cert) => {
                        if (cert.file instanceof File) {
                            return {
                                name: cert.name,
                                data: await fileToBase64(cert.file),
                                uploadedAt: new Date().toISOString()
                            };
                        }
                        return null;
                    })
                );
                // Filter out null values
                processedData.certificates = processedData.certificates.filter(c => c !== null);
            }

            // Submit registration data to backend
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(processedData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Registration failed');
            }

            // Store authentication token
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            // Login user with user data
            login(result.user.role, result.user);
            
            // Navigate to dashboard
            navigate(result.user.role === 'employer' ? '/employer' : '/dashboard');
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Helper function to convert File to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    return (
        <div className="onboarding-step fade-in">
            <div className="step-header">
                <div className="icon-bg bg-indigo-100 text-primary">
                    <TrendingUp size={32} />
                </div>
                <h2>Your Career Potential</h2>
                <p>Based on your profile, here is where you stand and what you can achieve.</p>
            </div>

            {error && (
                <div className="error-banner">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <Card className="onboarding-card">
                <div className="gap-analysis">
                    <div className="gap-chart">
                        {/* Simple visual representation of skill match */}
                        <div className="chart-circle">
                            <span className="score">75%</span>
                            <span className="label">Match</span>
                        </div>
                        <p className="chart-caption">Match for <strong>Data Entry Operator</strong></p>
                    </div>

                    <div className="recommendations">
                        <h4>Recommended to Reach 100%:</h4>
                        <ul className="gap-list">
                            <li>
                                <div className="gap-icon bad">!</div>
                                <span>Typing Speed (Needs 30wpm)</span>
                            </li>
                            <li>
                                <div className="gap-icon good"><CheckCircle size={14} /></div>
                                <span>Computer Basics (Verified)</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="actions-row">
                    <Button variant="outline" onClick={onBack} disabled={loading}>
                        Back
                    </Button>
                    <Button onClick={handleFinish} className="w-full" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Complete Registration'}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default SkillGap;
