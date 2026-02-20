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
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
    setError('');
    setUploadSuccess(false);
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
      // Step 1: Upload to backend (which uploads to Firebase Storage)
      const uploadResult = await uploadResumeAPI(selectedFile, user.id);
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      setResumeURL(uploadResult.resumeURL);
      setUploadSuccess(true);
      setUploading(false);
      
      // Step 2: Trigger Gemini analysis
      setAnalyzing(true);
      
      const analysisResult = await analyzeResumeAPI({
        userId: user.id,
        resumeURL: uploadResult.resumeURL
      });

      setAnalyzing(false);

      if (analysisResult.success) {
        // Check if there's a warning (fallback analysis)
        if (analysisResult.warning) {
          setError(analysisResult.warning);
          // Still navigate after showing warning
          setTimeout(() => {
            navigate('/profile-setup');
          }, 3000);
        } else {
          // Navigate to interest selection after successful upload and analysis
          setTimeout(() => {
            navigate('/profile-setup');
          }, 1500);
        }
      } else {
        setError('Resume uploaded but analysis failed. You can continue to profile setup.');
        setTimeout(() => {
          navigate('/profile-setup');
        }, 3000);
      }

    } catch (err) {
      setUploading(false);
      setAnalyzing(false);
      
      // Check if it's a quota error
      const errorMsg = err.error || err.message || 'Failed to upload resume. Please try again.';
      if (errorMsg.includes('quota') || errorMsg.includes('exceeded')) {
        setError('AI analysis failed: All API keys have exceeded their quota. Please try again later or upgrade your plan.');
      } else {
        setError(errorMsg);
      }
      
      console.error('Upload error:', err);
    }
  };

  const handleSkip = () => {
    navigate('/profile-setup');
  };

  return (
    <div className="resume-upload-container">
      <div className="upload-content">
        <div className="upload-header">
          <div className="icon-bg bg-primary-light">
            <Upload size={32} />
          </div>
          <h1>Upload Your Resume</h1>
          <p>Upload your resume in PDF format for AI-powered skill analysis</p>
        </div>

        <Card className="upload-card">
          {/* Upload Area */}
          <div className={`upload-area ${selectedFile ? 'has-file' : ''}`}>
            <input
              type="file"
              id="resume-upload"
              accept=".pdf"
              onChange={handleFileSelect}
              disabled={uploading || analyzing}
              hidden
            />
            
            <label htmlFor="resume-upload" className="upload-label">
              {!selectedFile ? (
                <>
                  <FileText size={48} className="upload-icon" />
                  <h3>Choose PDF File</h3>
                  <p>or drag and drop here</p>
                  <span className="file-requirements">Max file size: 5MB</span>
                </>
              ) : (
                <>
                  <FileText size={48} className="upload-icon text-success" />
                  <h3>{selectedFile.name}</h3>
                  <p>{(selectedFile.size / 1024).toFixed(2)} KB</p>
                  {!uploadSuccess && (
                    <Button
                      variant="text"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedFile(null);
                      }}
                      disabled={uploading || analyzing}
                    >
                      Change File
                    </Button>
                  )}
                </>
              )}
            </label>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="status-message error-message">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {uploadSuccess && !analyzing && (
            <div className="status-message success-message">
              <CheckCircle size={20} />
              <span>Resume uploaded successfully!</span>
            </div>
          )}

          {analyzing && (
            <div className="status-message analyzing-message">
              <Loader size={20} className="spin" />
              <span>Analyzing your resume with AI...</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="upload-actions">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading || analyzing || uploadSuccess}
              className="upload-btn"
            >
              {uploading ? (
                <>
                  <Loader size={18} className="spin" />
                  Uploading...
                </>
              ) : analyzing ? (
                <>
                  <Loader size={18} className="spin" />
                  Analyzing...
                </>
              ) : uploadSuccess ? (
                <>
                  <CheckCircle size={18} />
                  Uploaded
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload & Analyze
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={uploading || analyzing}
            >
              Skip for Now
            </Button>
          </div>

          {/* Info Section */}
          <div className="upload-info">
            <h4>What happens next?</h4>
            <ul>
              <li>
                <CheckCircle size={16} />
                Your resume is securely stored in Firebase Storage
              </li>
              <li>
                <CheckCircle size={16} />
                AI analyzes your skills, experience, and education
              </li>
              <li>
                <CheckCircle size={16} />
                Get personalized job recommendations and skill gap analysis
              </li>
            </ul>
          </div>
        </Card>

        {/* Privacy Notice */}
        <div className="privacy-notice">
          <span>🔒 Your data is encrypted and securely stored</span>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
