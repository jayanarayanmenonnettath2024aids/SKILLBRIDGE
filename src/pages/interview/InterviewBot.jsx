import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    MessageCircle, Send, Mic, MicOff, Video, VideoOff, 
    Clock, CheckCircle, AlertCircle, ArrowRight, Volume2,
    Pause, Play, RotateCcw
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import '../../styles/InterviewBot.css';

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

    // Interview questions (will be replaced by backend data)
    const interviewQuestions = [
        {
            id: 1,
            question: "Hello! I'm your AI interviewer. Let's start with a simple question: Can you tell me about yourself and your background?",
            type: "text",
            duration: 120
        },
        {
            id: 2,
            question: "What interests you most about this Data Entry Operator position?",
            type: "text",
            duration: 90
        },
        {
            id: 3,
            question: "Can you describe your experience with MS Office, particularly Excel and Word?",
            type: "text",
            duration: 120
        },
        {
            id: 4,
            question: "How do you ensure accuracy when working with large volumes of data?",
            type: "text",
            duration: 90
        },
        {
            id: 5,
            question: "Tell me about a time when you had to meet a tight deadline. How did you handle it?",
            type: "text",
            duration: 120
        },
        {
            id: 6,
            question: "What is your typing speed, and how comfortable are you with data entry tools?",
            type: "text",
            duration: 90
        },
        {
            id: 7,
            question: "Do you have any questions for us about the role or company?",
            type: "text",
            duration: 90
        }
    ];

    const totalQuestions = interviewQuestions.length;

    // Camera and Recording Functions
    const startCamera = async () => {
        try {
            setCameraError(null);
            setCameraLoading(true);
            
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                },
                audio: true
            });
            
            streamRef.current = stream;
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                
                // Wait a moment for the stream to be fully ready
                setTimeout(() => {
                    if (videoRef.current) {
                        // Explicitly play the video
                        videoRef.current.play()
                            .then(() => {
                                console.log('Video playback started successfully');
                            })
                            .catch(error => {
                                console.error('Error playing video:', error);
                            });
                    }
                }, 100);
            }
            
            console.log('Camera started successfully. Stream active:', stream.active);
            console.log('Video tracks:', stream.getVideoTracks().length);
            console.log('Audio tracks:', stream.getAudioTracks().length);
            
            setIsVideoOn(true);
            setCameraLoading(false);
            
            // Start recording automatically when camera is turned on
            startRecording(stream);
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            setCameraLoading(false);
            if (error.name === 'NotAllowedError') {
                setCameraError('Camera access denied. Please allow camera permissions.');
            } else if (error.name === 'NotFoundError') {
                setCameraError('No camera found on your device.');
            } else {
                setCameraError('Unable to access camera. Please check your device settings.');
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
                
                // Here you would upload the blob to your backend
                console.log('Recording stopped. Video size:', blob.size, 'bytes');
                
                // Create download link for testing (remove in production)
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `interview-${Date.now()}.webm`;
                // Uncomment to auto-download for testing:
                // document.body.appendChild(a);
                // a.click();
                // document.body.removeChild(a);
                
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

    const handleStartInterview = () => {
        setInterviewStarted(true);
        const welcomeMessage = {
            type: 'bot',
            text: `Welcome to your interview for ${jobDetails.title} at ${jobDetails.company}! I'll be asking you ${totalQuestions} questions. Please answer thoughtfully. Let's begin!`,
            timestamp: new Date()
        };
        setChatMessages([welcomeMessage]);
        
        // Ask first question after a delay
        setTimeout(() => {
            askQuestion(0);
        }, 2000);
    };

    const askQuestion = (index) => {
        if (index < interviewQuestions.length) {
            setIsBotSpeaking(true);
            const questionMessage = {
                type: 'bot',
                text: interviewQuestions[index].question,
                timestamp: new Date(),
                questionNumber: index + 1
            };
            setChatMessages(prev => [...prev, questionMessage]);
            
            // Simulate bot speaking
            setTimeout(() => {
                setIsBotSpeaking(false);
            }, 1500);
        }
    };

    const handleSubmitResponse = () => {
        if (!userResponse.trim()) return;

        setIsLoading(true);

        // Add user response to chat
        const responseMessage = {
            type: 'user',
            text: userResponse,
            timestamp: new Date()
        };
        setChatMessages(prev => [...prev, responseMessage]);
        setUserResponse('');

        // Simulate processing delay
        setTimeout(() => {
            setIsLoading(false);
            
            // Move to next question or complete interview
            const nextIndex = currentQuestionIndex + 1;
            if (nextIndex < interviewQuestions.length) {
                setCurrentQuestionIndex(nextIndex);
                setTimeout(() => {
                    askQuestion(nextIndex);
                }, 1500);
            } else {
                completeInterview();
            }
        }, 1000);
    };

    const completeInterview = () => {
        setInterviewCompleted(true);
        stopCamera(); // Stop camera and recording when interview completes
        const completionMessage = {
            type: 'bot',
            text: "Thank you for completing the interview! Your responses have been recorded and will be reviewed by our team. You'll hear back from us within 2-3 business days. Good luck!",
            timestamp: new Date()
        };
        setChatMessages(prev => [...prev, completionMessage]);
    };

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
        // Audio-only recording logic can be implemented separately if needed
        // For now, video recording includes audio
    };

    const toggleVideo = () => {
        if (isVideoOn) {
            stopCamera();
        } else {
            startCamera();
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
            <div className="interview-container">
                <div className="interview-welcome">
                    <Card className="welcome-card">
                        <div className="welcome-icon">
                            <MessageCircle size={64} />
                        </div>
                        <h1>AI Interview</h1>
                        <div className="job-details">
                            <h2>{jobDetails.title}</h2>
                            <p className="company-name">{jobDetails.company}</p>
                            {jobDetails.matchScore && (
                                <Badge variant="success">
                                    {jobDetails.matchScore}% Match
                                </Badge>
                            )}
                        </div>
                        
                        <div className="interview-info">
                            <h3>Before You Begin</h3>
                            <ul>
                                <li><CheckCircle size={18} /> {totalQuestions} questions to answer</li>
                                <li><Clock size={18} /> Approximately 30 minutes</li>
                                <li><Video size={18} /> Video/Audio recording optional</li>
                                <li><AlertCircle size={18} /> Answer thoughtfully and honestly</li>
                            </ul>
                        </div>

                        <div className="interview-tips">
                            <h4>Quick Tips:</h4>
                            <ul>
                                <li>Find a quiet place with good lighting</li>
                                <li>Check your internet connection</li>
                                <li>Keep your answers concise (2-3 minutes)</li>
                                <li>Use the STAR method for behavioral questions</li>
                                <li>You can enable/disable video during the interview</li>
                            </ul>
                        </div>

                        <div className="camera-test-info">
                            <Video size={20} />
                            <p>Your camera and microphone will be requested when you enable video recording during the interview.</p>
                        </div>

                        <div className="welcome-actions">
                            <Button variant="outline" onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                            <Button onClick={handleStartInterview}>
                                Start Interview
                                <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="interview-container">
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
                            Question {currentQuestionIndex + 1} of {totalQuestions}
                        </span>
                        <div className="progress-bar-mini">
                            <div 
                                className="progress-bar-fill"
                                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
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
                {/* Camera Error Message */}
                {cameraError && (
                    <div className="camera-error-message">
                        <AlertCircle size={20} />
                        <span>{cameraError}</span>
                    </div>
                )}

                {/* Video Preview */}
                {(isVideoOn || cameraLoading) && (
                    <div className="video-preview">
                        {cameraLoading ? (
                            <div className="camera-loading">
                                <Video size={48} />
                                <p>Starting camera...</p>
                            </div>
                        ) : (
                            <>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="video-feed"
                                    controls={false}
                                    webkit-playsinline="true"
                                />
                                {isRecordingVideo && (
                                    <div className="recording-indicator">
                                        <div className="recording-dot"></div>
                                        <span>Recording</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

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
