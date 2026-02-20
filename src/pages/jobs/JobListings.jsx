import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JobCard from '../../components/jobs/JobCard';
import JobFilter from '../../components/jobs/JobFilter';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/Jobs.css';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';

const JobListings = () => {
    const { t } = useLanguage();
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const [jobs] = useState([
        {
            id: 1,
            title: 'Senior Frontend Engineer',
            company: 'Google India',
            location: 'Bangalore, India',
            salary: '₹12L - ₹18L',
            type: 'Full Time',
            matchScore: 92,
            trusted: true,
            description: 'We are looking for an exceptional Senior Frontend Engineer to lead our enterprise dashboard initiatives. You will work with React, TypeScript, and high-performance visualization libraries.'
        },
        {
            id: 2,
            title: 'Product Designer',
            company: 'Stripe',
            location: 'Remote',
            salary: '₹10L - ₹15L',
            type: 'Full Time',
            matchScore: 85,
            trusted: true,
            description: 'Design the future of payments. At Stripe, we believe design is a core competitive advantage. You will be responsible for creating seamless, high-end user experiences.'
        },
        {
            id: 3,
            title: 'Full Stack Developer',
            company: 'Linear',
            location: 'Chennai, India',
            salary: '₹8L - ₹14L',
            type: 'Contract',
            matchScore: 78,
            trusted: false,
            description: 'Help us build the next generation of project management tools. We value speed, precision, and craft. Join a team dedicated to making software development better.'
        }
    ]);

    const handleApply = (jobId) => {
        console.log(`Applying for job ${jobId}`);
    };

    return (
        <div className="jobs-page">
            {/* ── Hero Search Section ── */}
            <header className="jobs-hero">
                <div className="hero-container">
                    <h1 className="hero-title">{t('findPerfectJob')}</h1>
                    <p className="hero-subtitle">
                        {t('aiMatchedOpportunities')}
                    </p>

                    {/* Unified Capsule Search Bar */}
                    <div className="search-container">
                        <div className="search-field">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                className="search-input"
                            />
                        </div>

                        <div className="search-divider"></div>

                        <div className="search-field">
                            <MapPin size={18} />
                            <input
                                type="text"
                                placeholder={t('location')}
                                className="search-input"
                            />
                        </div>

                        <button className="search-btn">{t('search')}</button>
                    </div>
                </div>
            </header>

            {/* ── Results Toolbar ── */}
            <div className="jobs-toolbar-wrapper">
                <div className="jobs-toolbar">
                    <div className="results-count">
                        {jobs.length} {t('jobsFound')}
                    </div>
                    <div className="flex items-center gap-4">
                        <select className="bg-transparent border-none text-sm font-medium outline-none cursor-pointer">
                            <option>{t('mostRelevant')}</option>
                            <option>{t('newest')}</option>
                            <option>{t('salaryRange')}</option>
                        </select>

                        {/* Mobile Filter Button */}
                        <button
                            className="lg:hidden flex items-center gap-2 text-sm font-semibold text-primary"
                            onClick={() => setIsMobileFilterOpen(true)}
                        >
                            <SlidersHorizontal size={16} /> {t('filters')}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Main Layout ── */}
            <div className="jobs-main-container">
                <aside className="jobs-sidebar hidden lg:block">
                    <JobFilter />
                </aside>

                <main className="jobs-list">
                    {jobs.map(job => (
                        <JobCard key={job.id} job={job} onApply={handleApply} />
                    ))}
                </main>
            </div>

            {/* ── Mobile Filter Drawer ── */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mobile-drawer-overlay"
                            onClick={() => setIsMobileFilterOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="mobile-drawer"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold">{t('filters')}</h3>
                                <button onClick={() => setIsMobileFilterOpen(false)}>
                                    <X size={24} />
                                </button>
                            </div>
                            <JobFilter />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobListings;
