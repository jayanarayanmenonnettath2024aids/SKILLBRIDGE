import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    MessageCircle, Send, Mic, MicOff, Video, VideoOff,
    Clock, CheckCircle, AlertCircle, ArrowRight, Volume2,
    Pause, Play, RotateCcw, ShieldAlert
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import useProctoring from '../../hooks/useProctoring';
import ProctorWarning from '../../components/interview/ProctorWarning';
import '../../styles/InterviewBot.css';

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

const InterviewBot = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const chatEndRef = useRef(null);
    const textareaRef = useRef(null);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const streamRef = useRef(null);

    // Job details from navigation state
    const jobDetails = location.state || {
        title: 'Data Entry Operator',
        company: 'TechServe Solutions',
        matchScore: 92
    };

    // Interview state
    const [sessionId, setSessionId] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [chatMessages, setChatMessages] = useState([]);
    const [userResponse, setUserResponse] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [interviewCompleted, setInterviewCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isBotSpeaking, setIsBotSpeaking] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [isRecordingVideo, setIsRecordingVideo] = useState(false);
    const [cameraLoading, setCameraLoading] = useState(false);
    const [videoPlaying, setVideoPlaying] = useState(false);
    const [microphoneActive, setMicrophoneActive] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [totalQuestions] = useState(7); // Default, will update based on interview

    const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
    const [showPlayback, setShowPlayback] = useState(false);

    // Proctoring: terminate interview on max violations
    const handleProctoringTerminate = useCallback(() => {
        console.log('[PROCTOR] Interview terminated due to violations');
        completeInterviewWithFlag(true);
    }, []);

    // Proctoring hook
    const {
        violations: _proctorViolations,
        warningCount: proctorWarningCount,
        currentWarning: proctorCurrentWarning,
        showFinalWarning: proctorShowFinalWarning,
        isTerminated: proctorIsTerminated,
        dismissWarning: proctorDismissWarning,
        dismissFinalWarning: proctorDismissFinalWarning,
        maxWarnings: proctorMaxWarnings,
        detectionStatus: proctorDetectionStatus,
        detectedObjects: proctorDetectedObjects
    } = useProctoring({
        streamRef,
        videoRef,
        isActive: interviewStarted && !interviewCompleted,
        onTerminate: handleProctoringTerminate
    });

    // API Functions
    const startInterviewSession = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/interview/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    candidate_name: 'Candidate', // You can add a name input field
                    job_title: jobDetails.title,
                    company: jobDetails.company
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to start interview');
            }

            return data;
        } catch (error) {
            console.error('Error starting interview:', error);
            setApiError('Failed to connect to interview server. Using offline mode.');
            return null;
        }
    };

    const getNextQuestion = async (sessionId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/interview/${sessionId}/question`);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to get question');
            }

            return data.question;
        } catch (error) {
            console.error('Error getting question:', error);
            throw error;
        }
    };

    const submitAnswer = async (sessionId, questionData, answer) => {
        try {
            const response = await fetch(`${API_BASE_URL}/interview/${sessionId}/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question_data: questionData,
                    answer: answer
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to submit answer');
            }

            return data.evaluation;
        } catch (error) {
            console.error('Error submitting answer:', error);
            throw error;
        }
    };

    const getFinalReport = async (sessionId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/interview/${sessionId}/report`);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to get report');
            }

            return data.report;
        } catch (error) {
            console.error('Error getting report:', error);
            return null;
        }
    };

    const uploadVideo = async (sessionId, videoBlob) => {
        try {
            const formData = new FormData();
            formData.append('video', videoBlob, 'interview-recording.webm');

            const response = await fetch(`${API_BASE_URL}/interview/${sessionId}/video`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            console.log('Video upload result:', data);
            return data.success;
        } catch (error) {
            console.error('Error uploading video:', error);
            return false;
        }
    };

    // Camera and Recording Functions
    const startCamera = async () => {
        try {
            setCameraError(null);
            setCameraLoading(true);
            setShowPlayback(false);

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                },
                audio: true
            });

            streamRef.current = stream;

            const audioTracks = stream.getAudioTracks();
            if (audioTracks.length > 0 && audioTracks[0].enabled) {
                setMicrophoneActive(true);
            }

            // Attach stream to video element
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                try {
                    await videoRef.current.play();
                    setVideoPlaying(true);
                } catch (playErr) {
                    console.log('Auto-play blocked, user interaction needed:', playErr.message);
                }
            }

            setIsVideoOn(true);
            setCameraLoading(false);

            // Start recording automatically
            startRecording(stream);

        } catch (error) {
            console.error('Error accessing camera:', error);
            setCameraLoading(false);
            if (error.name === 'NotAllowedError') {
                setCameraError('Camera access denied. Please allow camera permissions in your browser.');
            } else if (error.name === 'NotFoundError') {
                setCameraError('No camera found on your device.');
            } else {
                setCameraError(`Unable to access camera: ${error.message}`);
            }
            setIsVideoOn(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        stopRecording();
        setIsVideoOn(false);
        setVideoPlaying(false);
        setMicrophoneActive(false);
        setCameraError(null);
    };

    const startRecording = (stream) => {
        try {
            recordedChunksRef.current = [];

            const options = {
                mimeType: 'video/webm;codecs=vp8,opus',
                videoBitsPerSecond: 2500000
            };

            // Check if the mimeType is supported
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options.mimeType = 'video/webm';
            }

            const mediaRecorder = new MediaRecorder(stream, options);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, {
                    type: 'video/webm'
                });

                console.log('Recording stopped. Video size:', blob.size, 'bytes');

                // Create URL for playback
                const videoUrl = URL.createObjectURL(blob);
                setRecordedVideoUrl(videoUrl);

                // Upload video to backend if session exists
                if (sessionId && blob.size > 0) {
                    uploadVideo(sessionId, blob)
                        .then(success => {
                            if (success) {
                                console.log('✓ Video uploaded successfully');
                            } else {
                                console.log('✗ Video upload failed');
                            }
                        });
                }

                recordedChunksRef.current = [];
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start(1000); // Collect data every second
            setIsRecordingVideo(true);

        } catch (error) {
            console.error('Error starting recording:', error);
            setCameraError('Unable to start recording.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecordingVideo(false);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    // Ensure video plays when video is turned on
    useEffect(() => {
        if (isVideoOn && videoRef.current && videoRef.current.srcObject) {
            videoRef.current.play().catch(error => {
                console.error('Error auto-playing video:', error);
            });
        }
    }, [isVideoOn]);

    // Timer effect
    useEffect(() => {
        if (interviewStarted && !interviewCompleted && timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        handleInterviewTimeout();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [interviewStarted, interviewCompleted, timeRemaining]);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // Format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartInterview = async () => {
        setInterviewStarted(true);
        setIsLoading(true);

        // Auto-start camera and microphone when interview begins
        setTimeout(() => {
            startCamera();
        }, 500);

        // Start interview session with backend
        const sessionData = await startInterviewSession();

        if (sessionData) {
            setSessionId(sessionData.session_id);
            const welcomeMessage = {
                type: 'bot',
                text: sessionData.message || `Welcome to your interview for ${jobDetails.title} at ${jobDetails.company}! Please answer thoughtfully. Let's begin!`,
                timestamp: new Date()
            };
            setChatMessages([welcomeMessage]);

            // Get first question after a delay
            setTimeout(async () => {
                try {
                    const question = await getNextQuestion(sessionData.session_id);
                    setCurrentQuestion(question);
                    setCurrentQuestionIndex(0);

                    const questionMessage = {
                        type: 'bot',
                        text: question.question,
                        timestamp: new Date(),
                        questionNumber: question.question_number
                    };
                    setChatMessages(prev => [...prev, questionMessage]);
                    setIsLoading(false);
                } catch {
                    setApiError('Failed to load question');
                    setIsLoading(false);
                }
            }, 2000);
        } else {
            // Fallback to local mode if API fails
            const welcomeMessage = {
                type: 'bot',
                text: `⚠️ API connection failed. Running in offline mode. Welcome to your interview for ${jobDetails.title} at ${jobDetails.company}!`,
                timestamp: new Date()
            };
            setChatMessages([welcomeMessage]);
            setIsLoading(false);
        }
    };

    const handleSubmitResponse = async () => {
        if (!userResponse.trim()) return;
        if (!sessionId || !currentQuestion) {
            alert('No active interview session');
            return;
        }

        setIsLoading(true);

        // Add user response to chat
        const responseMessage = {
            type: 'user',
            text: userResponse,
            timestamp: new Date()
        };
        setChatMessages(prev => [...prev, responseMessage]);
        const userAnswer = userResponse;
        setUserResponse('');

        try {
            // Submit answer and get evaluation
            const evaluation = await submitAnswer(sessionId, currentQuestion, userAnswer);

            // Show evaluation feedback
            const feedbackMessage = {
                type: 'bot',
                text: `📊 Score: ${evaluation.score}/10\n\n${evaluation.interviewer_assessment || evaluation.feedback}`,
                timestamp: new Date(),
                isEvaluation: true
            };
            setChatMessages(prev => [...prev, feedbackMessage]);

            setIsLoading(false);

            // Get next question after showing feedback
            setTimeout(async () => {
                try {
                    setIsBotSpeaking(true);
                    const nextQuestion = await getNextQuestion(sessionId);
                    setCurrentQuestion(nextQuestion);
                    setCurrentQuestionIndex(prev => prev + 1);

                    const questionMessage = {
                        type: 'bot',
                        text: nextQuestion.question,
                        timestamp: new Date(),
                        questionNumber: nextQuestion.question_number
                    };
                    setChatMessages(prev => [...prev, questionMessage]);
                    setIsBotSpeaking(false);
                } catch {
                    // No more questions or error - complete interview
                    completeInterview();
                }
            }, 2000);

        } catch (error) {
            console.error('Error submitting answer:', error);
            setIsLoading(false);
            setChatMessages(prev => [...prev, {
                type: 'bot',
                text: '⚠️ Error processing your answer. Please try again.',
                timestamp: new Date()
            }]);
        }
    };

    const completeInterviewWithFlag = async (disqualified = false) => {
        setInterviewCompleted(true);
        stopCamera();

        if (disqualified) {
            const disqualifiedMessage = {
                type: 'bot',
                text: '🚫 Your interview has been terminated due to multiple proctoring violations. This incident has been recorded.',
                timestamp: new Date()
            };
            setChatMessages(prev => [...prev, disqualifiedMessage]);
            return;
        }

        if (sessionId) {
            const report = await getFinalReport(sessionId);
            let completionText = "Thank you for completing the interview! Your responses have been recorded and evaluated. ";
            if (report) {
                completionText += `\n\n📊 Final Score: ${report.overall_score}/10\n`;
                completionText += `✅ Interview Summary: ${report.summary || 'Analysis complete'}`;
            } else {
                completionText += "You'll hear back from us within 2-3 business days.";
            }
            setChatMessages(prev => [...prev, { type: 'bot', text: completionText, timestamp: new Date() }]);
        } else {
            setChatMessages(prev => [...prev, { type: 'bot', text: "Thank you for completing the interview! Your responses have been recorded.", timestamp: new Date() }]);
        }
    };

    const completeInterview = async () => completeInterviewWithFlag(false);

    const handleInterviewTimeout = () => {
        setInterviewCompleted(true);
        stopCamera(); // Stop camera and recording on timeout
        const timeoutMessage = {
            type: 'bot',
            text: "Time's up! The interview has ended. We've recorded all your responses so far. Thank you for your time!",
            timestamp: new Date()
        };
        setChatMessages(prev => [...prev, timeoutMessage]);
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
    };

    const toggleVideo = () => {
        if (isVideoOn) {
            stopCamera();
        } else {
            startCamera();
        }
    };

    // Toggle between Playback and Live View
    const handleTogglePlayback = () => {
        if (showPlayback) {
            setShowPlayback(false);
            // Resume live camera
            startCamera();
        } else {
            setShowPlayback(true);
            // Stop live camera to play video
            stopCamera();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmitResponse();
        }
    };

    const handleReturnToDashboard = () => {
        navigate('/dashboard');
    };

    if (!interviewStarted) {
        return (
            <div className="interview-intro-page">
                <div className="interview-intro-container">
                    {/* 1. Hero Header Section */}
                    <header className="intro-hero-section">
                        <div className="avatar-icon-circle">
                            <MessageCircle size={36} />
                        </div>
                        <h1 className="intro-title-primary">AI Interview</h1>
                        <div className="intro-job-badge-row">
                            <span className="job-title-highlight">{jobDetails.title}</span>
                            <span className="badge-separator">•</span>
                            <div className="match-score-badge">
                                {jobDetails.matchScore}% Match
                            </div>
                        </div>
                    </header>

                    {/* 2. Main Content Grid (2-Column) */}
                    <div className="intro-content-grid">
                        {/* LEFT - Interview Details */}
                        <Card className="details-main-card">
                            <h2 className="card-heading-text">Before You Begin</h2>
                            <div className="info-row-list">
                                <div className="info-row-item">
                                    <CheckCircle size={18} />
                                    <span>{totalQuestions} questions to answer</span>
                                </div>
                                <div className="info-row-item">
                                    <Clock size={18} />
                                    <span>Approximately 30 minutes</span>
                                </div>
                                <div className="info-row-item">
                                    <Video size={18} />
                                    <span>Video/Audio recording optional</span>
                                </div>
                                <div className="info-row-item">
                                    <AlertCircle size={18} />
                                    <span>Answer thoughtfully and honestly</span>
                                </div>
                                <div className="info-row-item">
                                    <ShieldAlert size={18} />
                                    <span>AI proctoring enabled</span>
                                </div>
                            </div>
                        </Card>

                        {/* RIGHT - Preparation & AI Info */}
                        <div className="intro-sidebar-stack">
                            <div className="quick-tips-amber-card">
                                <h3 className="tips-card-title">Quick Tips</h3>
                                <ul className="tips-list-bulleted">
                                    <li>Find a quiet place with good lighting</li>
                                    <li>Check your internet connection</li>
                                    <li>Keep answers concise (2-3 minutes)</li>
                                    <li>Use the STAR method for behavioral answers</li>
                                </ul>
                            </div>

                            <div className="ai-info-green-card">
                                <h3 className="ai-card-title">AI-Powered Interview</h3>
                                <p className="ai-card-desc">
                                    This interview uses adaptive AI to generate questions and provide real-time assessment of your responses.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Camera Notice Bar */}
                    <div className="camera-notice-info-bar">
                        <Video size={18} />
                        <span>Your camera and microphone will be requested when you begin the interview process.</span>
                    </div>

                    {/* 4. Action Section */}
                    <footer className="intro-actions-footer">
                        <button className="cancel-text-btn" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                        <Button className="start-interview-gradient-btn" onClick={handleStartInterview}>
                            Start Interview
                            <ArrowRight size={18} />
                        </Button>
                    </footer>
                </div>
            </div>
        );
    }

    return (
        <div className="interview-container">
            {/* Proctoring Warnings */}
            <ProctorWarning
                currentWarning={proctorCurrentWarning}
                warningCount={proctorWarningCount}
                maxWarnings={proctorMaxWarnings}
                showFinalWarning={proctorShowFinalWarning}
                isTerminated={proctorIsTerminated}
                onDismissWarning={proctorDismissWarning}
                onDismissFinalWarning={proctorDismissFinalWarning}
                onReturnToDashboard={handleReturnToDashboard}
                detectionStatus={proctorDetectionStatus}
                detectedObjects={proctorDetectedObjects}
            />
            {/* Header */}
            <div className="interview-header">
                <div className="interview-header-left">
                    <div className="job-info">
                        <h2>{jobDetails.title}</h2>
                        <p>{jobDetails.company}</p>
                    </div>
                </div>
                <div className="interview-header-right">
                    <div className="progress-info">
                        <span className="progress-text">
                            Question {currentQuestion?.question_number || (currentQuestionIndex + 1)}
                        </span>
                        <div className="progress-bar-mini">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${currentQuestion ? ((currentQuestion.question_number / 10) * 100) : 10}%` }}
                            />
                        </div>
                    </div>
                    <div className="time-remaining">
                        <Clock size={18} />
                        <span className={timeRemaining < 300 ? 'time-warning' : ''}>
                            {formatTime(timeRemaining)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="interview-content">
                {/* API Error Message */}
                {apiError && (
                    <div className="api-error-message">
                        <AlertCircle size={20} />
                        <span>{apiError}</span>
                    </div>
                )}

                {/* Camera Error Message */}
                {cameraError && (
                    <div className="camera-error-message">
                        <AlertCircle size={20} />
                        <span>{cameraError}</span>
                    </div>
                )}

                {/* Video Preview / Playback */}
                <div className="video-preview">
                    {showPlayback && recordedVideoUrl ? (
                        // Playback Mdoe
                        <div className="video-playback-container" style={{ width: '100%', height: '100%' }}>
                            <video
                                src={recordedVideoUrl}
                                controls
                                autoPlay
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    backgroundColor: '#000'
                                }}
                            />
                            <div className="playback-controls" style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                zIndex: 100
                            }}>
                                <Button size="sm" onClick={handleTogglePlayback}>
                                    <Video size={16} style={{ marginRight: '6px' }} />
                                    Return to Live Camera
                                </Button>
                            </div>
                        </div>
                    ) : (
                        // Live Camera Mode
                        (isVideoOn || cameraLoading) && (
                            <>
                                {cameraLoading ? (
                                    <div className="camera-loading">
                                        <Video size={48} />
                                        <p>Starting camera...</p>
                                    </div>
                                ) : (
                                    <>
                                        <video
                                            ref={(el) => {
                                                videoRef.current = el;
                                                // Immediately attach stream when element mounts
                                                if (el && streamRef.current && !el.srcObject) {
                                                    el.srcObject = streamRef.current;
                                                    el.play().catch(err => console.log('Auto-play attempt:', err.message));
                                                }
                                            }}
                                            autoPlay
                                            playsInline
                                            muted
                                            className="video-feed"
                                            onPlay={() => {
                                                console.log('VIDEO IS PLAYING');
                                                setVideoPlaying(true);
                                            }}
                                            onLoadedMetadata={(e) => {
                                                console.log('Video dimensions:', e.target.videoWidth, 'x', e.target.videoHeight);
                                                e.target.play().catch(() => { });
                                            }}
                                        />
                                        {!videoPlaying && (
                                            <div
                                                className="video-play-overlay"
                                                onClick={() => {
                                                    if (videoRef.current) {
                                                        videoRef.current.play()
                                                            .then(() => setVideoPlaying(true))
                                                            .catch(err => console.error('Manual play failed:', err));
                                                    }
                                                }}
                                            >
                                                <Play size={64} />
                                                <p>Click to start video</p>
                                            </div>
                                        )}
                                        {isRecordingVideo && (
                                            <div className="recording-indicator">
                                                <div className="recording-dot"></div>
                                                <span>Recording</span>
                                            </div>
                                        )}
                                        {microphoneActive && (
                                            <div className="microphone-indicator">
                                                <Mic size={18} />
                                                <span>Microphone Active</span>
                                            </div>
                                        )}

                                        {/* Playback Button (only show if we have a recording) */}
                                        {recordedVideoUrl && !isRecordingVideo && (
                                            <div className="playback-overlay-btn" style={{
                                                position: 'absolute',
                                                bottom: '20px',
                                                right: '20px',
                                                zIndex: 10
                                            }}>
                                                <Button size="sm" variant="secondary" onClick={handleTogglePlayback}>
                                                    <Play size={16} style={{ marginRight: '6px' }} />
                                                    Review Recording
                                                </Button>
                                            </div>
                                        )}

                                        {/* Camera Help Hint */}
                                        <div className="camera-help-hint" style={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            left: '10px',
                                            fontSize: '10px',
                                            color: 'rgba(255,255,255,0.5)',
                                            zIndex: 5
                                        }}>
                                            {videoPlaying ? "Camera active. If black, check cover." : "Waiting for video..."}
                                        </div>

                                        {/* Debug info overlay */}
                                        {/* eslint-disable-next-line no-undef */}
                                        {process.env.NODE_ENV === 'development' && (
                                            <div className="video-debug-info">
                                                <p>Video Playing: {videoPlaying ? 'Yes' : 'No'}</p>
                                                <p>Stream Active: {streamRef.current?.active ? 'Yes' : 'No'}</p>
                                                <p>Video Tracks: {streamRef.current?.getVideoTracks().length || 0}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )
                    )}
                </div>

                {/* Chat Area */}
                <div className="chat-container">
                    <div className="chat-messages">
                        {chatMessages.map((message, index) => (
                            <div
                                key={index}
                                className={`chat-message ${message.type}`}
                            >
                                <div className="message-avatar">
                                    {message.type === 'bot' ? (
                                        <MessageCircle size={24} />
                                    ) : (
                                        <div className="user-avatar">You</div>
                                    )}
                                </div>
                                <div className="message-content">
                                    {message.questionNumber && (
                                        <span className="question-number">
                                            Question {message.questionNumber}
                                        </span>
                                    )}
                                    <p className="message-text">{message.text}</p>
                                    <span className="message-time">
                                        {message.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="chat-message bot">
                                <div className="message-avatar">
                                    <MessageCircle size={24} />
                                </div>
                                <div className="message-content">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    {!interviewCompleted && (
                        <div className="chat-input-area">
                            <div className="input-controls">
                                <button
                                    className={`control-btn ${isRecording ? 'active' : ''}`}
                                    onClick={toggleRecording}
                                    title={isRecording ? "Audio Recording On" : "Toggle Audio Recording"}
                                    disabled={isVideoOn}
                                >
                                    {isRecording ? <Mic size={20} /> : <MicOff size={20} />}
                                </button>
                                <button
                                    className={`control-btn ${isVideoOn ? 'active' : ''}`}
                                    onClick={toggleVideo}
                                    title={isVideoOn ? "Stop Camera & Recording" : "Start Camera & Recording"}
                                >
                                    {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
                                </button>
                            </div>

                            <div className="input-wrapper">
                                <textarea
                                    ref={textareaRef}
                                    className="response-input"
                                    placeholder="Type your answer here... (Press Enter to send, Shift+Enter for new line)"
                                    value={userResponse}
                                    onChange={(e) => setUserResponse(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={isLoading || isBotSpeaking}
                                    rows={3}
                                />
                                <button
                                    className="send-btn"
                                    onClick={handleSubmitResponse}
                                    disabled={!userResponse.trim() || isLoading || isBotSpeaking}
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Completion Actions */}
                    {interviewCompleted && (
                        <div className="completion-actions">
                            <div className="completion-message">
                                <CheckCircle size={48} className="success-icon" />
                                <h3>Interview Completed!</h3>
                                <p>Your responses have been saved successfully.</p>
                            </div>
                            <Button onClick={handleReturnToDashboard}>
                                Return to Dashboard
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterviewBot;
