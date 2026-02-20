import React, { useState } from 'react';
import BasicInfo from './BasicInfo';
import FaceCapture from './FaceCapture';
import IdentityVerification from './IdentityVerification';
import SkillProfile from './SkillProfile';
import DocumentUpload from './DocumentUpload';
import SkillGap from './SkillGap';
import { Progress } from '../../components/ui/Progress';
import '../../styles/Onboarding.css';

const Onboarding = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const steps = [
        { number: 1, label: 'Basic Info' },
        { number: 2, label: 'Face Capture' },
        { number: 3, label: 'Verification' },
        { number: 4, label: 'Skills' },
        { number: 5, label: 'Documents' },
        { number: 6, label: 'Assessment' }
    ];

    const progressValue = (currentStep / steps.length) * 100;

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

    return (
        <div className="onboarding-page-wrapper">
            {/* 1. Top Progress Nav */}
            <nav className="onboarding-progress-nav">
                <div className="slim-progress-track">
                    <div
                        className="slim-progress-fill"
                        style={{ width: `${progressValue}%` }}
                    />
                </div>
                <div className="progress-meta-info">
                    <span className="step-counter-text">Step {currentStep} of {steps.length}</span>
                    <span className="current-step-name">{steps[currentStep - 1].label}</span>
                </div>
            </nav>

            <main className="onboarding-main-container">
                {/* 2. Hero Title Section */}
                <header className="onboarding-hero-header">
                    <h1>{getStepTitle(currentStep)}</h1>
                    <p>{getStepDescription(currentStep)}</p>
                </header>

                <div className="step-content fade-in">
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
            </main>
        </div>
    );
};

// Helper functions for titles and descriptions
const getStepTitle = (step) => {
    const titles = {
        1: "Let's start with the basics",
        2: "Face Identification",
        3: "Government verification",
        4: "Build your skill profile",
        5: "Upload your credentials",
        6: "Onboarding complete"
    };
    return titles[step] || "";
};

const getStepDescription = (step) => {
    const descriptions = {
        1: "Please provide your personal details to help us set up your professional profile.",
        2: "We use AI-powered face verification to ensure the security of your account.",
        3: "Securely verify your Aadhaar to access premium job opportunities.",
        4: "Select your skills and preferred job roles to get personalized recommendations.",
        5: "Upload your resume and certificates to verify your expertise to employers.",
        6: "Here's your initial assessment results. You're ready to start your journey!"
    };
    return descriptions[step] || "";
};

export default Onboarding;
