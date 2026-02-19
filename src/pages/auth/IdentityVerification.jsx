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
        <div className="onboarding-step fade-in">
            <div className="step-header">
                <div className="icon-bg bg-emerald-100 text-success">
                    <ShieldCheck size={32} />
                </div>
                <h2>Verify Your Identity</h2>
                <p>We link your profile to your Aadhaar for verified credentials.</p>
            </div>

            <Card className="onboarding-card">
                {step === 'aadhaar' ? (
                    <form onSubmit={handleSendOtp}>
                        <div className="form-group">
                            <label htmlFor="aadhaar">Aadhaar Number</label>
                            <input
                                type="text"
                                id="aadhaar"
                                placeholder="0000 0000 0000"
                                value={aadhaar}
                                onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                className="input-field"
                                required
                            />
                        </div>
                        <div className="form-button-group">
                            <Button
                                type="submit"
                                disabled={aadhaar.length !== 12}
                            >
                                Send OTP
                            </Button>
                            {onBack && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onBack}
                                >
                                    Back
                                </Button>
                            )}
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVerify}>
                        <div className="form-group">
                            <label htmlFor="otp">Enter OTP</label>
                            <input
                                type="text"
                                id="otp"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="input-field"
                                required
                            />
                            <p className="text-sm text-secondary mt-1">OTP sent to linked mobile number</p>
                        </div>
                        <div className="form-button-group">
                            <Button
                                type="submit"
                                disabled={otp.length !== 6}
                            >
                                Verify & Continue
                            </Button>
                            <button
                                type="button"
                                className="link-button"
                                onClick={() => setStep('aadhaar')}
                            >
                                Change Aadhaar Number
                            </button>
                        </div>
                        {onBack && (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full mt-3"
                                onClick={onBack}
                            >
                                Back
                            </Button>
                        )}
                    </form>
                )}
            </Card>

            <div className="trust-note">
                <Phone size={16} />
                <span>Your data is encrypted and secure.</span>
            </div>
        </div>
    );
};

export default IdentityVerification;
