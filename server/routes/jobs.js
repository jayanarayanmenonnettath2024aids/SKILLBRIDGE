import express from 'express';
import Job from '../models/Job.js';
import User from '../models/User.js';

const router = express.Router();

// Get all jobs (with filters)
router.get('/', async (req, res) => {
  try {
    const { status, location, employerId, skills } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (location) filter.location = new RegExp(location, 'i');
    if (employerId) filter.employerId = employerId;
    if (skills) filter.skills = { $in: skills.split(',') };

    const jobs = await Job.find(filter)
      .sort({ postedDate: -1 })
      .limit(100);

    res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      message: 'Error fetching jobs',
      error: error.message
    });
  }
});

// Get single job by ID
router.get('/:jobId', async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      message: 'Error fetching job',
      error: error.message
    });
  }
});

// Post a new job (employer only)
router.post('/create', async (req, res) => {
  try {
    const {
      title,
      company,
      employerId,
      employerName,
      employerEmail,
      description,
      requirements,
      skills,
      location,
      workType,
      salary,
      experienceLevel,
      educationRequired,
      openings,
      applicationDeadline
    } = req.body;

    // Validate required fields
    if (!title || !company || !employerId || !description || !location) {
      return res.status(400).json({
        message: 'Missing required fields: title, company, employerId, description, location'
      });
    }

    // Verify employer exists
    const employer = await User.findById(employerId);
    if (!employer || employer.role !== 'employer') {
      return res.status(403).json({
        message: 'Invalid employer or insufficient permissions'
      });
    }

    const job = new Job({
      title,
      company,
      employerId,
      employerName: employerName || employer.fullName,
      employerEmail: employerEmail || employer.email,
      description,
      requirements: requirements || [],
      skills: skills || [],
      location,
      workType,
      salary,
      experienceLevel,
      educationRequired,
      openings,
      applicationDeadline,
      status: 'Active'
    });

    await job.save();

    console.log(`✅ Job posted: ${title} by ${company}`);

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job
    });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({
      message: 'Error posting job',
      error: error.message
    });
  }
});

// Update job
router.put('/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const updates = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Update job fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== '_id' && key !== 'employerId') {
        job[key] = updates[key];
      }
    });

    job.lastUpdated = new Date();
    await job.save();

    res.json({
      success: true,
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      message: 'Error updating job',
      error: error.message
    });
  }
});

// Delete job
router.delete('/:jobId', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      message: 'Error deleting job',
      error: error.message
    });
  }
});

// Apply for a job (candidate)
router.post('/:jobId/apply', async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      candidateId,
      candidateName,
      candidateEmail,
      candidatePhone,
      resume,
      coverLetter
    } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'Active') {
      return res.status(400).json({ message: 'Job is not accepting applications' });
    }

    // Check if already applied
    const existingApplication = job.applications.find(
      app => app.candidateId.toString() === candidateId
    );

    if (existingApplication) {
      return res.status(400).json({
        message: 'You have already applied for this job'
      });
    }

    // Add application
    job.applications.push({
      candidateId,
      candidateName,
      candidateEmail,
      candidatePhone,
      resume,
      coverLetter,
      status: 'Applied'
    });

    await job.save();

    console.log(`✅ Application submitted: ${candidateName} -> ${job.title}`);

    res.json({
      success: true,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({
      message: 'Error applying for job',
      error: error.message
    });
  }
});

// Get applications for a job (employer only)
router.get('/:jobId/applications', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.query;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    let applications = job.applications;

    if (status) {
      applications = applications.filter(app => app.status === status);
    }

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      message: 'Error fetching applications',
      error: error.message
    });
  }
});

// Update application status
router.put('/:jobId/applications/:applicationId', async (req, res) => {
  try {
    const { jobId, applicationId } = req.params;
    const { status, interviewSchedule } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const application = job.applications.id(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (status) {
      application.status = status;
    }

    if (interviewSchedule) {
      application.interviewSchedule = interviewSchedule;
      application.status = 'Interview Scheduled';
    }

    await job.save();

    console.log(`✅ Application updated: ${application.candidateName} - ${status || 'Interview Scheduled'}`);

    res.json({
      success: true,
      message: 'Application updated successfully',
      application
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({
      message: 'Error updating application',
      error: error.message
    });
  }
});

// Schedule interview
router.post('/:jobId/applications/:applicationId/schedule-interview', async (req, res) => {
  try {
    const { jobId, applicationId } = req.params;
    const { date, time, mode, meetingLink, notes } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const application = job.applications.id(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.interviewSchedule = {
      date,
      time,
      mode,
      meetingLink,
      notes
    };
    application.status = 'Interview Scheduled';

    await job.save();

    console.log(`✅ Interview scheduled: ${application.candidateName} on ${date} at ${time}`);

    res.json({
      success: true,
      message: 'Interview scheduled successfully',
      application
    });
  } catch (error) {
    console.error('Error scheduling interview:', error);
    res.status(500).json({
      message: 'Error scheduling interview',
      error: error.message
    });
  }
});

export default router;
