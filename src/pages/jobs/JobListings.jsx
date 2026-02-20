import React, { useState, useEffect } from 'react';
import JobCard from '../../components/jobs/JobCard';
import JobFilter from '../../components/jobs/JobFilter';
import JobDetailsModal from '../../components/jobs/JobDetailsModal';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { checkUserResume } from '../../services/resumeService';
import '../../styles/Jobs.css';
import { Search, Upload } from 'lucide-react';

const JobListings = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [selectedJob, setSelectedJob] = useState(null);
    const [hasResume, setHasResume] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [jobs] = useState([
        {
            id: 1,
            title: 'Data Entry Operator',
            company: 'TechServe Solutions',
            location: 'Bangalore (Hybrid)',
            salary: '15,000 - 20,000 / mo',
            type: 'Full Time',
            matchScore: 92,
            trusted: true,
            matchReasons: ['Certified Computer Basics', '12th Pass Verified'],
            missingSkills: ['Typing Speed > 30wpm']
        },
        {
            id: 2,
            title: 'Field Sales Executive',
            company: 'Connect India',
            location: 'Chennai',
            salary: '18,000 + Incentives',
            type: 'Full Time',
            matchScore: 85,
            trusted: true,
            matchReasons: ['Local Language (Tamil)', 'Two Wheeler License'],
            missingSkills: ['Sales Experience']
        },
        {
            id: 3,
            title: 'Warehouse Associate',
            company: 'InstaMart',
            location: 'Bangalore',
            salary: '12,000 - 15,000',
            type: 'Contract',
            matchScore: 70,
            trusted: false,
            matchReasons: ['Physical Fitness', '10th Pass'],
            missingSkills: ['Inventory Management']
        },
        {
            id: 4,
            title: 'Delivery Partner',
            company: 'Swiggy',
            location: 'Mumbai',
            salary: '20,000 - 35,000 / mo',
            type: 'Full Time',
            matchScore: 88,
            trusted: true,
            matchReasons: ['Two Wheeler License', 'Local Area Knowledge'],
            missingSkills: ['Smartphone Usage']
        },
        {
            id: 5,
            title: 'Customer Service Representative',
            company: 'Amazon India',
            location: 'Hyderabad (Remote)',
            salary: '18,000 - 22,000 / mo',
            type: 'Full Time',
            matchScore: 78,
            trusted: true,
            matchReasons: ['English Communication', 'Computer Skills'],
            missingSkills: ['Customer Handling Experience']
        },
        {
            id: 6,
            title: 'Retail Store Associate',
            company: 'Reliance Retail',
            location: 'Delhi',
            salary: '14,000 - 18,000 / mo',
            type: 'Full Time',
            matchScore: 82,
            trusted: true,
            matchReasons: ['Customer Service Skills', '12th Pass'],
            missingSkills: ['Retail Experience']
        },
        {
            id: 7,
            title: 'Electrician',
            company: 'Urban Company',
            location: 'Pune',
            salary: '22,000 - 30,000 / mo',
            type: 'Contract',
            matchScore: 75,
            trusted: true,
            matchReasons: ['ITI Certificate', 'Technical Skills'],
            missingSkills: ['2+ Years Experience']
        },
        {
            id: 8,
            title: 'Security Guard',
            company: 'SecureGuard Services',
            location: 'Bangalore',
            salary: '12,000 - 15,000 / mo',
            type: 'Full Time',
            matchScore: 90,
            trusted: false,
            matchReasons: ['Physical Fitness', 'Night Shift Available'],
            missingSkills: []
        },
        {
            id: 9,
            title: 'Cashier',
            company: 'DMart',
            location: 'Ahmedabad',
            salary: '13,000 - 16,000 / mo',
            type: 'Full Time',
            matchScore: 84,
            trusted: true,
            matchReasons: ['Basic Math Skills', 'Computer Knowledge'],
            missingSkills: ['Tally Software']
        },
        {
            id: 10,
            title: 'Cook/Chef Assistant',
            company: 'Zomato Cloud Kitchen',
            location: 'Kolkata',
            salary: '15,000 - 20,000 / mo',
            type: 'Full Time',
            matchScore: 72,
            trusted: true,
            matchReasons: ['Cooking Skills', 'Food Safety Knowledge'],
            missingSkills: ['Professional Kitchen Experience']
        },
        {
            id: 11,
            title: 'Tele Caller',
            company: 'ICICI Bank',
            location: 'Jaipur (Hybrid)',
            salary: '16,000 - 20,000 / mo',
            type: 'Full Time',
            matchScore: 80,
            trusted: true,
            matchReasons: ['Good Communication', 'Hindi & English'],
            missingSkills: ['Sales Experience']
        },
        {
            id: 12,
            title: 'Housekeeping Staff',
            company: 'Marriott Hotels',
            location: 'Goa',
            salary: '14,000 - 17,000 / mo',
            type: 'Full Time',
            matchScore: 86,
            trusted: true,
            matchReasons: ['Attention to Detail', 'Physical Fitness'],
            missingSkills: ['Hotel Experience']
        },
        {
            id: 13,
            title: 'Tailor',
            company: 'Raymond Tailoring',
            location: 'Surat',
            salary: '18,000 - 25,000 / mo',
            type: 'Full Time',
            matchScore: 68,
            trusted: false,
            matchReasons: ['Stitching Skills', 'Pattern Knowledge'],
            missingSkills: ['Industrial Machine Experience']
        },
        {
            id: 14,
            title: 'Graphic Designer',
            company: 'Digital Marketing Agency',
            location: 'Bangalore (Remote)',
            salary: '20,000 - 30,000 / mo',
            type: 'Full Time',
            matchScore: 76,
            trusted: true,
            matchReasons: ['Adobe Photoshop', 'Creative Portfolio'],
            missingSkills: ['Illustrator', 'CorelDRAW']
        },
        {
            id: 15,
            title: 'Accountant',
            company: 'CA Firm',
            location: 'Mumbai',
            salary: '18,000 - 24,000 / mo',
            type: 'Full Time',
            matchScore: 74,
            trusted: true,
            matchReasons: ['Tally Knowledge', 'Graduate Degree'],
            missingSkills: ['GST Filing Experience']
        }
    ]);

    useEffect(() => {
        // Check if user has uploaded a resume (globally from skillgap or anywhere)
        const checkResume = async () => {
            if (user?.id) {
                const resumeStatus = await checkUserResume(user.id);
                setHasResume(resumeStatus.hasResume);
                console.log('Resume check result:', resumeStatus);
            } else {
                // Fallback to localStorage for unauthenticated users
                const uploadedResume = localStorage.getItem('uploadedResume');
                setHasResume(!!uploadedResume);
            }
        };
        
        checkResume();
    }, [user]);

    const handleApply = (job) => {
        setSelectedJob(job);
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
    };

    const handleApplyFromModal = (job) => {
        alert(`Applied to ${job.title} at ${job.company}. This would trigger the blockchain verification share.`);
        setSelectedJob(null);
    };

    // Filter jobs based on search term
    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container jobs-page">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">{t('jobsTitle')}</h1>
                <p className="text-secondary">{t('jobsDescription')}</p>

                {!hasResume && (
                    <div className="resume-prompt">
                        <Upload size={20} />
                        <span>{t('uploadResumePrompt')}</span>
                        <a href="/resume">{t('uploadNow')}</a>
                    </div>
                )}

                <div className="mt-4 relative max-w-xl">
                    <input
                        type="text"
                        placeholder={t('searchJobs')}
                        className="input-field pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                </div>
            </div>

            <div className="jobs-layout">
                <aside className="jobs-sidebar">
                    <JobFilter />
                </aside>

                <main className="jobs-list">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map(job => (
                            <JobCard 
                                key={job.id} 
                                job={job} 
                                onApply={handleApply}
                                hasResume={hasResume}
                            />
                        ))
                    ) : (
                        <div className="no-results">
                            <p>{t('noJobsFound')}</p>
                        </div>
                    )}
                </main>
            </div>

            {selectedJob && (
                <JobDetailsModal
                    job={selectedJob}
                    onClose={handleCloseModal}
                    onApply={handleApplyFromModal}
                    hasResume={hasResume}
                />
            )}
        </div>
    );
};

export default JobListings;
