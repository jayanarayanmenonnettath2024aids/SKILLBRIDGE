import { useState, useEffect, useRef, useCallback } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

// ────────────────────────────────────────────────
// VIOLATION TYPES
// ────────────────────────────────────────────────
const VIOLATION_TYPES = {
    TAB_SWITCH: {
        id: 'tab_switch',
        label: '⚠️ Tab Switch Detected',
        message: 'You switched away from the interview tab. Please stay on this page.',
        severity: 'high'
    },
    WINDOW_BLUR: {
        id: 'window_blur',
        label: '⚠️ Window Focus Lost',
        message: 'You clicked outside the interview window. Stay focused on the interview.',
        severity: 'medium'
    },
    COPY_PASTE: {
        id: 'copy_paste',
        label: '🚫 Copy/Paste Blocked',
        message: 'Copying or pasting is not allowed during the interview.',
        severity: 'high'
    },
    DEVTOOLS: {
        id: 'devtools',
        label: '🔧 DevTools Detected',
        message: 'Developer tools are not allowed during the interview.',
        severity: 'high'
    },
    CAMERA_BLOCKED: {
        id: 'camera_blocked',
        label: '📷 Camera Blocked',
        message: 'Your camera appears to be covered or blocked. Please ensure your face is visible.',
        severity: 'high'
    },
    MULTIPLE_VOICES: {
        id: 'multiple_voices',
        label: '🔊 Background Audio Detected',
        message: 'Multiple voices or background conversation detected. Please ensure you are alone.',
        severity: 'medium'
    },
    RESTRICTED_KEY: {
        id: 'restricted_key',
        label: '⌨️ Restricted Action',
        message: 'This keyboard shortcut is not allowed during the interview.',
        severity: 'low'
    },
    RIGHT_CLICK: {
        id: 'right_click',
        label: '🖱️ Right-Click Blocked',
        message: 'Right-click is disabled during the interview.',
        severity: 'low'
    },
    MULTIPLE_PERSONS: {
        id: 'multiple_persons',
        label: '👥 Multiple Persons Detected',
        message: 'More than one person is visible on camera. Only the candidate should be in the frame.',
        severity: 'high'
    },
    NO_PERSON: {
        id: 'no_person',
        label: '🚶 No Person Detected',
        message: 'No person detected on camera. Please stay visible in the frame.',
        severity: 'high'
    },
    PHONE_DETECTED: {
        id: 'phone_detected',
        label: '📱 Mobile Phone Detected',
        message: 'A mobile phone has been detected. Electronic devices are not allowed during the interview.',
        severity: 'high'
    },
    BOOK_DETECTED: {
        id: 'book_detected',
        label: '📖 Unauthorized Material Detected',
        message: 'A book or reference material has been detected. External resources are not allowed.',
        severity: 'medium'
    },
    LAPTOP_DETECTED: {
        id: 'laptop_detected',
        label: '💻 Second Screen Detected',
        message: 'An additional laptop/screen has been detected. Only one device is allowed.',
        severity: 'high'
    }
};

// ────────────────────────────────────────────────
// CONSTANTS
// ────────────────────────────────────────────────
const MAX_WARNINGS = 5;
const FINAL_WARNING_THRESHOLD = 3;
const CAMERA_CHECK_INTERVAL = 3000;
const AUDIO_CHECK_INTERVAL = 2000;
const OBJECT_DETECTION_INTERVAL = 4000; // Run AI detection every 4 seconds
const AUDIO_SPIKE_THRESHOLD = 0.35;
const PIXEL_VARIANCE_THRESHOLD = 15;
const DETECTION_CONFIDENCE = 0.5; // Minimum confidence for object detections

/**
 * Custom hook for interview proctoring with AI object detection.
 * Monitors video (persons, phones, objects), audio, tab focus, and user interactions.
 *
 * @param {Object} options
 * @param {React.MutableRefObject} options.streamRef - Ref to the MediaStream
 * @param {React.MutableRefObject} options.videoRef - Ref to the video element
 * @param {boolean} options.isActive - Whether proctoring should be active
 * @param {Function} options.onTerminate - Callback when max violations is reached
 */
