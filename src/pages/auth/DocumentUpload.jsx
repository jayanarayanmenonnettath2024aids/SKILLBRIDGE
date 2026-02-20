import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Upload, FileText, X, CheckCircle, AlertCircle, File, Plus } from 'lucide-react';

const DocumentUpload = ({ onNext, onBack }) => {
    const [resume, setResume] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [certDragActive, setCertDragActive] = useState(false);
    const [errors, setErrors] = useState([]);

    const handleResumeDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleCertDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setCertDragActive(true);
        } else if (e.type === "dragleave") {
            setCertDragActive(false);
        }
    };

    const handleResumeDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleResumeFile(e.dataTransfer.files[0]);
        }
    };

    const handleCertDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCertDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleCertificateFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleResumeInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleResumeFile(e.target.files[0]);
        }
    };

    const handleCertificateInput = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleCertificateFiles(Array.from(e.target.files));
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(2) + ' KB';
        } else {
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        }
    };

    const handleResumeFile = (file) => {
        // Validate file type
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
            setErrors(['Invalid file type. Only PDF, DOC, and DOCX files are allowed for resume.']);
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(['Resume file size exceeds 5MB limit.']);
            return;
        }

        setResume({
            id: Date.now(),
            file: file,
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type
        });
        setErrors([]);
    };

    const handleCertificateFiles = (files) => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        const newCerts = [];
        const newErrors = [];

        files.forEach(file => {
            if (!validTypes.includes(file.type)) {
                newErrors.push(`${file.name}: Invalid file type. Only PDF, JPG, and PNG are allowed.`);
                return;
            }

            if (file.size > maxSize) {
                newErrors.push(`${file.name}: File size exceeds 5MB limit.`);
                return;
            }

            newCerts.push({
                id: Date.now() + Math.random(),
                file: file,
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type
            });
        });

        if (newErrors.length > 0) {
            setErrors(newErrors);
        } else {
            setErrors([]);
        }

        setCertificates([...certificates, ...newCerts]);
    };

    const removeResume = () => {
        setResume(null);
    };

    const removeCertificate = (id) => {
        setCertificates(certificates.filter(cert => cert.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!resume) {
            setErrors(['Please upload your resume to continue.']);
            return;
        }
        onNext({ resume, certificates });
    };

    const handleSkip = () => {
        onNext({ resume: null, certificates: [] });
    };

    return (
        <div className="onboarding-step-body fade-in">
            {/* Error Messages */}
            {errors.length > 0 && (
                <div className="error-messages" style={{ marginBottom: '32px' }}>
                    {errors.map((error, index) => (
                        <div key={index} className="error-message">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="upload-grid-split">
                {/* LEFT - Resume Upload */}
                <div className="resume-column">
                    <label className="input-label-premium" style={{ marginBottom: '16px', display: 'block' }}>
                        Professional Resume <span className="required">*</span>
                    </label>

                    {!resume ? (
                        <div
                            className={`drop-zone-premium ${dragActive ? 'drag-active' : ''}`}
                            onDragEnter={handleResumeDrag}
                            onDragLeave={handleResumeDrag}
                            onDragOver={handleResumeDrag}
                            onDrop={handleResumeDrop}
                        >
                            <input
                                type="file"
                                id="resume-input"
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeInput}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="resume-input" style={{ cursor: 'pointer', textAlign: 'center' }}>
                                <div className="upload-icon-wrapper">
                                    <Upload size={40} />
                                </div>
                                <p className="primary-upload-text">Upload your resume</p>
                                <p className="secondary-upload-text">PDF, DOC up to 5MB</p>
                            </label>
                        </div>
                    ) : (
                        <div className="uploaded-file onboarding-card-base" style={{ padding: '20px' }}>
                            <div className="file-icon" style={{ background: '#EEF2FF' }}>
                                <FileText size={24} color="#4F46E5" />
                            </div>
                            <div className="file-info">
                                <p className="file-name">{resume.name}</p>
                                <p className="file-size">{resume.size}</p>
                            </div>
                            <button
                                type="button"
                                className="onboarding-btn-text"
                                onClick={removeResume}
                                style={{ color: '#EF4444' }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {/* RIGHT - Certificates Upload */}
                <div className="certificates-column">
                    <label className="input-label-premium" style={{ marginBottom: '16px', display: 'block' }}>
                        Additional Certificates
                    </label>

                    <div
                        className={`drop-zone-premium ${certDragActive ? 'drag-active' : ''}`}
                        onDragEnter={handleCertDrag}
                        onDragLeave={handleCertDrag}
                        onDragOver={handleCertDrag}
                        onDrop={handleCertDrop}
                    >
                        <input
                            type="file"
                            id="cert-input"
                            accept=".pdf,.jpg,.jpeg,.png"
                            multiple
                            onChange={handleCertificateInput}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="cert-input" style={{ cursor: 'pointer', textAlign: 'center' }}>
                            <div className="upload-icon-wrapper">
                                <Plus size={40} />
                            </div>
                            <p className="primary-upload-text">Add certificates</p>
                            <p className="secondary-upload-text">PDF, PNG, JPG accepted</p>
                        </label>
                    </div>

                    {/* Uploaded Certificates List */}
                    {certificates.length > 0 && (
                        <div className="uploaded-files-list" style={{ marginTop: '24px' }}>
                            {certificates.map(cert => (
                                <div key={cert.id} className="uploaded-file onboarding-card-base" style={{ padding: '12px 16px', fontSize: '13px' }}>
                                    <div className="file-icon" style={{ width: '32px', height: '32px' }}>
                                        <File size={16} />
                                    </div>
                                    <div className="file-info">
                                        <p className="file-name">{cert.name}</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="onboarding-btn-text"
                                        onClick={() => removeCertificate(cert.id)}
                                        style={{ color: '#EF4444' }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <footer className="onboarding-actions-row">
                <button onClick={onBack} className="onboarding-btn-text">
                    Back
                </button>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        type="button"
                        className="onboarding-btn-text"
                        onClick={handleSkip}
                    >
                        Skip for now
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!resume}
                        className="onboarding-btn-primary"
                    >
                        Finish Setup
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default DocumentUpload;
