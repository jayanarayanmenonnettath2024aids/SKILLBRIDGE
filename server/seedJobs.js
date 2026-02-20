import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';
import User from './models/User.js';

dotenv.config();

const dummyJobs = [
  {
    title: 'Data Entry Operator',
    company: 'TechServe Solutions',
    description: 'We are looking for a detail-oriented Data Entry Operator to join our team. The ideal candidate will have good typing skills and basic computer knowledge. This is an entry-level position perfect for candidates looking to start their career in the IT sector.',
    requirements: [
      '10th pass or above',
      'Basic computer knowledge',
      'Typing speed of 30+ WPM',
      'Good attention to detail',
      'Basic knowledge of MS Office'
    ],
    skills: ['Data Entry', 'MS Excel', 'Typing', 'English'],
    location: 'Bangalore',
    workType: 'Full-time',
    salary: {
      min: 12000,
      max: 18000,
      currency: 'INR'
    },
    experienceLevel: 'Entry Level',
    educationRequired: '10th Pass',
    openings: 5,
    status: 'Active'
  },
  {
    title: 'Customer Support Executive',
    company: 'Reliance Retail',
    description: 'Join our customer support team to help customers with their queries and concerns. We are looking for candidates with excellent communication skills and a customer-first attitude. Training will be provided.',
    requirements: [
      '12th pass or graduate',
      'Good communication skills in Hindi and English',
      'Basic computer knowledge',
      'Friendly and patient personality',
      'Willingness to work in shifts'
    ],
    skills: ['Communication', 'Customer Service', 'Hindi', 'English', 'Problem Solving'],
    location: 'Mumbai',
    workType: 'Full-time',
    salary: {
      min: 15000,
      max: 22000,
      currency: 'INR'
    },
    experienceLevel: 'Fresher',
    educationRequired: '12th Pass',
    openings: 10,
    status: 'Active'
  },
  {
    title: 'Warehouse Associate',
    company: 'Flipkart Logistics',
    description: 'We need energetic individuals to work in our warehouse. Responsibilities include inventory management, order picking, packing, and loading. Physical fitness is required.',
    requirements: [
      '10th pass minimum',
      'Physical fitness',
      'Ability to lift heavy items',
      'Basic math skills',
      'Team player'
    ],
    skills: ['Inventory Management', 'Physical Fitness', 'Team Work'],
    location: 'Delhi',
    workType: 'Full-time',
    salary: {
      min: 14000,
      max: 20000,
      currency: 'INR'
    },
    experienceLevel: 'Entry Level',
    educationRequired: '10th Pass',
    openings: 15,
    status: 'Active'
  },
  {
    title: 'Delivery Partner',
    company: 'Swiggy',
    description: 'Join Swiggy as a Delivery Partner and enjoy flexible working hours. You will deliver food orders to customers across the city. Own vehicle preferred but we can provide one.',
    requirements: [
      '8th pass or above',
      'Valid driving license',
      'Own smartphone',
      'Knowledge of local area',
      'Good communication skills'
    ],
    skills: ['Driving', 'Navigation', 'Customer Service', 'Time Management'],
    location: 'Bangalore',
    workType: 'Part-time',
    salary: {
      min: 20000,
      max: 35000,
      currency: 'INR'
    },
    experienceLevel: 'Fresher',
    educationRequired: '8th Pass',
    openings: 20,
    status: 'Active'
  },
  {
    title: 'Retail Sales Associate',
    company: 'Big Bazaar',
    description: 'We are hiring Sales Associates for our retail stores. You will assist customers, manage inventory, and ensure the store is well-maintained. Great opportunity to build retail experience.',
    requirements: [
      '12th pass',
      'Good communication skills',
      'Friendly and approachable',
      'Basic math skills',
      'Ability to work standing for long hours'
    ],
    skills: ['Sales', 'Customer Service', 'Communication', 'Hindi', 'English'],
    location: 'Pune',
    workType: 'Full-time',
    salary: {
      min: 13000,
      max: 18000,
      currency: 'INR'
    },
    experienceLevel: 'Fresher',
    educationRequired: '12th Pass',
    openings: 8,
    status: 'Active'
  },
  {
    title: 'Office Assistant',
    company: 'HDFC Bank',
    description: 'HDFC Bank is looking for an Office Assistant to support daily office operations. Responsibilities include filing, data entry, managing correspondence, and assisting with administrative tasks.',
    requirements: [
      'Graduate preferred',
      'Proficient in MS Office',
      'Good organizational skills',
      'Excellent communication',
      'Professional attitude'
    ],
    skills: ['MS Office', 'Communication', 'Organization', 'Data Entry', 'English'],
    location: 'Chennai',
    workType: 'Full-time',
    salary: {
      min: 16000,
      max: 24000,
      currency: 'INR'
    },
    experienceLevel: 'Entry Level',
    educationRequired: 'Graduate',
    openings: 3,
    status: 'Active'
  },
  {
    title: 'Marketing Intern',
    company: 'Digital Marketing Agency',
    description: 'Join our team as a Marketing Intern and gain hands-on experience in digital marketing. You will work on social media campaigns, content creation, and market research.',
    requirements: [
      'Graduate or final year student',
      'Interest in digital marketing',
      'Good writing skills',
      'Social media savvy',
      'Creative mindset'
    ],
    skills: ['Social Media', 'Content Writing', 'Digital Marketing', 'English'],
    location: 'Remote',
    workType: 'Internship',
    salary: {
      min: 8000,
      max: 12000,
      currency: 'INR'
    },
    experienceLevel: 'Fresher',
    educationRequired: 'Graduate',
    openings: 2,
    status: 'Active'
  },
  {
    title: 'Telecaller',
    company: 'ICICI Bank',
    description: 'We are hiring Telecallers for our customer service team. You will make outbound calls to customers for various banking services and handle customer inquiries over the phone.',
    requirements: [
      '12th pass or graduate',
      'Excellent communication skills',
      'Comfortable making calls',
      'Basic computer knowledge',
      'Patient and persuasive'
    ],
    skills: ['Communication', 'Telecalling', 'Customer Service', 'Hindi', 'English'],
    location: 'Hyderabad',
    workType: 'Full-time',
    salary: {
      min: 14000,
      max: 20000,
      currency: 'INR'
    },
    experienceLevel: 'Fresher',
    educationRequired: '12th Pass',
    openings: 12,
    status: 'Active'
  }
];

