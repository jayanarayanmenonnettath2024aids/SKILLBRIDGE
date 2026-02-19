import { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, RotateCcw, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import '../../styles/Onboarding.css';

function FaceCapture({ onComplete, onBack }) {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      // Cleanup: stop camera when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
    <div className="onboarding-step">
      <div className="step-header">
        <h2>Face Verification</h2>
        <p>Capture your photo for identity verification</p>
      </div>

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
              
              {error && (
                <div className="camera-error">
                  <AlertCircle size={48} color="#e53e3e" />
                  <p>{error}</p>
                  <Button onClick={startCamera} variant="secondary">
                    Retry
                  </Button>
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

            <div className="capture-instructions">
              <h4>Instructions:</h4>
              <ul>
                <li>Position your face within the oval guide</li>
                <li>Ensure good lighting</li>
                <li>Remove glasses if possible</li>
                <li>Look directly at the camera</li>
              </ul>
            </div>

            <Button
              onClick={capturePhoto}
              disabled={!cameraReady || error}
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

            <div className="preview-actions">
              <Button onClick={retakePhoto} variant="secondary">
                <RotateCcw size={20} />
                Retake Photo
              </Button>
              <Button onClick={handleContinue}>
                Continue
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for capturing image */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="step-footer">
        <Button onClick={onBack} variant="secondary">
          Back
        </Button>
      </div>
    </div>
  );
}

export default FaceCapture;
