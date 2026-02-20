import React from 'react';
import { ShieldCheck } from 'lucide-react';

const CredentialCard = ({ title, issuer, isVerified }) => {
    return (
        <div className="credential-row-item">
            <div className="cred-info-stack">
                <div className="cred-icon-box">
                    <ShieldCheck size={18} />
                </div>
                <div className="cred-text">
                    <p>{title}</p>
                    <span>{issuer}</span>
                </div>
            </div>
            {isVerified && <span className="verified-pill-small">Verified</span>}
        </div>
    );
};

export default CredentialCard;
