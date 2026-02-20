import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen, Clock, Award, TrendingUp, CheckCircle, PlayCircle, Star, Brain, Database, Shield, Code, Smartphone, Cloud, Wifi, Network, Settings,
    Bot, BrainCircuit, BarChart3, Lock, Globe, MonitorSmartphone, CloudCog, Cable, NetworkIcon, Laptop
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import '../../styles/MicroLearning.css';

const MicroLearning = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [showDomainSelector, setShowDomainSelector] = useState(true);
    const [selectedDomains, setSelectedDomains] = useState([]);
    const [userProgress] = useState({
        completedModules: 15,
        totalModules: 22,
        learningStreak: 7,
        totalPoints: 1050
    });

    const allDomains = [
        { id: 'ai', name: 'Artificial Intelligence', icon: Bot, description: 'Building smart systems that learn and decide' },
        { id: 'ml', name: 'Machine Learning', icon: BrainCircuit, description: 'Data-driven algorithms and models' },
        { id: 'data-science', name: 'Data Science', icon: BarChart3, description: 'Extracting insights from large datasets' },
        { id: 'cybersecurity', name: 'Cybersecurity', icon: Lock, description: 'Protecting systems and data from threats' },
        { id: 'web-dev', name: 'Web Development', icon: Globe, description: 'Building modern web applications' },
        { id: 'mobile-dev', name: 'Mobile App Dev', icon: MonitorSmartphone, description: 'iOS and Android app development' },
        { id: 'cloud', name: 'Cloud Computing', icon: CloudCog, description: 'Cloud infrastructure and services' },
        { id: 'iot', name: 'IoT', icon: Cable, description: 'Connecting physical devices to the web' },
        { id: 'networks', name: 'Networks', icon: NetworkIcon, description: 'Computer communication systems' },
        { id: 'software-eng', name: 'Software Engineering', icon: Laptop, description: 'Formal software development practices' }
    ];

    const categories = [
        { id: 'all', name: 'All Courses', icon: BookOpen },
        { id: 'ai', name: 'Artificial Intelligence', icon: Brain },
        { id: 'ml', name: 'Machine Learning', icon: TrendingUp },
        { id: 'data-science', name: 'Data Science', icon: Database },
        { id: 'cybersecurity', name: 'Cybersecurity', icon: Shield },
        { id: 'web-dev', name: 'Web Dev', icon: Code },
        { id: 'mobile-dev', name: 'Mobile Dev', icon: Smartphone },
        { id: 'cloud', name: 'Cloud', icon: Cloud },
        { id: 'iot', name: 'IoT', icon: Wifi },
        { id: 'networks', name: 'Networks', icon: Network },
        { id: 'software-eng', name: 'Engineering', icon: Settings }
    ];

    const toggleDomain = (domainId) => {
        setSelectedDomains(prev =>
            prev.includes(domainId) ? prev.filter(d => d !== domainId) : [...prev, domainId]
        );
    };

    const handleDomainSelection = () => {
        if (selectedDomains.length > 0) setShowDomainSelector(false);
    };

    const microModules = [
        {
            id: 1,
            title: 'Introduction to AI',
            category: 'ai',
            duration: '10 mins',
            lessons: 6,
            completed: 3,
            difficulty: 'Beginner',
            points: 60,
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
            description: 'Learn the fundamentals of artificial intelligence'
        },
        {
            id: 2,
            title: 'Neural Networks Basics',
            category: 'ai',
            duration: '12 mins',
            lessons: 7,
            completed: 0,
            difficulty: 'Intermediate',
            points: 70,
            image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop',
            description: 'Understanding how neural networks work'
        },
        {
            id: 3,
            title: 'Python for Machine Learning',
            category: 'ml',
            duration: '15 mins',
            lessons: 8,
            completed: 5,
            difficulty: 'Intermediate',
            points: 80,
            image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop',
            description: 'Master Python libraries for machine learning'
        },
        {
            id: 4,
            title: 'Supervised Learning',
            category: 'ml',
            duration: '10 mins',
            lessons: 6,
            completed: 0,
            difficulty: 'Intermediate',
            points: 60,
            image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop',
            description: 'Learn about classification and regression'
        },
        {
            id: 5,
            title: 'Data Analysis with Pandas',
            category: 'data-science',
            duration: '12 mins',
            lessons: 7,
            completed: 2,
            difficulty: 'Beginner',
            points: 70,
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
            description: 'Master data manipulation with Pandas'
        },
        {
            id: 6,
            title: 'Data Visualization',
            category: 'data-science',
            duration: '10 mins',
            lessons: 6,
            completed: 0,
            difficulty: 'Beginner',
            points: 60,
            image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=400&h=250&fit=crop',
            description: 'Create stunning visualizations with Python'
        }
    ];

    const filteredModules = microModules.filter(module => {
        const domainMatch = selectedDomains.length === 0 || selectedDomains.includes(module.category);
        const categoryMatch = activeCategory === 'all' || module.category === activeCategory;
        return domainMatch && categoryMatch;
    });

    const calculateProgress = (completed, total) => Math.round((completed / total) * 100);

    return (
        <div className="micro-learning-page">
            {/* Domain Selection Modal */}
            {showDomainSelector && (
                <div className="domain-modal-overlay">
                    <div className="domain-modal-container">
                        <header className="modal-header">
                            <div className="header-top">
                                <h2>Choose Your Learning Domains</h2>
                                <button className="close-modal-btn" onClick={() => setShowDomainSelector(false)}>✕</button>
                            </div>
                            <p className="modal-subtitle">Select areas you want to focus on. We'll personalize your learning experience!</p>
                        </header>

                        <div className="domains-grid-layout">
                            {allDomains.map(domain => {
                                const isSelected = selectedDomains.includes(domain.id);
                                const DomainIcon = domain.icon;
                                return (
                                    <div
                                        key={domain.id}
                                        className={`domain-card-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => toggleDomain(domain.id)}
                                    >
                                        <div className="domain-icon-wrapper">
                                            <DomainIcon size={28} />
                                        </div>
                                        <h3 className="domain-title-text">{domain.name}</h3>
                                        <p className="domain-description-text">{domain.description}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <footer className="modal-footer">
                            <span className="skip-link-text" onClick={() => setShowDomainSelector(false)}>Skip for Now</span>
                            <Button
                                className="primary-modal-btn"
                                onClick={handleDomainSelection}
                                disabled={selectedDomains.length === 0}
                            >
                                Continue with {selectedDomains.length || ''} {selectedDomains.length === 1 ? 'Domain' : 'Domains'}
                            </Button>
                        </footer>
                    </div>
                </div>
            )}

            <div className="micro-learning-page-container">
                {/* Hero Header */}
                <header className="page-hero-section">
                    <h1 className="hero-main-title">Micro Learning</h1>
                    <p className="hero-sub-title">Learn new skills in bite-sized lessons</p>
                </header>

                {/* Stats Grid */}
                <div className="learning-stats-grid">
                    <div className="stat-box">
                        <span className="stat-number-val">{userProgress.completedModules}/{userProgress.totalModules}</span>
                        <span className="stat-label-text">Modules Completed</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-number-val">{userProgress.totalPoints}</span>
                        <span className="stat-label-text">Total Points Earned</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-number-val">{userProgress.learningStreak}</span>
                        <span className="stat-label-text">Day Learning Streak</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-number-val">{calculateProgress(userProgress.completedModules, userProgress.totalModules)}%</span>
                        <span className="stat-label-text">Overall Course Progress</span>
                    </div>
                </div>

                {/* Filter Chip Bar */}
                <div className="domain-filter-chips">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`filter-chip-item ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Courses Grid */}
                <div className="micro-courses-grid">
                    {filteredModules.map(module => {
                        const progress = calculateProgress(module.completed, module.lessons);
                        const isCompleted = module.completed === module.lessons;

                        return (
                            <div key={module.id} className="micro-course-card">
                                <div className="card-image-wrapper">
                                    <img src={module.image} alt={module.title} />
                                    {isCompleted && (
                                        <div className="course-completed-badge">
                                            <CheckCircle size={16} />
                                            <span>Completed</span>
                                        </div>
                                    )}
                                </div>

                                <div className="card-details-section">
                                    <div className="card-top-row">
                                        <span className={`difficulty-badge-pill ${module.difficulty.toLowerCase()}`}>
                                            {module.difficulty}
                                        </span>
                                    </div>

                                    <h3 className="card-course-title">{module.title}</h3>
                                    <p className="card-course-desc">{module.description}</p>

                                    <div className="card-metadata-row">
                                        <span>{module.lessons} lessons</span>
                                        <span>•</span>
                                        <span>{module.points} pts</span>
                                        <span>•</span>
                                        <span>{module.duration}</span>
                                    </div>

                                    {module.completed > 0 && (
                                        <div className="card-progress-wrapper">
                                            <div className="progress-bar-bg">
                                                <div
                                                    className="progress-bar-fill"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="progress-percentage-label">{progress}% complete</span>
                                        </div>
                                    )}

                                    <Link to={`/learning/${module.id}`} className="card-action-link">
                                        <Button className="card-primary-btn">
                                            {isCompleted ? 'Review Module' : module.completed > 0 ? 'Continue' : 'Start Learning'}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MicroLearning;
