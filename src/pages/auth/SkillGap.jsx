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
        <div className="onboarding-step fade-in">
            <div className="step-header">
                <div className="icon-bg bg-indigo-100 text-primary">
                    <TrendingUp size={32} />
                </div>
                <h2>Your Career Potential</h2>
                <p>Based on your profile, here is where you stand and what you can achieve.</p>
            </div>

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
                    <Button variant="outline" onClick={onBack}>Back</Button>
                    <Button onClick={handleFinish} className="w-full">
                        Go to Dashboard
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default SkillGap;
