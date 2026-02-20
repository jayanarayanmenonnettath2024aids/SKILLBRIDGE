import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Onboarding.css';

const API_URL = 'http://localhost:5000/api';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Form states
  const [step, setStep] = useState(1); // 1: credentials, 2: face verification
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // User data after credential verification
  const [userData, setUserData] = useState(null);
  
  // Face capture states
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [faceVerifying, setFaceVerifying] = useState(false);
  const [matchPercentage, setMatchPercentage] = useState(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Handle credential login
  const handleCredentialLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token temporarily
      sessionStorage.setItem('tempToken', data.token);
      setUserData(data.user);
      
      // Move to face verification step
      setStep(2);
      setTimeout(() => startCamera(), 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Start camera for face capture
  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageDataUrl);

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // Verify face
  const handleFaceVerification = async () => {
    if (!capturedImage) return;

    setFaceVerifying(true);
    setError('');
    setMatchPercentage(null);
    setVerificationSuccess(false);

    try {
      const response = await fetch(`${API_URL}/auth/verify-face`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.id,
          capturedFaceImage: capturedImage
        }),
      });

      const data = await response.json();
      
      // Always show the match percentage
      if (data.confidence !== undefined) {
        setMatchPercentage(data.confidence);
      }

      if (!response.ok) {
        throw new Error(`${data.message}. Match: ${data.confidence}%`);
      }

      // Face verified successfully
      setVerificationSuccess(true);
      
      // Wait a moment to show success message before navigating
      setTimeout(() => {
        const token = sessionStorage.getItem('tempToken');
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.removeItem('tempToken');
        
        login(userData.role, userData);
        navigate(userData.role === 'employer' ? '/employer' : '/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message);
      setCapturedImage(null);
      setTimeout(() => {
        startCamera();
      }, 2000);
    } finally {
      setFaceVerifying(false);
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    setMatchPercentage(null);
    setVerificationSuccess(false);
    setError('');
    startCamera();
  };

  return (
    <div className="onboarding-container">
      <div className="login-wrapper">
        <Card className="login-card">
          {step === 1 ? (
            // Step 1: Credential Login
            <div className="login-step fade-in">
              <div className="step-header">
                <h2>Welcome Back</h2>
                <p>Sign in to access your SkillBridge account</p>
              </div>

              {error && (
                <div className="error-banner">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleCredentialLogin} className="login-form">
                <div className="form-group">
                  <label htmlFor="identifier">
                    <Mail size={18} />
                    Email or Phone Number
                  </label>
                  <input
                    id="identifier"
                    type="text"
                    placeholder="Enter your email or phone"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    <Lock size={18} />
                    Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="login-btn">
                  {loading ? 'Signing In...' : 'Continue to Face Verification'}
                </Button>
              </form>

              <div className="login-footer">
                <p>
                  Don't have an account?{' '}
                  <Link to="/onboarding" className="link">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            // Step 2: Face Verification
            <div className="login-step fade-in">
              <div className="step-header">
                <h2>Face Verification</h2>
                <p>Please verify your identity with face recognition</p>
              </div>

              {error && (
                <div className="error-banner">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              {verificationSuccess && matchPercentage && (
                <div className="success-banner">
                  <CheckCircle size={20} />
                  <span>Face Verified! Match: {matchPercentage}% - Redirecting...</span>
                </div>
              )}

              <div className="face-capture-container">
                {!capturedImage ? (
                  <div className="camera-section">
                    <div className="camera-frame">
                      {!cameraReady && !error && (
                        <div className="camera-loading">
                          <Camera size={48} />
                          <p>Initializing camera...</p>
                        </div>
                      )}

                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{ display: cameraReady ? 'block' : 'none' }}
                      />
                      
                      <div className="camera-guide">
                        <div className="guide-oval"></div>
                      </div>
                    </div>

                    <Button
                      onClick={capturePhoto}
                      disabled={!cameraReady}
                      className="capture-btn"
                    >
                      <Camera size={20} />
                      Capture Photo
                    </Button>
                  </div>
                ) : (
                  <div className="preview-section">
                    <div className="image-preview">
                      <img src={capturedImage} alt="Captured face" />
                      <div className="preview-success">
                        <CheckCircle size={32} color="#48bb78" />
                      </div>
                    </div>

                    {matchPercentage !== null && !verificationSuccess && (
                      <div className="match-percentage-display">
                        <div className="percentage-indicator">
                          <span className="percentage-value">{matchPercentage}%</span>
                          <span className="percentage-label">Match Rate</span>
                        </div>
                      </div>
                    )}

                    <div className="preview-actions">
                      <Button onClick={retakePhoto} variant="secondary" disabled={faceVerifying || verificationSuccess}>
                        Retake Photo
                      </Button>
                      <Button onClick={handleFaceVerification} disabled={faceVerifying || verificationSuccess}>
                        {faceVerifying ? 'Verifying...' : verificationSuccess ? 'Verified!' : 'Verify & Login'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <canvas ref={canvasRef} style={{ display: 'none' }} />

              <div className="step-footer">
                <Button onClick={() => setStep(1)} variant="secondary" disabled={faceVerifying}>
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Login;