// Sample applications for some jobs
const generateApplications = (jobId, count) => {
  const names = [
    'Rahul Kumar',
    'Priya Sharma',
    'Amit Singh',
    'Sneha Patel',
    'Vikram Reddy',
    'Anjali Gupta',
    'Rajesh Verma',
    'Deepika Iyer',
    'Suresh Nair',
    'Pooja Desai'
  ];

  const statuses = ['Applied', 'Screening', 'Interview Scheduled', 'Interviewed'];

  const applications = [];
  for (let i = 0; i < count; i++) {
    const name = names[i % names.length];
    applications.push({
      candidateName: name,
      candidateEmail: `${name.toLowerCase().replace(' ', '.')}@email.com`,
      candidatePhone: `9${Math.floor(Math.random() * 900000000) + 100000000}`,
      appliedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      matchScore: Math.floor(Math.random() * 30) + 70
    });
  }
  return applications;
};

async function seedJobs() {
  try {
    console.log('🌱 Starting job seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find or create a sample employer
    let employer = await User.findOne({ role: 'employer' });

    if (!employer) {
      console.log('⚠️  No employer found. Creating sample employer...');
      
      // Create a sample employer user
      employer = new User({
        fullName: 'Demo Employer',
        phoneNumber: '9876543210',
        email: 'employer@skillbridge.com',
        password: 'employer123', // Will be hashed by the model
        dateOfBirth: new Date('1990-01-01'),
        gender: 'male',
        role: 'employer',
        faceImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRg==', // Dummy base64
        verified: true,
        isActive: true
      });

      await employer.save();
      console.log('✅ Sample employer created: employer@skillbridge.com / password: employer123');
    }

    console.log(`👤 Using employer: ${employer.fullName} (${employer.email})`);

    // Clear existing jobs (optional - comment out if you want to keep existing jobs)
    // await Job.deleteMany({});
    // console.log('🗑️  Cleared existing jobs');

    // Add employer details to jobs
    const jobsToInsert = dummyJobs.map(job => ({
      ...job,
      employerId: employer._id,
      employerName: employer.fullName,
      employerEmail: employer.email,
      applications: generateApplications(null, Math.floor(Math.random() * 8) + 2), // 2-10 applications
      postedDate: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000) // Posted within last 2 weeks
    }));

    // Insert jobs
    const insertedJobs = await Job.insertMany(jobsToInsert);
    console.log(`✅ Successfully seeded ${insertedJobs.length} jobs`);

    // Display summary
    console.log('\n📊 Summary:');
    insertedJobs.forEach(job => {
      console.log(`  - ${job.title} at ${job.company} (${job.applications.length} applications)`);
    });

    console.log('\n✨ Job seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
    process.exit(1);
  }
}

// Run the seed function
seedJobs();
