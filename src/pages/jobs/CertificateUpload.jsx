import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import '../../styles/CertificateUpload.css';

const CertificateUpload = () => {
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState([]);
    const [resume, setResume] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [resumeDragActive, setResumeDragActive] = useState(false);
    const [errors, setErrors] = useState([]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleResumeDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setResumeDragActive(true);
        } else if (e.type === "dragleave") {
            setResumeDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleResumeDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setResumeDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleResumeFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleResumeInput = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleResumeFile(e.target.files[0]);
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
            type: file.type,
            uploaded: false
        });
        setErrors([]);
    };

    const handleFiles = (files) => {
        const newErrors = [];
        const validFiles = [];
        
        Array.from(files).forEach((file) => {
            // Validate file type
            const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                newErrors.push(`${file.name}: Invalid file type. Only PDF, JPG, and PNG files are allowed.`);
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                newErrors.push(`${file.name}: File size exceeds 5MB limit.`);
                return;
            }
            
            validFiles.push({
                id: Date.now() + Math.random(),
                file: file,
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type,
                uploaded: false
            });
        });
        
        setErrors(newErrors);
        setCertificates([...certificates, ...validFiles]);
    };

    const removeCertificate = (id) => {
        setCertificates(certificates.filter(cert => cert.id !== id));
    };

    const removeResume = () => {
        setResume(null);
    };

    const handleUpload = () => {
        if (!resume) {
            setErrors(['Please upload your resume before proceeding.']);
            return;
        }
        
        // Mark all as uploaded
        const updatedCertificates = certificates.map(cert => ({
            ...cert,
            uploaded: true
        }));
        setCertificates(updatedCertificates);
        
        const updatedResume = { ...resume, uploaded: true };
        setResume(updatedResume);
        
        // Store in localStorage
        localStorage.setItem('uploadedCertificates', JSON.stringify(updatedCertificates));
        localStorage.setItem('uploadedResume', JSON.stringify(updatedResume));
        
        // Navigate to job listings after a brief delay
        setTimeout(() => {
            navigate('/jobs');
        }, 1000);
    };

    const handleSkip = () => {
        if (!resume) {
            setErrors(['Please upload your resume before proceeding. You can skip certificates.']);
            return;
        }
        
        // Store resume in localStorage
        localStorage.setItem('uploadedResume', JSON.stringify({ ...resume, uploaded: true }));
        navigate('/jobs');
    };

    return (
        <div className="certificate-upload-page">
            <div className="container certificate-container">
                <div className="upload-header">
                    <h1 className="upload-title">Upload Your Documents</h1>
                    <p className="upload-subtitle">
                        Upload your resume and certificates to enhance your job profile
                    </p>
                </div>

                {/* Resume Upload Section */}
                <Card className="upload-card">
                    <h2 className="section-heading">Resume / CV (Required)</h2>
                    <div 
                        className={`upload-zone ${resumeDragActive ? 'drag-active' : ''}`}
                        onDragEnter={handleResumeDrag}
                        onDragLeave={handleResumeDrag}
                        onDragOver={handleResumeDrag}
                        onDrop={handleResumeDrop}
                    >
                        <Upload size={48} className="upload-icon" />
                        <h3 className="upload-zone-title">Drag and drop your resume here</h3>
                        <p className="upload-zone-text">or</p>
                        <label htmlFor="resume-upload" className="file-upload-label">
                            <Button variant="outline">Browse Files</Button>
                        </label>
                        <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleResumeInput}
                            style={{ display: 'none' }}
                        />
                        <p className="upload-hint">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
                    </div>

                    {resume && (
                        <div className="certificates-list">
                            <h3 className="list-title">Uploaded Resume</h3>
                            <div className="certificate-item">
                                <div className="certificate-info">
                                    <FileText size={24} className="file-icon" />
                                    <div className="file-details">
                                        <p className="file-name">{resume.name}</p>
                                        <p className="file-size">{resume.size}</p>
                                    </div>
                                </div>
                                <div className="certificate-actions">
                                    {resume.uploaded && (
                                        <CheckCircle size={20} className="success-icon" />
                                    )}
                                    <button 
                                        onClick={removeResume}
                                        className="remove-button"
                                        aria-label="Remove resume"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Certificates Upload Section */}
                <Card className="upload-card">
                    <h2 className="section-heading">Certificates (Optional)</h2>
                    <div 
                        className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <Upload size={48} className="upload-icon" />
                        <h3 className="upload-zone-title">Drag and drop your certificates here</h3>
                        <p className="upload-zone-text">or</p>
                        <label htmlFor="file-upload" className="file-upload-label">
                            <Button variant="outline">Browse Files</Button>
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileInput}
                            style={{ display: 'none' }}
                        />
                        <p className="upload-hint">Supported formats: PDF, JPG, PNG (Max 5MB per file)</p>
                    </div>

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

                    {certificates.length > 0 && (
                        <div className="certificates-list">
                            <h3 className="list-title">Uploaded Certificates ({certificates.length})</h3>
                            {certificates.map((cert) => (
                                <div key={cert.id} className="certificate-item">
                                    <div className="certificate-info">
                                        <FileText size={24} className="file-icon" />
                                        <div className="file-details">
                                            <p className="file-name">{cert.name}</p>
                                            <p className="file-size">{cert.size}</p>
                                        </div>
                                    </div>
                                    <div className="certificate-actions">
                                        {cert.uploaded && (
                                            <CheckCircle size={20} className="success-icon" />
                                        )}
                                        <button 
                                            onClick={() => removeCertificate(cert.id)}
                                            className="remove-button"
                                            aria-label="Remove certificate"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="upload-actions">
                        <Button 
                            variant="outline" 
                            onClick={handleSkip}
                        >
                            Continue without Certificates
                        </Button>
                        <Button 
                            onClick={handleUpload}
                            disabled={!resume}
                        >
                            Upload All & Continue
                        </Button>
                    </div>
                </Card>

                <div className="upload-benefits">
                    <h3 className="benefits-title">Why upload your documents?</h3>
                    <div className="benefits-grid">
                        <div className="benefit-item">
                            <CheckCircle size={24} className="benefit-icon" />
                            <div>
                                <h4>Better Job Matches</h4>
                                <p>Your resume and certificates help match you with relevant opportunities</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <CheckCircle size={24} className="benefit-icon" />
                            <div>
                                <h4>Build Trust</h4>
                                <p>Employers prefer candidates with complete profiles and verified credentials</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <CheckCircle size={24} className="benefit-icon" />
                            <div>
                                <h4>Stand Out</h4>
                                <p>Showcase your qualifications and experience to increase visibility</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateUpload;
