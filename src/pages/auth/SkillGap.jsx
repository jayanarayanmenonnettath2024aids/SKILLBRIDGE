import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { TrendingUp, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SkillGap = ({ data, onBack }) => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleFinish = () => {
        login('candidate');
        navigate('/dashboard');
    };

    return (
        <div className="onboarding-step-body fade-in">
            <div className="assessment-results-layout">
                {/* LEFT - Circular Progress */}
                <div className="visual-score-column">
                    <div className="circular-progress-large" style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        background: 'conic-gradient(#4F46E5 75%, #F1F5F9 0)'
                    }}>
                        <div style={{
                            width: '180px',
                            height: '180px',
                            background: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <span style={{ fontSize: '40px', fontWeight: '800', color: '#111827' }}>75%</span>
                            <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '600' }}>Overall Match</span>
                        </div>
                    </div>
                    <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '15px', color: '#374151' }}>
                        High match for <strong>{data.jobRoles?.[0] || 'Data Entry Operator'}</strong>
                    </p>
                </div>

                {/* RIGHT - Recommendations */}
                <div className="recommendations-column">
                    <Card className="onboarding-card-base" style={{ padding: '32px' }}>
                        <h3 className="card-heading-text" style={{ fontSize: '18px', marginBottom: '20px' }}>
                            Next steps for your career
                        </h3>
                        <div className="recommendation-list-premium">
                            <div className="recommendation-row-item">
                                <div className="rec-icon">
                                    <TrendingUp size={18} />
                                </div>
                                <div className="rec-content">
                                    <p style={{ margin: 0, fontWeight: '600' }}>Enhance Typing Speed</p>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>Practice to reach 35 words per minute for senior roles.</p>
                                </div>
                            </div>

                            <div className="recommendation-row-item">
                                <div className="rec-icon">
                                    <CheckCircle size={18} />
                                </div>
                                <div className="rec-content">
                                    <p style={{ margin: 0, fontWeight: '600' }}>Computer Basics Verified</p>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>Your fundamental technical skills are already verified.</p>
                                </div>
                            </div>

                            <div className="recommendation-row-item">
                                <div className="rec-icon">
                                    <TrendingUp size={18} />
                                </div>
                                <div className="rec-content">
                                    <p style={{ margin: 0, fontWeight: '600' }}>Complete Advanced Excel</p>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>Learning VLOOKUP will increase your match score to 90%.</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <footer className="onboarding-actions-row">
                <button onClick={onBack} className="onboarding-btn-text">
                    Back to Uploads
                </button>
                <div style={{ flex: 1 }}></div>
                <button
                    onClick={handleFinish}
                    className="onboarding-btn-primary"
                >
                    Continue to Dashboard
                </button>
            </footer>
        </div>
    );
};

export default SkillGap;
