import React, { useState } from 'react';
import IdentityVerification from './IdentityVerification';
import SkillProfile from './SkillProfile';
import SkillGap from './SkillGap';
import '../../styles/Onboarding.css';

const Onboarding = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [userData, setUserData] = useState({
        aadhaar: null,
        verified: false,
        education: null,
        skills: []
    });

    const handleNext = (data) => {
        setUserData({ ...userData, ...data });
        setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    return (
        <div className="onboarding-container">
            <div className="progress-bar">
                <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
                <div className="progress-line"></div>
                <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
                <div className="progress-line"></div>
                <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
            </div>

            <div className="step-content">
                {currentStep === 1 && (
                    <IdentityVerification onNext={handleNext} />
                )}
                {currentStep === 2 && (
                    <SkillProfile onNext={handleNext} onBack={handleBack} />
                )}
                {currentStep === 3 && (
                    <SkillGap data={userData} onBack={handleBack} />
                )}
            </div>
        </div>
    );
};

export default Onboarding;
