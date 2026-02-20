import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ShieldCheck, Phone } from 'lucide-react';
import '../../styles/Onboarding.css';

const IdentityVerification = ({ onNext, onBack }) => {
    const [aadhaar, setAadhaar] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('aadhaar'); // 'aadhaar' | 'otp'

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (aadhaar.length === 12) {
            setStep('otp');
            // Mock API call
            console.log('Sending OTP to', aadhaar);
        }
    };

    const handleVerify = (e) => {
        e.preventDefault();
        if (otp.length === 6) {
            // Mock Verify
            onNext({ aadhaar, verified: true });
        }
    };

    return (
        <div className="onboarding-step-body fade-in">
            <Card className="onboarding-card-base aadhaar-centered-card">
                <div className="aadhaar-icon-circle">
                    <ShieldCheck size={36} />
                </div>

                {step === 'aadhaar' ? (
                    <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="form-group">
                            <label className="input-label-premium" htmlFor="aadhaar">Aadhaar Number</label>
                            <input
                                type="text"
                                id="aadhaar"
                                placeholder="0000 0000 0000"
                                value={aadhaar}
                                onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                className="input-field-premium"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={aadhaar.length !== 12}
                            className="onboarding-btn-primary"
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            Send Verification OTP
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="form-group">
                            <label className="input-label-premium" htmlFor="otp">Enter Verification Code</label>
                            <input
                                type="text"
                                id="otp"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="input-field-premium"
                                required
                            />
                            <p className="text-secondary" style={{ fontSize: '13px', marginTop: '8px' }}>
                                A 6-digit code has been sent to your registered mobile number.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                type="submit"
                                disabled={otp.length !== 6}
                                className="onboarding-btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                Verify & Continue
                            </button>
                            <button
                                type="button"
                                className="onboarding-btn-text"
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={() => setStep('aadhaar')}
                            >
                                Use a different Aadhaar number
                            </button>
                        </div>
                    </form>
                )}

                <div className="security-assurance-note" style={{ marginTop: '32px', borderTop: '1px solid #F1F5F9', paddingTop: '24px', justifyContent: 'center' }}>
                    <ShieldCheck size={16} />
                    <span>Your data is encrypted and processed securely.</span>
                </div>
            </Card>

            <footer className="onboarding-actions-row">
                <button onClick={onBack} className="onboarding-btn-text">
                    Back
                </button>
            </footer>
        </div>
    );
};

export default IdentityVerification;
