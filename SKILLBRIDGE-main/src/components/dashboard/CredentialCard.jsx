import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { ShieldCheck, Calendar, ExternalLink } from 'lucide-react';

const CredentialCard = ({ title, issuer, date, hash, isVerified }) => {
    return (
        <Card className="credential-card">
            <div className="credential-header">
                <div className="credential-icon bg-emerald-100 text-success">
                    <ShieldCheck size={24} />
                </div>
                <div className="credential-info">
                    <h4>{title}</h4>
                    <p className="text-sm text-secondary">{issuer}</p>
                </div>
                {isVerified && <Badge variant="success">Verified</Badge>}
            </div>
            <div className="credential-details">
                <div className="detail-row">
                    <Calendar size={14} className="text-light" />
                    <span className="text-sm text-secondary">Issued: {date}</span>
                </div>
                <div className="detail-row" title={hash}>
                    <span className="text-xs text-light font-mono">ID: {hash.substring(0, 16)}...</span>
                </div>
            </div>
            <button className="btn-link">View Certificate <ExternalLink size={12} /></button>
        </Card>
    );
};

export default CredentialCard;
