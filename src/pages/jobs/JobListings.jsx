import React, { useState } from 'react';
import JobCard from '../../components/jobs/JobCard';
import JobFilter from '../../components/jobs/JobFilter';
import '../../styles/Jobs.css';
import { Search } from 'lucide-react';

const JobListings = () => {
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
        }
    ]);

    const handleApply = (id) => {
        alert(`Applied to job ID: ${id}. This would trigger the blockchain verification share.`);
    };

    return (
        <div className="container jobs-page">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Find Your Perfect Job</h1>
                <p className="text-secondary">AI-matched opportunities based on your verified profile.</p>

                <div className="mt-4 relative max-w-xl">
                    <input
                        type="text"
                        placeholder="Search jobs by title, skill, or company..."
                        className="input-field pl-10"
                    />
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                </div>
            </div>

            <div className="jobs-layout">
                <aside className="jobs-sidebar">
                    <JobFilter />
                </aside>

                <main className="jobs-list">
                    {jobs.map(job => (
                        <JobCard key={job.id} job={job} onApply={handleApply} />
                    ))}
                </main>
            </div>
        </div>
    );
};

export default JobListings;
