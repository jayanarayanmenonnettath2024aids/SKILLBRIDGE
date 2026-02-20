import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { uploadResumeAPI, analyzeResumeAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../../styles/ResumeUpload.css';

const ResumeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resumeURL, setResumeURL] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFileSelect = (e) => {
    const file = e.type === 'drop' ? e.dataTransfer.files[0] : e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError('');
    setUploadSuccess(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    if (!user || !user.id) {
      setError('User not authenticated. Please login first.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadResult = await uploadResumeAPI(selectedFile, user.id);

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      setResumeURL(uploadResult.resumeURL);
      setUploadSuccess(true);
      setUploading(false);

      setAnalyzing(true);

      const analysisResult = await analyzeResumeAPI({
        userId: user.id,
        resumeURL: uploadResult.resumeURL
      });

      setAnalyzing(false);

      if (analysisResult.success) {
        if (analysisResult.warning) {
          setError(analysisResult.warning);
          setTimeout(() => { navigate('/profile-setup'); }, 3000);
        } else {
          setTimeout(() => { navigate('/profile-setup'); }, 1500);
        }
      } else {
        setError('Resume uploaded but analysis failed. You can continue to profile setup.');
        setTimeout(() => { navigate('/profile-setup'); }, 3000);
      }

    } catch (err) {
      setUploading(false);
      setAnalyzing(false);

      const errorMsg = err.error || err.message || 'Failed to upload resume. Please try again.';
      if (errorMsg.includes('quota') || errorMsg.includes('exceeded')) {
        setError('AI analysis failed: All API keys have exceeded their quota. Please try again later.');
      } else {
        setError(errorMsg);
      }
    }
  };

  const handleSkip = () => {
    navigate('/profile-setup');
  };

  return (
    <div className="resume-upload-page">
      {/* Clean Top Nav */}
      <nav className="upload-top-nav">
        <div className="nav-logo">SkillBridge AI</div>
        <div className="nav-actions">
          <Button variant="ghost" onClick={handleSkip} size="sm">Cancel</Button>
        </div>
      </nav>

      <div className="resume-upload-container">
        {/* Hero Section */}
        <header className="upload-hero">
          <div className="upload-icon-circle">
            <Upload size={28} />
          </div>
          <h1 className="hero-title">Upload Your Resume</h1>
          <p className="hero-subtitle">
            Upload your resume in PDF format for AI-powered skill analysis and personalized recommendations.
          </p>
        </header>

        {/* Main Upload Card */}
        <Card className="main-upload-card">
          <div
            className={`dropzone-area ${selectedFile ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDrop={(e) => {
              e.preventDefault();
              handleFileSelect(e);
            }}
          >
            <input
              type="file"
              id="resume-upload"
              accept=".pdf"
              onChange={handleFileSelect}
              disabled={uploading || analyzing}
              hidden
            />

            <label htmlFor="resume-upload" className="dropzone-label">
              {!selectedFile ? (
                <>
                  <FileText size={32} className="dropzone-icon" />
                  <div className="dropzone-main-text">Choose PDF file</div>
                  <div className="dropzone-sub-text">or drag and drop here</div>
                  <div className="dropzone-hint">Max file size: 5MB</div>
                </>
              ) : (
                <>
                  <FileText size={32} className="dropzone-icon success" />
                  <div className="dropzone-main-text">{selectedFile.name}</div>
                  <div className="dropzone-sub-text">{(selectedFile.size / 1024).toFixed(2)} KB</div>
                  {!uploadSuccess && (
                    <button
                      className="change-file-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedFile(null);
                      }}
                      disabled={uploading || analyzing}
                    >
                      Change File
                    </button>
                  )}
                </>
              )}
            </label>
          </div>

          {error && (
            <div className="status-toast error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {uploadSuccess && !analyzing && (
            <div className="status-toast success">
              <CheckCircle size={18} />
              <span>Resume uploaded successfully!</span>
            </div>
          )}

          {analyzing && (
            <div className="status-toast info">
              <Loader size={18} className="animate-spin" />
              <span>Analyzing your resume with AI...</span>
            </div>
          )}

          {/* Action Row */}
          <div className="upload-action-row">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading || analyzing || uploadSuccess}
              className="button-primary"
              style={{ width: '100%', maxWidth: '300px' }}
            >
              {uploading ? (
                <><Loader size={18} className="animate-spin" /> Uploading...</>
              ) : analyzing ? (
                <><Loader size={18} className="animate-spin" /> Analyzing...</>
              ) : uploadSuccess ? (
                <><CheckCircle size={18} /> Uploaded</>
              ) : (
                'Upload & Analyze'
              )}
            </button>

            <button className="button-secondary" onClick={handleSkip} style={{ height: '48px', padding: '0 32px' }}>
              Skip for Now
            </button>
          </div>

          {/* Divider & What Happens Next */}
          <div className="upload-next-steps">
            <h4 className="next-steps-title">What happens next?</h4>
            <div className="next-steps-list">
              <div className="step-row">
                <CheckCircle size={16} className="step-icon" />
                <span>Your resume is securely stored in Firebase Storage</span>
              </div>
              <div className="step-row">
                <CheckCircle size={16} className="step-icon" />
                <span>AI analyzes your skills, experience, and education</span>
              </div>
              <div className="step-row">
                <CheckCircle size={16} className="step-icon" />
                <span>Get personalized job recommendations and skill gap analysis</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Footer Note */}
        <footer className="security-footer">
          <CheckCircle size={14} className="lock-icon" />
          <span>Your data is encrypted and securely stored</span>
        </footer>
      </div>
    </div>
  );
};

export default ResumeUpload;
