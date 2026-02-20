import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Upload, FileText, X, CheckCircle, AlertCircle, File } from 'lucide-react';

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
        <div className="onboarding-step fade-in">
            <div className="step-header">
                <div className="icon-bg bg-blue-100 text-primary">
                    <FileText size={32} />
                </div>
                <h2>Upload Documents</h2>
                <p>Upload your resume and certificates to strengthen your profile.</p>
            </div>

            <Card className="onboarding-card">
                <form onSubmit={handleSubmit}>
                    {/* Error Messages */}
                    {errors.length > 0 && (
                        <div className="error-messages">
                            {errors.map((error, index) => (
                                <div key={index} className="error-message">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Resume Upload */}
                    <div className="form-group">
                        <label>Resume/CV <span className="required">*</span></label>
                        <p className="field-hint">Upload your resume in PDF, DOC, or DOCX format (Max 5MB)</p>
                        
                        {!resume ? (
                            <div
                                className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                                onDragEnter={handleResumeDrag}
                                onDragLeave={handleResumeDrag}
                                onDragOver={handleResumeDrag}
                                onDrop={handleResumeDrop}
                            >
                                <Upload size={48} className="upload-icon" />
                                <p className="upload-text">Drag and drop your resume here</p>
                                <p className="upload-subtext">or</p>
                                <label className="upload-button">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleResumeInput}
                                        style={{ display: 'none' }}
                                    />
                                    <Button type="button" variant="outline">Browse Files</Button>
                                </label>
                            </div>
                        ) : (
                            <div className="uploaded-file">
                                <div className="file-icon">
                                    <FileText size={24} />
                                </div>
                                <div className="file-info">
                                    <p className="file-name">{resume.name}</p>
                                    <p className="file-size">{resume.size}</p>
                                </div>
                                <button
                                    type="button"
                                    className="remove-file"
                                    onClick={removeResume}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Certificates Upload */}
                    <div className="form-group">
                        <label>Certificates (Optional)</label>
                        <p className="field-hint">Upload educational or skill certificates (PDF, JPG, or PNG, Max 5MB each)</p>
                        
                        <div
                            className={`upload-zone small ${certDragActive ? 'drag-active' : ''}`}
                            onDragEnter={handleCertDrag}
                            onDragLeave={handleCertDrag}
                            onDragOver={handleCertDrag}
                            onDrop={handleCertDrop}
                        >
                            <Upload size={32} className="upload-icon" />
                            <p className="upload-text small">Drag and drop certificates</p>
                            <label className="upload-button">
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    multiple
                                    onChange={handleCertificateInput}
                                    style={{ display: 'none' }}
                                />
                                <Button type="button" variant="outline" size="sm">Browse Files</Button>
                            </label>
                        </div>

                        {/* Uploaded Certificates List */}
                        {certificates.length > 0 && (
                            <div className="uploaded-files-list">
                                {certificates.map(cert => (
                                    <div key={cert.id} className="uploaded-file small">
                                        <div className="file-icon small">
                                            <File size={20} />
                                        </div>
                                        <div className="file-info">
                                            <p className="file-name">{cert.name}</p>
                                            <p className="file-size">{cert.size}</p>
                                        </div>
                                        <button
                                            type="button"
                                            className="remove-file"
                                            onClick={() => removeCertificate(cert.id)}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="actions-row">
                        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
                        <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                            <Button type="button" variant="secondary" onClick={handleSkip} style={{ flex: 1 }}>
                                Skip for Now
                            </Button>
                            <Button type="submit" style={{ flex: 1 }}>
                                Next
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default DocumentUpload;
