import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employerName: {
    type: String,
    required: true
  },
  employerEmail: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: [String],
    default: []
  },
  skills: {
    type: [String],
    default: []
  },
  location: {
    type: String,
    required: true
  },
  workType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
    default: 'Full-time'
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  experienceLevel: {
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Fresher'],
    default: 'Entry Level'
  },
  educationRequired: {
    type: String,
    default: '10th Pass'
  },
  openings: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Closed', 'On Hold'],
    default: 'Active'
  },
  applicationDeadline: {
    type: Date
  },
  applications: [{
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    candidateName: String,
    candidateEmail: String,
    candidatePhone: String,
    appliedDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Applied', 'Screening', 'Interview Scheduled', 'Interviewed', 'Selected', 'Rejected'],
      default: 'Applied'
    },
    resume: String,
    coverLetter: String,
    matchScore: Number,
    interviewSchedule: {
      date: Date,
      time: String,
      mode: {
        type: String,
        enum: ['Online', 'In-person', 'Phone'],
        default: 'Online'
      },
      meetingLink: String,
      notes: String
    }
  }],
  postedDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
jobSchema.index({ employerId: 1, status: 1 });
jobSchema.index({ location: 1, status: 1 });
jobSchema.index({ skills: 1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;
