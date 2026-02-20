import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import CredentialCard from '../../components/dashboard/CredentialCard';
import { QrCode, Share2, History, ChevronRight } from 'lucide-react';
import '../../styles/Wallet.css';

const Wallet = () => {
    const [showQr, setShowQr] = useState(false);

    const credentials = [
        { title: '12th Standard Pass', issuer: 'CBSE Board', date: 'May 2023', hash: '0x7f83...3a2b', verified: true },
        { title: 'Data Entry Basics', issuer: 'Skill India', date: 'Aug 2023', hash: '0x9c41...1d4e', verified: true },
        { title: 'English Communication', issuer: 'British Council', date: 'Jan 2024', hash: '0xa2b1...9f8e', verified: true },
    ];

    const history = [
        { action: 'Shared with TechServe', date: 'Today, 10:30 AM', status: 'Success' },
        { action: 'Credential Added: English Comm.', date: 'Jan 15, 2024', status: 'Verified' },
        { action: 'Profile Verified by Aadhaar', date: 'Jan 10, 2024', status: 'Verified' },
    ];

    return (
        <div className="container wallet-page">
            <div className="wallet-header mb-8">
                <h1 className="text-2xl font-bold mb-2">My Credential Wallet</h1>
                <p className="text-secondary">Manage and share your verified achievements.</p>
            </div>

            <div className="wallet-grid">
                {/* Left Column: Credentials */}
                <div className="wallet-credentials">
                    <h3 className="text-lg font-bold mb-4">Digital Credentials</h3>
                    <div className="flex flex-col gap-4">
                        {credentials.map((cred, index) => (
                            <CredentialCard key={index} {...cred} isVerified={cred.verified} />
                        ))}
                    </div>
                </div>

                {/* Right Column: Actions & History */}
                <div className="wallet-actions">
                    {/* Share Card */}
                    <Card className="share-card mb-6 text-center">
                        <div className="qr-box mb-4 mx-auto">
                            {showQr ? (
                                <div className="qr-code">
                                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SkillBridge-Verified-User-12345" alt="QR Code" />
                                </div>
                            ) : (
                                <div className="qr-placeholder" onClick={() => setShowQr(true)}>
                                    <QrCode size={48} className="text-primary" />
                                    <span className="text-sm font-medium mt-2">Tap to Reveal Code</span>
                                </div>
                            )}
                        </div>
                        <h3 className="text-xl font-bold mb-2">Share Profile</h3>
                        <p className="text-sm text-secondary mb-4">Allow employers to scan and verify your credentials instantly.</p>
                        <div className="flex gap-2 justify-center">
                            <Button onClick={() => setShowQr(!showQr)}>{showQr ? 'Hide Code' : 'Show QR Code'}</Button>
                            <Button variant="outline"><Share2 size={18} /></Button>
                        </div>
                    </Card>

                    {/* History Card */}
                    <Card className="history-card">
                        <div className="flex items-center gap-2 mb-4">
                            <History size={18} className="text-primary" />
                            <h3 className="font-bold">Wallet History</h3>
                        </div>
                        <div className="history-list">
                            {history.map((item, index) => (
                                <div key={index} className="history-item">
                                    <div className="history-dot"></div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{item.action}</p>
                                        <p className="text-xs text-secondary">{item.date}</p>
                                    </div>
                                    <span className="text-xs font-semibold text-success">{item.status}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full text-center text-sm text-primary mt-4 font-medium flex items-center justify-center">
                            View Full History <ChevronRight size={14} />
                        </button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
