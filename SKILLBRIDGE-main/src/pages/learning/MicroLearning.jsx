import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, CheckCircle, PlayCircle, Star, Brain, Database, Shield, Code, Smartphone, Cloud, Wifi, Network, Settings } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import '../../styles/MicroLearning.css';

const MicroLearning = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [showDomainSelector, setShowDomainSelector] = useState(true);
    const [selectedDomains, setSelectedDomains] = useState([]);
    const [userProgress, setUserProgress] = useState({
        completedModules: 15,
        totalModules: 22,
        learningStreak: 7,
        totalPoints: 1050
    });

    const allDomains = [
        { 
            id: 'ai', 
            name: 'Artificial Intelligence (AI)', 
            icon: '🤖',
            color: '#3B82F6',
            description: 'Building smart systems that can learn and make decisions'
        },
        { 
            id: 'ml', 
            name: 'Machine Learning (ML)', 
            icon: '🧠',
            color: '#8B5CF6',
            description: 'Algorithms that learn from data'
        },
        { 
            id: 'data-science', 
            name: 'Data Science', 
            icon: '📊',
            color: '#10B981',
            description: 'Extracting insights from large datasets'
        },
        { 
            id: 'cybersecurity', 
            name: 'Cybersecurity', 
            icon: '🔒',
            color: '#EF4444',
            description: 'Protecting systems and data from attacks'
        },
        { 
            id: 'web-dev', 
            name: 'Web Development', 
            icon: '🌐',
            color: '#F59E0B',
            description: 'Creating websites and web applications'
        },
        { 
            id: 'mobile-dev', 
            name: 'Mobile App Development', 
            icon: '📱',
            color: '#EC4899',
            description: 'Building Android and iOS applications'
        },
        { 
            id: 'cloud', 
            name: 'Cloud Computing', 
            icon: '☁️',
            color: '#06B6D4',
            description: 'Using remote servers and cloud services'
        },
        { 
            id: 'iot', 
            name: 'Internet of Things (IoT)', 
            icon: '🔌',
            color: '#F97316',
            description: 'Connecting physical devices to the internet'
        },
        { 
            id: 'networks', 
            name: 'Computer Networks', 
            icon: '🌐',
            color: '#6366F1',
            description: 'Communication between computers and systems'
        },
        { 
            id: 'software-eng', 
            name: 'Software Engineering', 
            icon: '💻',
            color: '#14B8A6',
            description: 'Designing and developing software systems'
        }
    ];

    const categories = [
        { id: 'all', name: 'All Courses', icon: BookOpen },
        { id: 'ai', name: 'Artificial Intelligence', icon: Brain },
        { id: 'ml', name: 'Machine Learning', icon: TrendingUp },
        { id: 'data-science', name: 'Data Science', icon: Database },
        { id: 'cybersecurity', name: 'Cybersecurity', icon: Shield },
        { id: 'web-dev', name: 'Web Development', icon: Code },
        { id: 'mobile-dev', name: 'Mobile Development', icon: Smartphone },
        { id: 'cloud', name: 'Cloud Computing', icon: Cloud },
        { id: 'iot', name: 'IoT', icon: Wifi },
        { id: 'networks', name: 'Networks', icon: Network },
        { id: 'software-eng', name: 'Software Engineering', icon: Settings }
    ];

    const toggleDomain = (domainId) => {
        if (selectedDomains.includes(domainId)) {
            setSelectedDomains(selectedDomains.filter(d => d !== domainId));
        } else {
            setSelectedDomains([...selectedDomains, domainId]);
        }
    };

    const handleDomainSelection = () => {
        if (selectedDomains.length > 0) {
            setShowDomainSelector(false);
        }
    };

    const handleSkipDomainSelection = () => {
        setShowDomainSelector(false);
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
            image: 'https://placehold.co/400x250/3b82f6/1e3a8a?text=Intro+to+AI',
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
            image: 'https://placehold.co/400x250/3b82f6/1e3a8a?text=Neural+Networks',
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
            image: 'https://placehold.co/400x250/8b5cf6/5b21b6?text=Python+ML',
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
            image: 'https://placehold.co/400x250/8b5cf6/5b21b6?text=Supervised+Learning',
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
            image: 'https://placehold.co/400x250/10b981/065f46?text=Pandas',
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
            image: 'https://placehold.co/400x250/10b981/065f46?text=Data+Viz',
            description: 'Create stunning visualizations with Python'
        },
        {
            id: 7,
            title: 'Network Security Fundamentals',
            category: 'cybersecurity',
            duration: '11 mins',
            lessons: 6,
            completed: 0,
            difficulty: 'Beginner',
            points: 60,
            image: 'https://placehold.co/400x250/ef4444/991b1b?text=Network+Security',
            description: 'Learn how to protect networks from attacks'
        },
        {
            id: 8,
            title: 'Ethical Hacking Basics',
            category: 'cybersecurity',
            duration: '14 mins',
            lessons: 8,
            completed: 0,
            difficulty: 'Advanced',
            points: 80,
            image: 'https://placehold.co/400x250/ef4444/991b1b?text=Ethical+Hacking',
            description: 'Introduction to penetration testing'
        },
        {
            id: 9,
            title: 'HTML & CSS Fundamentals',
            category: 'web-dev',
            duration: '10 mins',
            lessons: 6,
            completed: 4,
            difficulty: 'Beginner',
            points: 60,
            image: 'https://placehold.co/400x250/f59e0b/92400e?text=HTML+CSS',
            description: 'Build your first web page from scratch'
        },
        {
            id: 10,
            title: 'JavaScript Essentials',
            category: 'web-dev',
            duration: '12 mins',
            lessons: 7,
            completed: 0,
            difficulty: 'Beginner',
            points: 70,
            image: 'https://placehold.co/400x250/f59e0b/92400e?text=JavaScript',
            description: 'Learn JavaScript programming basics'
        },
        {
            id: 11,
            title: 'React for Beginners',
            category: 'web-dev',
            duration: '15 mins',
            lessons: 8,
            completed: 0,
            difficulty: 'Intermediate',
            points: 80,
            image: 'https://placehold.co/400x250/f59e0b/92400e?text=React',
            description: 'Build modern web apps with React'
        },
        {
            id: 12,
            title: 'Android Development Basics',
            category: 'mobile-dev',
            duration: '13 mins',
            lessons: 7,
            completed: 0,
            difficulty: 'Intermediate',
            points: 70,
            image: 'https://placehold.co/400x250/ec4899/9f1239?text=Android+Dev',
            description: 'Create your first Android application'
        },
        {
            id: 13,
            title: 'iOS App Development',
            category: 'mobile-dev',
            duration: '14 mins',
            lessons: 8,
            completed: 0,
            difficulty: 'Intermediate',
            points: 80,
            image: 'https://placehold.co/400x250/ec4899/9f1239?text=iOS+Dev',
            description: 'Build apps for iPhone and iPad'
        },
        {
            id: 14,
            title: 'AWS Cloud Basics',
            category: 'cloud',
            duration: '11 mins',
            lessons: 6,
            completed: 0,
            difficulty: 'Beginner',
            points: 60,
            image: 'https://placehold.co/400x250/06b6d4/075985?text=AWS+Cloud',
            description: 'Introduction to Amazon Web Services'
        },
        {
            id: 15,
            title: 'Docker and Containers',
            category: 'cloud',
            duration: '12 mins',
            lessons: 7,
            completed: 0,
            difficulty: 'Intermediate',
            points: 70,
            image: 'https://placehold.co/400x250/06b6d4/075985?text=Docker',
            description: 'Learn containerization with Docker'
        },
        {
            id: 16,
            title: 'IoT with Arduino',
            category: 'iot',
            duration: '13 mins',
            lessons: 7,
            completed: 0,
            difficulty: 'Beginner',
            points: 70,
            image: 'https://placehold.co/400x250/f97316/9a3412?text=Arduino+IoT',
            description: 'Build IoT projects with Arduino boards'
        },
        {
            id: 17,
            title: 'Raspberry Pi Projects',
            category: 'iot',
            duration: '14 mins',
            lessons: 8,
            completed: 0,
            difficulty: 'Intermediate',
            points: 80,
            image: 'https://placehold.co/400x250/f97316/9a3412?text=Raspberry+Pi',
            description: 'Create smart home devices with Raspberry Pi'
        },
        {
            id: 18,
            title: 'TCP/IP Networking',
            category: 'networks',
            duration: '10 mins',
            lessons: 6,
            completed: 0,
            difficulty: 'Beginner',
            points: 60,
            image: 'https://placehold.co/400x250/6366f1/4338ca?text=TCP+IP',
            description: 'Understanding internet protocols'
        },
        {
            id: 19,
            title: 'Network Configuration',
            category: 'networks',
            duration: '12 mins',
            lessons: 7,
            completed: 0,
            difficulty: 'Intermediate',
            points: 70,
            image: 'https://placehold.co/400x250/6366f1/4338ca?text=Network+Config',
            description: 'Setup and configure computer networks'
        },
        {
            id: 20,
            title: 'Software Design Patterns',
            category: 'software-eng',
            duration: '13 mins',
            lessons: 7,
            completed: 1,
            difficulty: 'Intermediate',
            points: 70,
            image: 'https://placehold.co/400x250/14b8a6/0f766e?text=Design+Patterns',
            description: 'Learn common software design patterns'
        },
        {
            id: 21,
            title: 'Agile Development',
            category: 'software-eng',
            duration: '10 mins',
            lessons: 6,
            completed: 0,
            difficulty: 'Beginner',
            points: 60,
            image: 'https://placehold.co/400x250/14b8a6/0f766e?text=Agile',
            description: 'Master Agile software development methods'
        },
        {
            id: 22,
            title: 'Git Version Control',
            category: 'software-eng',
            duration: '11 mins',
            lessons: 6,
            completed: 0,
            difficulty: 'Beginner',
            points: 60,
            image: 'https://placehold.co/400x250/14b8a6/0f766e?text=Git',
            description: 'Learn version control with Git and GitHub'
        }
    ];

    // Filter modules based on selected domains and active category
    const filteredModules = microModules.filter(module => {
        // If domains are selected, filter by domains
        const domainMatch = selectedDomains.length === 0 || selectedDomains.includes(module.category);
        
        // Filter by active category
        const categoryMatch = activeCategory === 'all' || module.category === activeCategory;
        
        return domainMatch && categoryMatch;
    });

    const calculateProgress = (completed, total) => {
        return Math.round((completed / total) * 100);
    };

    return (
        <div className="container micro-learning-container">
            {/* Domain Selection Modal */}
            {showDomainSelector && (
                <div className="domain-selector-overlay">
                    <Card className="domain-selector-modal">
                        <div className="modal-header">
                            <BookOpen size={48} style={{ color: 'var(--color-primary)' }} />
                            <h2>Choose Your Learning Domains</h2>
                            <p>Select areas you want to focus on. We'll personalize your learning experience!</p>
                        </div>

                        <div className="domains-selection-grid">
                            {allDomains.map(domain => {
                                const isSelected = selectedDomains.includes(domain.id);
                                return (
                                    <div
                                        key={domain.id}
                                        className={`domain-selection-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => toggleDomain(domain.id)}
                                        style={{ '--domain-color': domain.color }}
                                    >
                                        {isSelected && (
                                            <div className="domain-check-badge">
                                                <CheckCircle size={20} />
                                            </div>
                                        )}
                                        <div className="domain-icon-large">{domain.icon}</div>
                                        <h3>{domain.name}</h3>
                                        <p>{domain.description}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {selectedDomains.length > 0 && (
                            <div className="selected-domains-info">
                                <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
                                <span>You've selected {selectedDomains.length} {selectedDomains.length === 1 ? 'domain' : 'domains'}</span>
                            </div>
                        )}

                        <div className="modal-actions">
                            <Button variant="outline" onClick={handleSkipDomainSelection}>
                                Skip for Now
                            </Button>
                            <Button 
                                variant="primary" 
                                onClick={handleDomainSelection}
                                disabled={selectedDomains.length === 0}
                            >
                                Continue with {selectedDomains.length > 0 ? selectedDomains.length : ''} {selectedDomains.length === 1 ? 'Domain' : 'Domains'}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Header Section */}
            <div className="learning-header">
                <div>
                    <h1 className="page-title">Micro Learning</h1>
                    <p className="page-subtitle">
                        {selectedDomains.length > 0 
                            ? `Showing courses for ${selectedDomains.length} selected ${selectedDomains.length === 1 ? 'domain' : 'domains'} • ${filteredModules.length} ${filteredModules.length === 1 ? 'module' : 'modules'} available`
                            : 'Master new skills in bite-sized lessons - anywhere, anytime'
                        }
                    </p>
                </div>
                {selectedDomains.length > 0 && !showDomainSelector && (
                    <Button variant="outline" size="sm" onClick={() => setShowDomainSelector(true)}>
                        <Settings size={18} />
                        Change Domains
                    </Button>
                )}
            </div>

            {/* Stats Dashboard */}
            <div className="stats-grid">
                <Card className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--color-primary)', opacity: 0.1 }}>
                        <BookOpen size={24} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{userProgress.completedModules}/{filteredModules.length > 0 ? filteredModules.length : userProgress.totalModules}</span>
                        <span className="stat-label">Modules {selectedDomains.length > 0 ? 'Available' : 'Completed'}</span>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-icon" style={{ background: '#F59E0B', opacity: 0.1 }}>
                        <Award size={24} style={{ color: '#F59E0B' }} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{userProgress.totalPoints}</span>
                        <span className="stat-label">Total Points</span>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-icon" style={{ background: '#10B981', opacity: 0.1 }}>
                        <TrendingUp size={24} style={{ color: '#10B981' }} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{userProgress.learningStreak} Days</span>
                        <span className="stat-label">Learning Streak</span>
                    </div>
                </Card>

                <Card className="stat-card">
                    <div className="stat-icon" style={{ background: '#8B5CF6', opacity: 0.1 }}>
                        <CheckCircle size={24} style={{ color: '#8B5CF6' }} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{calculateProgress(userProgress.completedModules, userProgress.totalModules)}%</span>
                        <span className="stat-label">Overall Progress</span>
                    </div>
                </Card>
            </div>

            {/* Selected Domains Display */}
            {selectedDomains.length > 0 && (
                <div className="selected-domains-container">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--color-text-primary)' }}>
                        Selected Domains:
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedDomains.map(domainId => {
                            const domain = allDomains.find(d => d.id === domainId);
                            return domain ? (
                                <span 
                                    key={domainId}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        background: 'var(--color-primary)',
                                        color: 'white',
                                        borderRadius: '20px',
                                        fontSize: '0.875rem',
                                        fontWeight: '500'
                                    }}
                                >
                                    <domain.icon size={16} />
                                    {domain.name}
                                </span>
                            ) : null;
                        })}
                    </div>
                </div>
            )}

            {/* Category Filter */}
            <div className="category-filter">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        <cat.icon size={18} />
                        <span>{cat.name}</span>
                    </button>
                ))}
            </div>

            {/* Modules Grid */}
            <div className="modules-grid">
                {filteredModules.map(module => {
                    const progress = calculateProgress(module.completed, module.lessons);
                    const isCompleted = module.completed === module.lessons;

                    return (
                        <Card key={module.id} className="module-card">
                            <div className="module-image">
                                <img src={module.image} alt={module.title} />
                                {isCompleted && (
                                    <div className="completed-badge">
                                        <CheckCircle size={20} />
                                        <span>Completed</span>
                                    </div>
                                )}
                            </div>

                            <div className="module-content">
                                <div className="module-header">
                                    <span className={`difficulty-badge ${module.difficulty.toLowerCase()}`}>
                                        {module.difficulty}
                                    </span>
                                    <div className="module-meta">
                                        <Clock size={14} />
                                        <span>{module.duration}</span>
                                    </div>
                                </div>

                                <h3 className="module-title">{module.title}</h3>
                                <p className="module-description">{module.description}</p>

                                <div className="module-info">
                                    <span className="lesson-count">
                                        <PlayCircle size={16} />
                                        {module.lessons} lessons
                                    </span>
                                    <span className="points-badge">
                                        <Award size={16} />
                                        {module.points} pts
                                    </span>
                                </div>

                                {module.completed > 0 && (
                                    <div className="progress-section">
                                        <div className="progress-info">
                                            <span className="progress-text">
                                                {module.completed}/{module.lessons} lessons
                                            </span>
                                            <span className="progress-percentage">{progress}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill" 
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                <Link to={`/learning/${module.id}`} className="full-width-link">
                                    <Button 
                                        variant={isCompleted ? 'outline' : 'primary'} 
                                        className="w-full"
                                    >
                                        {isCompleted ? 'Review Module' : module.completed > 0 ? 'Continue Learning' : 'Start Learning'}
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default MicroLearning;