const useProctoring = ({ streamRef, videoRef, isActive, onTerminate }) => {
    const [violations, setViolations] = useState([]);
    const [currentWarning, setCurrentWarning] = useState(null);
    const [isTerminated, setIsTerminated] = useState(false);
    const [showFinalWarning, setShowFinalWarning] = useState(false);
    const [warningCount, setWarningCount] = useState(0);
    const [detectionStatus, setDetectionStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
    const [detectedObjects, setDetectedObjects] = useState([]);

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const cameraCheckIntervalRef = useRef(null);
    const audioCheckIntervalRef = useRef(null);
    const objectDetectionIntervalRef = useRef(null);
    const canvasRef = useRef(null);
    const warningTimerRef = useRef(null);
    const violationCountRef = useRef(0);
    const lastViolationTimeRef = useRef({}); // Per-type debounce
    const modelRef = useRef(null);
    const modelLoadingRef = useRef(false);

    // ────────────────────────────────────────────────
    // ADD VIOLATION (with per-type debounce)
    // ────────────────────────────────────────────────
    const addViolation = useCallback((violationType) => {
        if (isTerminated) return;

        const now = Date.now();
        const lastTime = lastViolationTimeRef.current[violationType.id] || 0;

        // Debounce: skip same violation type within 5 seconds
        if (now - lastTime < 5000) return;
        lastViolationTimeRef.current[violationType.id] = now;

        const violation = {
            ...violationType,
            timestamp: new Date(),
            id: `${violationType.id}_${now}`
        };

        violationCountRef.current += 1;
        const count = violationCountRef.current;

        setViolations(prev => [...prev, violation]);
        setWarningCount(count);
        setCurrentWarning(violation);

        // Clear previous warning timer
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);

        // Auto-dismiss warning after 4 seconds
        warningTimerRef.current = setTimeout(() => {
            setCurrentWarning(null);
        }, 4000);

        console.log(`[PROCTOR] Violation #${count}: ${violationType.label}`);

        // Check thresholds
        if (count >= MAX_WARNINGS) {
            setIsTerminated(true);
            setCurrentWarning(null);
            setShowFinalWarning(false);
            if (onTerminate) onTerminate(violations);
        } else if (count >= FINAL_WARNING_THRESHOLD && !showFinalWarning) {
            setShowFinalWarning(true);
        }
    }, [isTerminated, onTerminate, violations, showFinalWarning]);

    const dismissWarning = useCallback(() => {
        setCurrentWarning(null);
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    }, []);

    const dismissFinalWarning = useCallback(() => {
        setShowFinalWarning(false);
    }, []);

    // ──────────────────────────────────────────────
    // 1. TAB VISIBILITY + WINDOW BLUR DETECTION
    // ──────────────────────────────────────────────
    useEffect(() => {
        if (!isActive || isTerminated) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                addViolation(VIOLATION_TYPES.TAB_SWITCH);
            }
        };

        const handleWindowBlur = () => {
            if (!document.hidden) {
                addViolation(VIOLATION_TYPES.WINDOW_BLUR);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleWindowBlur);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleWindowBlur);
        };
    }, [isActive, isTerminated, addViolation]);

    // ──────────────────────────────────────────────
    // 2. COPY / PASTE / CONTEXT MENU BLOCKING
    // ──────────────────────────────────────────────
    useEffect(() => {
        if (!isActive || isTerminated) return;

        const handleCopy = (e) => {
            e.preventDefault();
            addViolation(VIOLATION_TYPES.COPY_PASTE);
        };

        const handlePaste = (e) => {
            e.preventDefault();
            addViolation(VIOLATION_TYPES.COPY_PASTE);
        };

        const handleContextMenu = (e) => {
            e.preventDefault();
            addViolation(VIOLATION_TYPES.RIGHT_CLICK);
        };

        document.addEventListener('copy', handleCopy);
        document.addEventListener('paste', handlePaste);
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [isActive, isTerminated, addViolation]);

    // ──────────────────────────────────────────────
    // 3. RESTRICTED KEYBOARD SHORTCUTS
    // ──────────────────────────────────────────────
    useEffect(() => {
        if (!isActive || isTerminated) return;

        const handleKeyDown = (e) => {
            const restricted = [
                e.key === 'F12',
                (e.ctrlKey && e.shiftKey && e.key === 'I'),
                (e.ctrlKey && e.shiftKey && e.key === 'J'),
                (e.ctrlKey && e.shiftKey && e.key === 'C'),
                (e.ctrlKey && e.key === 'u'),
                (e.ctrlKey && e.key === 'c'),
                (e.ctrlKey && e.key === 'v'),
                (e.ctrlKey && e.key === 'x'),
                (e.ctrlKey && e.key === 'p'),
                (e.ctrlKey && e.key === 's'),
            ];

            if (restricted.some(Boolean)) {
                e.preventDefault();
                e.stopPropagation();

                if (e.key === 'F12' || (e.ctrlKey && e.shiftKey)) {
                    addViolation(VIOLATION_TYPES.DEVTOOLS);
                } else {
                    addViolation(VIOLATION_TYPES.RESTRICTED_KEY);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown, true);
        return () => document.removeEventListener('keydown', handleKeyDown, true);
    }, [isActive, isTerminated, addViolation]);

    // ──────────────────────────────────────────────
    // 4. CAMERA BLOCKED DETECTION (pixel variance)
    // ──────────────────────────────────────────────
    useEffect(() => {
        if (!isActive || isTerminated) return;

        if (!canvasRef.current) {
            canvasRef.current = document.createElement('canvas');
            canvasRef.current.width = 64;
            canvasRef.current.height = 48;
        }

        const checkCamera = () => {
            const video = videoRef?.current;
            if (!video || video.readyState < 2 || video.videoWidth === 0) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;

            let sum = 0;
            let sumSq = 0;
            const numPixels = pixels.length / 4;

            for (let i = 0; i < pixels.length; i += 4) {
                const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
                sum += brightness;
                sumSq += brightness * brightness;
            }

            const mean = sum / numPixels;
            const variance = (sumSq / numPixels) - (mean * mean);
            const stdDev = Math.sqrt(Math.max(0, variance));

            if (stdDev < PIXEL_VARIANCE_THRESHOLD && mean < 30) {
                addViolation(VIOLATION_TYPES.CAMERA_BLOCKED);
            }
        };

        cameraCheckIntervalRef.current = setInterval(checkCamera, CAMERA_CHECK_INTERVAL);

        return () => {
            if (cameraCheckIntervalRef.current) {
                clearInterval(cameraCheckIntervalRef.current);
            }
        };
    }, [isActive, isTerminated, videoRef, addViolation]);

    // ──────────────────────────────────────────────
    // 5. AUDIO MONITORING (multiple voices / noise)
    // ──────────────────────────────────────────────
    useEffect(() => {
        if (!isActive || isTerminated) return;

        const stream = streamRef?.current;
        if (!stream) return;

        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length === 0) return;

        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.5;

            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);

            audioContextRef.current = audioCtx;
            analyserRef.current = analyser;

            let consecutiveSpikes = 0;

            const checkAudio = () => {
                if (!analyserRef.current) return;

                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(dataArray);

                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    const normalized = dataArray[i] / 255;
                    sum += normalized * normalized;
                }
                const rms = Math.sqrt(sum / dataArray.length);

                if (rms > AUDIO_SPIKE_THRESHOLD) {
                    consecutiveSpikes++;
                    if (consecutiveSpikes >= 5) {
                        addViolation(VIOLATION_TYPES.MULTIPLE_VOICES);
                        consecutiveSpikes = 0;
                    }
                } else {
                    consecutiveSpikes = Math.max(0, consecutiveSpikes - 1);
                }
            };

            audioCheckIntervalRef.current = setInterval(checkAudio, AUDIO_CHECK_INTERVAL);
        } catch (err) {
            console.log('[PROCTOR] Audio monitoring not available:', err.message);
        }

        return () => {
            if (audioCheckIntervalRef.current) {
                clearInterval(audioCheckIntervalRef.current);
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(() => { });
            }
        };
    }, [isActive, isTerminated, streamRef, addViolation]);

    // ──────────────────────────────────────────────
    // 6. AI OBJECT DETECTION (COCO-SSD)
    //    Detects: multiple persons, phones, books, laptops
    // ──────────────────────────────────────────────
    useEffect(() => {
        if (!isActive || isTerminated) return;

        let isMounted = true;

        // Load the COCO-SSD model
        const loadModel = async () => {
            if (modelRef.current || modelLoadingRef.current) return;
            modelLoadingRef.current = true;

            try {
                console.log('[PROCTOR] Loading AI detection model...');
                setDetectionStatus('loading');
                const model = await cocoSsd.load({
                    base: 'lite_mobilenet_v2' // Lightweight model for browser
                });
                if (isMounted) {
                    modelRef.current = model;
                    setDetectionStatus('ready');
                    console.log('[PROCTOR] ✓ AI detection model loaded successfully');
                }
            } catch (err) {
                console.error('[PROCTOR] Failed to load AI model:', err);
                if (isMounted) {
                    setDetectionStatus('error');
                }
            } finally {
                modelLoadingRef.current = false;
            }
        };

        loadModel();

        // Run detection at intervals
        const runDetection = async () => {
            const model = modelRef.current;
            const video = videoRef?.current;

            if (!model || !video || video.readyState < 2 || video.videoWidth === 0) return;

            try {
                const predictions = await model.detect(video);

                // Filter by confidence
                const confident = predictions.filter(p => p.score >= DETECTION_CONFIDENCE);

                // Update detected objects for UI overlay
                setDetectedObjects(confident.map(p => ({
                    class: p.class,
                    score: Math.round(p.score * 100),
                    bbox: p.bbox // [x, y, width, height]
                })));

                // ─── Count persons ───
                const persons = confident.filter(p => p.class === 'person');
                if (persons.length > 1) {
                    addViolation(VIOLATION_TYPES.MULTIPLE_PERSONS);
                } else if (persons.length === 0) {
                    // Only flag if camera is not blocked (to avoid double-counting)
                    addViolation(VIOLATION_TYPES.NO_PERSON);
                }

                // ─── Detect mobile phones ───
                const phones = confident.filter(p => p.class === 'cell phone');
                if (phones.length > 0) {
                    addViolation(VIOLATION_TYPES.PHONE_DETECTED);
                }

                // ─── Detect books/notebooks ───
                const books = confident.filter(p => p.class === 'book');
                if (books.length > 0) {
                    addViolation(VIOLATION_TYPES.BOOK_DETECTED);
                }

                // ─── Detect additional screens/laptops ───
                const laptops = confident.filter(p => p.class === 'laptop');
                if (laptops.length > 0) {
                    addViolation(VIOLATION_TYPES.LAPTOP_DETECTED);
                }

            } catch (err) {
                // Silently handle detection errors (e.g., video not ready)
                console.log('[PROCTOR] Detection frame skipped:', err.message);
            }
        };

        // Start detection loop after a small delay to let model load
        const startDetection = () => {
            objectDetectionIntervalRef.current = setInterval(runDetection, OBJECT_DETECTION_INTERVAL);
        };

        // Wait for model to load, then start
        const waitAndStart = setInterval(() => {
            if (modelRef.current) {
                clearInterval(waitAndStart);
                startDetection();
            }
        }, 1000);

        return () => {
            isMounted = false;
            clearInterval(waitAndStart);
            if (objectDetectionIntervalRef.current) {
                clearInterval(objectDetectionIntervalRef.current);
            }
        };
    }, [isActive, isTerminated, videoRef, addViolation]);

    // ──────────────────────────────────────────────
    // CLEANUP on unmount
    // ──────────────────────────────────────────────
    useEffect(() => {
        return () => {
            if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
            if (cameraCheckIntervalRef.current) clearInterval(cameraCheckIntervalRef.current);
            if (audioCheckIntervalRef.current) clearInterval(audioCheckIntervalRef.current);
            if (objectDetectionIntervalRef.current) clearInterval(objectDetectionIntervalRef.current);
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(() => { });
            }
        };
    }, []);

    return {
        violations,
        warningCount,
        currentWarning,
        showFinalWarning,
        isTerminated,
        dismissWarning,
        dismissFinalWarning,
        maxWarnings: MAX_WARNINGS,
        finalWarningThreshold: FINAL_WARNING_THRESHOLD,
        detectionStatus,
        detectedObjects
    };
};

export default useProctoring;
