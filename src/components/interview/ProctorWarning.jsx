import React from 'react';
import { AlertTriangle, ShieldAlert, XCircle, X, Eye, Shield, Smartphone, Users, Loader } from 'lucide-react';
import Button from '../ui/Button';
import '../../styles/ProctorWarning.css';

/**
 * Proctoring warning overlay component.
 * Renders toast warnings, final warning modal, terminated screen, and AI detection status.
 */
const ProctorWarning = ({
    currentWarning,
    warningCount,
    maxWarnings,
    showFinalWarning,
    isTerminated,
    onDismissWarning,
    onDismissFinalWarning,
    onReturnToDashboard,
    detectionStatus,
    detectedObjects
}) => {

    // ─── Terminated Screen ───
    if (isTerminated) {
        return (
            <div className="proctor-terminated-overlay">
                <div className="proctor-terminated-card">
                    <div className="terminated-icon">
                        <XCircle size={72} />
                    </div>
                    <h2>Interview Terminated</h2>
                    <p className="terminated-reason">
                        Your interview has been automatically ended due to multiple proctoring violations.
                        This may affect your application status.
                    </p>
                    <div className="terminated-violations">
                        <ShieldAlert size={18} />
                        <span>{warningCount} violation{warningCount !== 1 ? 's' : ''} detected</span>
                    </div>
                    <p className="terminated-note">
                        If you believe this was an error, please contact the hiring team for further assistance.
                    </p>
                    {onReturnToDashboard && (
                        <Button onClick={onReturnToDashboard} style={{ marginTop: '1.5rem' }}>
                            Return to Dashboard
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            {/* ─── Warning Toast ─── */}
            {currentWarning && (
                <div className={`proctor-toast proctor-toast-${currentWarning.severity}`}>
                    <div className="proctor-toast-icon">
                        <AlertTriangle size={22} />
                    </div>
                    <div className="proctor-toast-content">
                        <strong>{currentWarning.label}</strong>
                        <p>{currentWarning.message}</p>
                    </div>
                    <div className="proctor-toast-meta">
                        <span className="proctor-warning-count">
                            {warningCount}/{maxWarnings}
                        </span>
                        <button className="proctor-toast-close" onClick={onDismissWarning}>
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* ─── Proctoring Badge (always visible) ─── */}
            <div className="proctor-badge">
                <Shield size={14} />
                <span>AI Proctored</span>
                {detectionStatus === 'loading' && (
                    <Loader size={12} className="proctor-badge-spinner" />
                )}
                {detectionStatus === 'ready' && (
                    <span className="proctor-badge-ai-ready">●</span>
                )}
                {warningCount > 0 && (
                    <span className="proctor-badge-count">{warningCount}</span>
                )}
            </div>

            {/* ─── AI Detection Overlay on Video ─── */}
            {detectedObjects && detectedObjects.length > 0 && (
                <div className="proctor-detection-overlay">
                    {detectedObjects.map((obj, idx) => {
                        const isSuspicious = ['cell phone', 'book', 'laptop'].includes(obj.class) ||
                            (obj.class === 'person' && detectedObjects.filter(o => o.class === 'person').length > 1);
                        return (
                            <span
                                key={idx}
                                className={`proctor-detection-tag ${isSuspicious ? 'suspicious' : 'normal'}`}
                            >
                                {obj.class === 'person' ? '👤' :
                                    obj.class === 'cell phone' ? '📱' :
                                        obj.class === 'book' ? '📖' :
                                            obj.class === 'laptop' ? '💻' : '🔍'} {obj.class} ({obj.score}%)
                            </span>
                        );
                    })}
                </div>
            )}

            {/* ─── Final Warning Modal ─── */}
            {showFinalWarning && (
                <div className="proctor-final-overlay">
                    <div className="proctor-final-card">
                        <div className="final-warning-icon">
                            <ShieldAlert size={56} />
                        </div>
                        <h2>⚠️ Final Warning</h2>
                        <p>
                            You have received <strong>{warningCount} out of {maxWarnings}</strong> allowed warnings.
                        </p>
                        <p className="final-warning-detail">
                            If you continue with suspicious activities, your interview will be
                            <strong> automatically terminated</strong> and marked as incomplete.
                        </p>
                        <div className="final-warning-rules">
                            <h4>Please ensure:</h4>
                            <ul>
                                <li><Eye size={14} /> Stay on this tab — do not switch windows</li>
                                <li><Users size={14} /> Only you should be visible on camera</li>
                                <li><Smartphone size={14} /> No mobile phones or electronic devices in view</li>
                                <li><Eye size={14} /> No books or reference materials visible</li>
                                <li><Eye size={14} /> Answer questions independently</li>
                            </ul>
                        </div>
                        <Button onClick={onDismissFinalWarning} style={{ marginTop: '1rem', width: '100%' }}>
                            I Understand — Continue Interview
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProctorWarning;
