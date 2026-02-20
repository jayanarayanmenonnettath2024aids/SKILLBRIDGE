import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, CheckCircle, RotateCcw, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import '../../styles/Onboarding.css';

function FaceCapture({ onComplete, onBack }) {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    let mounted = true;

    const initCamera = async () => {
      if (!mounted) return;
      await startCamera();
    };

    initCamera();

    return () => {
      mounted = false;
      // Cleanup: stop camera when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to data URL
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageDataUrl);

    // Stop the camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleContinue = () => {
    if (capturedImage) {
      // Pass the captured image data to parent
      onComplete({ faceImage: capturedImage });
    }
  };

  return (
    <div className="onboarding-step-body fade-in">
      <div className="face-verification-grid">
        {/* LEFT - Camera Section */}
        <div className="camera-display-column">
          {!capturedImage ? (
            <div className="camera-preview-container">
              {!cameraReady && !error && (
                <div className="camera-loading">
                  <Camera size={48} />
                  <p>Initializing camera...</p>
                </div>
              )}

              {error && (
                <div className="camera-error">
                  <AlertCircle size={48} color="#e53e3e" />
                  <p>{error}</p>
                  <button
                    onClick={startCamera}
                    className="onboarding-btn-text"
                    style={{ color: '#EF4444' }}
                  >
                    Try Again
                  </button>
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ display: cameraReady && !error ? 'block' : 'none' }}
              />

              <div className="camera-guide">
                <div className="guide-oval"></div>
              </div>
            </div>
          ) : (
            <div className="camera-preview-container">
              <img
                src={capturedImage}
                alt="Captured face"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="success-badge-overlay">
                <CheckCircle size={14} />
                Verification Photo Ready
              </div>
            </div>
          )}
        </div>

        {/* RIGHT - Instructions & Status */}
        <aside className="instruction-sidebar-column">
          <Card className="onboarding-card-base" style={{ padding: '28px', borderRadius: '20px' }}>
            <h3 className="card-heading-text" style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Photo Requirements</h3>
            <div className="instruction-item-row">
              <CheckCircle size={18} />
              <span>Position your face within the oval guide</span>
            </div>
            <div className="instruction-item-row">
              <CheckCircle size={18} />
              <span>Ensure your environment reached good lighting</span>
            </div>
            <div className="instruction-item-row">
              <CheckCircle size={18} />
              <span>Look directly at the camera with a neutral expression</span>
            </div>
            <div className="instruction-item-row">
              <CheckCircle size={18} />
              <span>Avoid wearing glasses or headgear if possible</span>
            </div>
          </Card>

          {!capturedImage ? (
            <button
              onClick={capturePhoto}
              disabled={!cameraReady || error}
              className="onboarding-btn-primary"
              style={{ width: '100%', marginTop: '24px' }}
            >
              <Camera size={18} />
              Capture Verification Photo
            </button>
          ) : (
            <button
              onClick={retakePhoto}
              className="onboarding-btn-text"
              style={{ width: '100%', marginTop: '24px', justifyContent: 'center', display: 'flex', gap: '8px' }}
            >
              <RotateCcw size={18} />
              Retake Photo
            </button>
          )}
        </aside>
      </div>

      {/* Hidden canvas for capturing image */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <footer className="onboarding-actions-row">
        <button onClick={onBack} className="onboarding-btn-text">
          Back
        </button>
        <div style={{ flex: 1 }}></div>
        <button
          onClick={handleContinue}
          disabled={!capturedImage}
          className="onboarding-btn-primary"
        >
          Continue
        </button>
      </footer>
    </div>
  );
};

export default FaceCapture;
