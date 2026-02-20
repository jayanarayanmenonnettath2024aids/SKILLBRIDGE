import React from 'react';
import IdentityVerification from './IdentityVerification';
import '../../styles/Onboarding.css';

const Onboarding = () => {
    return (
        <div className="onboarding-container">
            <div className="step-content">
                <IdentityVerification />
            </div>
        </div>
    );
};

export default Onboarding;
