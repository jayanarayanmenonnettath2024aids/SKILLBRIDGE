import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { uploadResumeAPI, analyzeResumeAPI } from '../../services/api';
import { updateResumeCache } from '../../services/resumeService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/ResumeUpload.css';

const ResumeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resumeURL, setResumeURL] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  const validateFile = (file) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return false;
    }

    return true;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (validateFile(file)) {
      setSelectedFile(file);
      setError('');
      setUploadSuccess(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setError('');
        setUploadSuccess(false);
      }
    }
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

    console.log('Starting upload...', { fileName: selectedFile.name, userId: user.id });
    setUploading(true);
    setError('');

    try {
      const uploadResult = await uploadResumeAPI(selectedFile, user.id);
      console.log('Upload result:', uploadResult);

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
        // Cache the resume data for quick access across the app
        updateResumeCache(user.id, {
          resumeURL: uploadResult.resumeURL,
          analysis: analysisResult.analysis,
          geminiAnalysis: analysisResult.analysis
        });
        
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
      console.error('Upload error caught:', err);

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
    <div className="resume-upload-container">
      <div className="upload-content">
        <div className="upload-header">
          <div className="icon-bg bg-primary-light">
            <Upload size={32} />
          </div>
          <h1>{t('uploadResumeTitle')}</h1>
          <p>{t('uploadResumeSubtitle')}</p>
        </div>

        <Card className="upload-card">
          <div 
            className={`upload-area ${selectedFile ? 'has-file' : ''} ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
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
                  <h3>{t('browseFiles')}</h3>
                  <p>{t('dragDropResume')}</p>
                  <span className="file-requirements">{t('fileRequirements')}</span>
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

          {error && (
            <div className="status-message error-message">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {uploadSuccess && !analyzing && (
            <div className="status-message success-message">
              <CheckCircle size={20} />
              <span>{t('uploadSuccess')}</span>
            </div>
          )}

          {analyzing && (
            <div className="status-message analyzing-message">
              <Loader size={20} className="spin" />
              <span>{t('analyzing')}</span>
            </div>
          )}

          <div className="upload-actions">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading || analyzing || uploadSuccess}
              className="upload-btn"
            >
              {uploading ? (
                <><Loader size={18} className="spin" /> {t('uploading')}</>
              ) : analyzing ? (
                <><Loader size={18} className="spin" /> {t('analyzing')}</>
              ) : uploadSuccess ? (
                <><CheckCircle size={18} /> {t('uploaded')}</>
              ) : (
                <><Upload size={18} /> {t('uploadAndAnalyze')}</>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={uploading || analyzing}
            >
              {t('skipForNow')}
            </Button>
          </div>

          <div className="upload-info">
            <h4>{t('whatHappensNext')}</h4>
            <ul>
              <li>
                <CheckCircle size={16} />
                {t('securelyStored')}
              </li>
              <li>
                <CheckCircle size={16} />
                {t('aiAnalyzes')}
              </li>
              <li>
                <CheckCircle size={16} />
                {t('personalizedRecommendations')}
              </li>
            </ul>
          </div>
        </Card>

        <div className="privacy-notice">
          <span>🔒 Your data is encrypted and securely stored</span>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
