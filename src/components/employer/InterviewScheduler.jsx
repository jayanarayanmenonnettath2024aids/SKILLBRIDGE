import { useState } from 'react';
import Button from '../../components/ui/Button';
import { Calendar, Clock, Video, Phone, MapPin, X, CheckCircle, AlertCircle } from 'lucide-react';
import '../../styles/Employer.css';

const API_URL = 'http://localhost:5000/api';

function InterviewScheduler({ application, jobId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    mode: 'Online',
    meetingLink: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.date || !formData.time) {
        throw new Error('Please select date and time for the interview');
      }

      const response = await fetch(
        `${API_URL}/jobs/${jobId}/applications/${application._id}/schedule-interview`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to schedule interview');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess && onSuccess();
        onClose();
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>Schedule Interview</h2>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.875rem' }}>
              Candidate: <strong>{application.candidateName}</strong>
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-banner">
            <CheckCircle size={20} />
            <span>Interview scheduled successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="interview-form">
          <div className="form-group">
            <label htmlFor="date">
              <Calendar size={18} />
              Interview Date *
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">
              <Clock size={18} />
              Interview Time *
            </label>
            <input
              id="time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mode">
              <Video size={18} />
              Interview Mode *
            </label>
            <select
              id="mode"
              name="mode"
              value={formData.mode}
              onChange={handleInputChange}
              required
            >
              <option value="Online">Online (Video Call)</option>
              <option value="Phone">Phone Call</option>
              <option value="In-person">In-person</option>
            </select>
          </div>

          {formData.mode === 'Online' && (
            <div className="form-group">
              <label htmlFor="meetingLink">
                <Video size={18} />
                Meeting Link
              </label>
              <input
                id="meetingLink"
                name="meetingLink"
                type="url"
                placeholder="https://meet.google.com/..."
                value={formData.meetingLink}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              placeholder="Any special instructions or topics to prepare..."
              value={formData.notes}
              onChange={handleInputChange}
            />
          </div>

          <div className="modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading || success}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || success}>
              {loading ? 'Scheduling...' : success ? 'Scheduled!' : 'Schedule Interview'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InterviewScheduler;
