import React, { useState } from 'react';
import BasicInfo from './BasicInfo';
import FaceCapture from './FaceCapture';
import IdentityVerification from './IdentityVerification';
import SkillProfile from './SkillProfile';
import DocumentUpload from './DocumentUpload';
import SkillGap from './SkillGap';
import '../../styles/Onboarding.css';

const Onboarding = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [userData, setUserData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        dateOfBirth: '',
        gender: '',
        state: '',
        district: '',
        faceImage: null,
        aadhaar: null,
        verified: false,
        education: null,
        skills: [],
        jobRoles: [],
        resume: null,
        certificates: []
    });

    const handleNext = (data) => {
        setUserData({ ...userData, ...data });
        setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    const steps = [
        { number: 1, label: 'Basic Info' },
        { number: 2, label: 'Face Capture' },
        { number: 3, label: 'Verification' },
        { number: 4, label: 'Skills' },
        { number: 5, label: 'Documents' },
        { number: 6, label: 'Assessment' }
    ];

    return (
        <div className="onboarding-container">
            <div className="progress-bar-wrapper">
                <div className="progress-bar">
                    {steps.map((step) => (
                        <div 
                            key={step.number}
                            className="progress-step-container"
                        >
                            <div className={`progress-step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="step-content">
                {currentStep === 1 && (
                    <BasicInfo onNext={handleNext} />
                )}
                {currentStep === 2 && (
                    <FaceCapture onComplete={handleNext} onBack={handleBack} />
                )}
                {currentStep === 3 && (
                    <IdentityVerification onNext={handleNext} onBack={handleBack} />
                )}
                {currentStep === 4 && (
                    <SkillProfile onNext={handleNext} onBack={handleBack} />
                )}
                {currentStep === 5 && (
                    <DocumentUpload onNext={handleNext} onBack={handleBack} />
                )}
                {currentStep === 6 && (
                    <SkillGap data={userData} onBack={handleBack} />
                )}
            </div>
        </div>
    );
};

export default Onboarding;
