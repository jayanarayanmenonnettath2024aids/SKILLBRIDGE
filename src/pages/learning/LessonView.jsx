import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, PlayCircle, Award, ChevronRight, ChevronLeft } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import '../../styles/MicroLearning.css';

const LessonView = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const [currentLesson, setCurrentLesson] = useState(0);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [showQuiz, setShowQuiz] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    // Module lessons data with YouTube videos
    const modulesData = {
        '1': {
            title: 'Introduction to AI',
            category: 'ai',
            totalLessons: 8,
            points: 80,
            lessons: [
                {
                    id: 0,
                    title: 'What is Artificial Intelligence?',
                    duration: '10 mins',
                    content: 'Discover the fundamentals of AI and how machines can learn, reason, and solve problems like humans.',
                    youtubeId: 'ad79nYk2keg',
                    keyPoints: [
                        'AI enables machines to simulate human intelligence',
                        'Includes learning, reasoning, and self-correction',
                        'Applications in healthcare, finance, and more',
                        'Foundation for modern technology innovation'
                    ]
                },
                {
                    id: 1,
                    title: 'History of AI',
                    duration: '8 mins',
                    content: 'Explore the evolution of AI from early concepts to modern breakthroughs.',
                    youtubeId: 'mJeNghZXtMo',
                    keyPoints: [
                        'Started in 1950s with Alan Turing',
                        'AI winters and breakthroughs',
                        'Deep learning revolution',
                        'Current state of AI technology'
                    ]
                },
                {
                    id: 2,
                    title: 'Types of AI',
                    duration: '7 mins',
                    content: 'Learn about different types of AI: Narrow AI, General AI, and Super AI.',
                    youtubeId: 'kWmX3pd1f10',
                    keyPoints: [
                        'Narrow AI: Specific task focused',
                        'General AI: Human-level intelligence',
                        'Super AI: Beyond human capabilities',
                        'Current AI is mostly narrow AI'
                    ]
                },
                {
                    id: 3,
                    title: 'AI Applications',
                    duration: '9 mins',
                    content: 'Discover real-world applications of AI in various industries.',
                    youtubeId: 'ukzFI9rgwfU',
                    keyPoints: [
                        'Healthcare: Diagnosis and drug discovery',
                        'Finance: Fraud detection and trading',
                        'Transportation: Self-driving cars',
                        'Entertainment: Recommendations and gaming'
                    ]
                },
                {
                    id: 4,
                    title: 'Machine Learning Basics',
                    duration: '11 mins',
                    content: 'Introduction to machine learning as a subset of AI.',
                    youtubeId: 'Gv9_4yMHFhI',
                    keyPoints: [
                        'ML enables computers to learn from data',
                        'Supervised vs Unsupervised learning',
                        'Training models with examples',
                        'Foundation of modern AI systems'
                    ]
                },
                {
                    id: 5,
                    title: 'Neural Networks Introduction',
                    duration: '10 mins',
                    content: 'Understanding the building blocks of deep learning.',
                    youtubeId: 'aircAruvnKk',
                    keyPoints: [
                        'Inspired by biological neural networks',
                        'Layers of connected nodes',
                        'Activation functions and weights',
                        'Backpropagation for learning'
                    ]
                },
                {
                    id: 6,
                    title: 'AI Ethics and Challenges',
                    duration: '8 mins',
                    content: 'Explore ethical considerations and challenges in AI development.',
                    youtubeId: 'AaAELh2XT9A',
                    keyPoints: [
                        'Bias in AI systems',
                        'Privacy and data security concerns',
                        'Job displacement worries',
                        'Need for responsible AI development'
                    ]
                },
                {
                    id: 7,
                    title: 'Future of AI',
                    duration: '9 mins',
                    content: 'What the future holds for artificial intelligence technology.',
                    youtubeId: 'Bw5lUil23YI',
                    keyPoints: [
                        'AGI development prospects',
                        'AI in everyday life',
                        'Quantum computing and AI',
                        'Human-AI collaboration'
                    ]
                }
            ]
        },
        '3': {
            title: 'Python for Machine Learning',
            category: 'ml',
            totalLessons: 8,
            points: 80,
            lessons: [
                {
                    id: 0,
                    title: 'Python Basics for ML',
                    duration: '12 mins',
                    content: 'Essential Python concepts needed for machine learning.',
                    youtubeId: 'rfscVS0vtbw',
                    keyPoints: [
                        'Variables and data types',
                        'Lists, tuples, and dictionaries',
                        'Functions and modules',
                        'Object-oriented programming basics'
                    ]
                },
                {
                    id: 1,
                    title: 'NumPy Fundamentals',
                    duration: '10 mins',
                    content: 'Learn NumPy for numerical computing in Python.',
                    youtubeId: 'QUT1VHiLmmI',
                    keyPoints: [
                        'Arrays and array operations',
                        'Broadcasting and vectorization',
                        'Mathematical functions',
                        'Array manipulation techniques'
                    ]
                },
                {
                    id: 2,
                    title: 'Pandas for Data Manipulation',
                    duration: '11 mins',
                    content: 'Master Pandas for data analysis and manipulation.',
                    youtubeId: 'vmEHCJofslg',
                    keyPoints: [
                        'DataFrames and Series',
                        'Reading and writing data',
                        'Data cleaning and preprocessing',
                        'Grouping and aggregation'
                    ]
                },
                {
                    id: 3,
                    title: 'Matplotlib Visualization',
                    duration: '9 mins',
                    content: 'Create stunning visualizations with Matplotlib.',
                    youtubeId: '3Xc3CA655Y4',
                    keyPoints: [
                        'Line plots and scatter plots',
                        'Bar charts and histograms',
                        'Customizing plots',
                        'Subplots and figures'
                    ]
                },
                {
                    id: 4,
                    title: 'Scikit-learn Basics',
                    duration: '13 mins',
                    content: 'Introduction to scikit-learn for machine learning.',
                    youtubeId: '0Lt9w-BxKFQ',
                    keyPoints: [
                        'Loading datasets',
                        'Training and testing models',
                        'Model evaluation metrics',
                        'Cross-validation techniques'
                    ]
                },
                {
                    id: 5,
                    title: 'Linear Regression',
                    duration: '10 mins',
                    content: 'Build your first machine learning model.',
                    youtubeId: 'CtsRRUddV2s',
                    keyPoints: [
                        'Understanding linear relationships',
                        'Fitting a line to data',
                        'Making predictions',
                        'Evaluating model performance'
                    ]
                },
                {
                    id: 6,
                    title: 'Classification Models',
                    duration: '11 mins',
                    content: 'Learn classification algorithms in machine learning.',
                    youtubeId: 'yIYKR4sgzI8',
                    keyPoints: [
                        'Logistic regression basics',
                        'Decision trees',
                        'Random forests',
                        'Model comparison'
                    ]
                },
                {
                    id: 7,
                    title: 'Model Evaluation',
                    duration: '9 mins',
                    content: 'Evaluate and improve your ML models.',
                    youtubeId: 'LbX4X71-TFI',
                    keyPoints: [
                        'Accuracy, precision, and recall',
                        'Confusion matrix',
                        'ROC curves and AUC',
                        'Overfitting and underfitting'
                    ]
                }
            ]
        },
        '9': {
            title: 'HTML & CSS Fundamentals',
            category: 'web-dev',
            totalLessons: 8,
            points: 80,
            lessons: [
                {
                    id: 0,
                    title: 'HTML Basics',
                    duration: '8 mins',
                    content: 'Learn the building blocks of web pages with HTML.',
                    youtubeId: 'qz0aGYrrlhU',
                    keyPoints: [
                        'HTML structure and syntax',
                        'Common HTML tags',
                        'Headings, paragraphs, and lists',
                        'Links and images'
                    ]
                },
                {
                    id: 1,
                    title: 'HTML Forms',
                    duration: '10 mins',
                    content: 'Create interactive forms with HTML.',
                    youtubeId: 'fNcJuPIZ2WE',
                    keyPoints: [
                        'Form elements and inputs',
                        'Text fields and passwords',
                        'Radio buttons and checkboxes',
                        'Form validation'
                    ]
                },
                {
                    id: 2,
                    title: 'CSS Fundamentals',
                    duration: '12 mins',
                    content: 'Style your web pages with CSS.',
                    youtubeId: '1PnVor36_40',
                    keyPoints: [
                        'CSS syntax and selectors',
                        'Colors and backgrounds',
                        'Text styling and fonts',
                        'Box model basics'
                    ]
                },
                {
                    id: 3,
                    title: 'CSS Flexbox',
                    duration: '11 mins',
                    content: 'Master modern layouts with Flexbox.',
                    youtubeId: 'fYq5PXgSsbE',
                    keyPoints: [
                        'Flex container and items',
                        'Alignment and justification',
                        'Flex direction and wrap',
                        'Building responsive layouts'
                    ]
                },
                {
                    id: 4,
                    title: 'CSS Grid',
                    duration: '13 mins',
                    content: 'Create complex layouts with CSS Grid.',
                    youtubeId: 'EiNiSFIPIQE',
                    keyPoints: [
                        'Grid template rows and columns',
                        'Grid areas and placement',
                        'Gap and alignment',
                        'Responsive grid layouts'
                    ]
                },
                {
                    id: 5,
                    title: 'Responsive Design',
                    duration: '10 mins',
                    content: 'Make your websites work on all devices.',
                    youtubeId: 'srvUrASNj0s',
                    keyPoints: [
                        'Media queries',
                        'Mobile-first approach',
                        'Viewport meta tag',
                        'Responsive images'
                    ]
                },
                {
                    id: 6,
                    title: 'CSS Animations',
                    duration: '9 mins',
                    content: 'Add life to your web pages with animations.',
                    youtubeId: 'HZHHBwzmJLk',
                    keyPoints: [
                        'Transitions and transforms',
                        'Keyframe animations',
                        'Animation properties',
                        'Best practices'
                    ]
                },
                {
                    id: 7,
                    title: 'Modern CSS',
                    duration: '11 mins',
                    content: 'Explore modern CSS features and techniques.',
                    youtubeId: 'qm0IfG1GyZU',
                    keyPoints: [
                        'CSS variables',
                        'Custom properties',
                        'CSS functions',
                        'Future of CSS'
                    ]
                }
            ]
        },
        '7': {
            title: 'Network Security Fundamentals',
            category: 'cybersecurity',
            totalLessons: 8,
            points: 80,
            lessons: [
                {
                    id: 0,
                    title: 'Introduction to Cybersecurity',
                    duration: '9 mins',
                    content: 'Understanding the basics of cybersecurity and its importance.',
                    youtubeId: 'inWWhr5tnEA',
                    keyPoints: [
                        'CIA triad: Confidentiality, Integrity, Availability',
                        'Common security threats',
                        'Security principles',
                        'Career paths in cybersecurity'
                    ]
                },
                {
                    id: 1,
                    title: 'Network Security Basics',
                    duration: '11 mins',
                    content: 'Learn how to protect computer networks from attacks.',
                    youtubeId: 'SDpCzJw9xm4',
                    keyPoints: [
                        'Firewalls and IDS/IPS',
                        'VPNs and encryption',
                        'Network segmentation',
                        'Access control'
                    ]
                },
                {
                    id: 2,
                    title: 'Cryptography Fundamentals',
                    duration: '10 mins',
                    content: 'Understanding encryption and cryptographic protocols.',
                    youtubeId: 'jhXCTbFnK8o',
                    keyPoints: [
                        'Symmetric vs asymmetric encryption',
                        'Hash functions',
                        'Digital signatures',
                        'SSL/TLS protocols'
                    ]
                },
                {
                    id: 3,
                    title: 'Common Cyber Attacks',
                    duration: '12 mins',
                    content: 'Identify and understand common types of cyber attacks.',
                    youtubeId: 'Dk-ZqQ-bfy4',
                    keyPoints: [
                        'Phishing and social engineering',
                        'Malware and ransomware',
                        'DDoS attacks',
                        'SQL injection and XSS'
                    ]
                },
                {
                    id: 4,
                    title: 'Password Security',
                    duration: '8 mins',
                    content: 'Best practices for creating and managing passwords.',
                    youtubeId: '7U-RbOKanYs',
                    keyPoints: [
                        'Strong password creation',
                        'Password managers',
                        'Two-factor authentication',
                        'Password policies'
                    ]
                },
                {
                    id: 5,
                    title: 'Web Application Security',
                    duration: '11 mins',
                    content: 'Securing web applications from vulnerabilities.',
                    youtubeId: 'gkMl1suyj3M',
                    keyPoints: [
                        'OWASP Top 10',
                        'Input validation',
                        'Session management',
                        'Secure coding practices'
                    ]
                },
                {
                    id: 6,
                    title: 'Security Tools',
                    duration: '10 mins',
                    content: 'Essential tools for cybersecurity professionals.',
                    youtubeId: 'UbxRf_9Rcmg',
                    keyPoints: [
                        'Wireshark for packet analysis',
                        'Nmap for network scanning',
                        'Metasploit basics',
                        'Security monitoring tools'
                    ]
                },
                {
                    id: 7,
                    title: 'Security Best Practices',
                    duration: '9 mins',
                    content: 'Implementing security in your organization.',
                    youtubeId: 'PO78aJs6l1E',
                    keyPoints: [
                        'Security policies and procedures',
                        'Employee training',
                        'Incident response',
                        'Regular security audits'
                    ]
                }
            ]
        },
        '14': {
            title: 'AWS Cloud Basics',
            category: 'cloud',
            totalLessons: 8,
            points: 80,
            lessons: [
                {
                    id: 0,
                    title: 'Introduction to Cloud Computing',
                    duration: '10 mins',
                    content: 'Understanding cloud computing and its benefits.',
                    youtubeId: 'M988_fsOSWo',
                    keyPoints: [
                        'What is cloud computing?',
                        'IaaS, PaaS, and SaaS',
                        'Public vs private cloud',
                        'Benefits of cloud'
                    ]
                },
                {
                    id: 1,
                    title: 'AWS Overview',
                    duration: '11 mins',
                    content: 'Introduction to Amazon Web Services platform.',
                    youtubeId: 'a9__D53WsUs',
                    keyPoints: [
                        'AWS global infrastructure',
                        'Core AWS services',
                        'AWS pricing model',
                        'AWS account setup'
                    ]
                },
                {
                    id: 2,
                    title: 'EC2 Instances',
                    duration: '12 mins',
                    content: 'Learn about AWS Elastic Compute Cloud.',
                    youtubeId: 'iHX-jtKIVNA',
                    keyPoints: [
                        'Instance types and sizes',
                        'AMIs and snapshots',
                        'Security groups',
                        'Instance lifecycle'
                    ]
                },
                {
                    id: 3,
                    title: 'S3 Storage',
                    duration: '9 mins',
                    content: 'Master AWS Simple Storage Service.',
                    youtubeId: 'e6w9LwZJFIA',
                    keyPoints: [
                        'Buckets and objects',
                        'Storage classes',
                        'Versioning and lifecycle',
                        'Access control'
                    ]
                },
                {
                    id: 4,
                    title: 'AWS Networking',
                    duration: '11 mins',
                    content: 'Understanding VPC and networking in AWS.',
                    youtubeId: 'hiKPPy584Mg',
                    keyPoints: [
                        'VPC basics',
                        'Subnets and route tables',
                        'Internet and NAT gateways',
                        'Load balancers'
                    ]
                },
                {
                    id: 5,
                    title: 'AWS Databases',
                    duration: '10 mins',
                    content: 'Explore AWS database services.',
                    youtubeId: 'eMzCI7S05bo',
                    keyPoints: [
                        'RDS for relational databases',
                        'DynamoDB for NoSQL',
                        'Aurora and ElastiCache',
                        'Database backups'
                    ]
                },
                {
                    id: 6,
                    title: 'AWS IAM',
                    duration: '9 mins',
                    content: 'Secure your AWS resources with IAM.',
                    youtubeId: 'ExjW3HCFVGA',
                    keyPoints: [
                        'Users, groups, and roles',
                        'Policies and permissions',
                        'MFA and best practices',
                        'Root account security'
                    ]
                },
                {
                    id: 7,
                    title: 'AWS Lambda',
                    duration: '11 mins',
                    content: 'Serverless computing with AWS Lambda.',
                    youtubeId: 'eOBq__h4OJ4',
                    keyPoints: [
                        'Function as a Service',
                        'Event-driven architecture',
                        'Lambda triggers',
                        'Cost optimization'
                    ]
                }
            ]
        }
    };

    // Get module data or use default
    const module = modulesData[moduleId] || {
        title: 'Course Module',
        totalLessons: 0,
        points: 0,
        lessons: []
    };

    const lesson = module.lessons[currentLesson] || {};
    const isLastLesson = currentLesson === module.lessons.length - 1;
    const isFirstLesson = currentLesson === 0;

    const handleCompleteLesson = () => {
        if (!completedLessons.includes(currentLesson)) {
            setCompletedLessons([...completedLessons, currentLesson]);
        }

        if (lesson.isQuiz) {
            setShowQuiz(true);
        } else if (!isLastLesson) {
            setCurrentLesson(currentLesson + 1);
            setShowQuiz(false);
            setSelectedAnswer(null);
            setQuizSubmitted(false);
        }
    };

    const handleQuizSubmit = () => {
        setQuizSubmitted(true);
        if (selectedAnswer === lesson.quiz.correctAnswer) {
            setTimeout(() => {
                if (!isLastLesson) {
                    setCurrentLesson(currentLesson + 1);
                    setShowQuiz(false);
                    setSelectedAnswer(null);
                    setQuizSubmitted(false);
                }
            }, 2000);
        }
    };

    const handlePrevious = () => {
        if (!isFirstLesson) {
            setCurrentLesson(currentLesson - 1);
            setShowQuiz(false);
            setSelectedAnswer(null);
            setQuizSubmitted(false);
        }
    };

    const isCorrectAnswer = selectedAnswer === lesson.quiz?.correctAnswer;
    const allLessonsCompleted = completedLessons.length === module.lessons.length;

    return (
        <div className="container lesson-view-container">
            {/* Header */}
            <div className="lesson-header">
                <Link to="/learning" className="back-button">
                    <ArrowLeft size={20} />
                    <span>Back to Modules</span>
                </Link>
                <h2 className="module-title-header">{module.title}</h2>
            </div>

            {/* Progress Bar */}
            <div className="lesson-progress-bar">
                {module.lessons.map((l, index) => (
                    <div
                        key={index}
                        className={`progress-step ${index === currentLesson ? 'active' : ''} ${completedLessons.includes(index) ? 'completed' : ''}`}
                        onClick={() => {
                            setCurrentLesson(index);
                            setShowQuiz(false);
                            setSelectedAnswer(null);
                            setQuizSubmitted(false);
                        }}
                    >
                        {completedLessons.includes(index) ? (
                            <CheckCircle size={20} />
                        ) : (
                            <span>{index + 1}</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Lesson Content */}
            <div className="lesson-content-wrapper">
                <Card className="lesson-card">
                    {/* Lesson Header */}
                    <div className="lesson-card-header">
                        <div>
                            <span className="lesson-number">Lesson {currentLesson + 1} of {module.lessons.length}</span>
                            <h1 className="lesson-title">{lesson.title}</h1>
                        </div>
                        <span className="lesson-duration">{lesson.duration}</span>
                    </div>

                    {/* Video/Content Area */}
                    {!lesson.isQuiz ? (
                        <>
                            <div className="video-container">
                                {lesson.youtubeId ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${lesson.youtubeId}`}
                                        title={lesson.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div className="video-placeholder">
                                        <PlayCircle size={64} />
                                        <p>Video not available</p>
                                    </div>
                                )}
                            </div>

                            <div className="lesson-text-content">
                                <p>{lesson.content}</p>

                                <h3 className="key-points-title">Key Points:</h3>
                                <ul className="key-points-list">
                                    {lesson.keyPoints && lesson.keyPoints.map((point, idx) => (
                                        <li key={idx}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <div className="quiz-content">
                            <div className="quiz-icon">
                                <Award size={48} style={{ color: 'var(--color-accent)' }} />
                            </div>
                            <h2 className="quiz-title">Knowledge Check</h2>
                            <p className="quiz-question">{lesson.quiz.question}</p>

                            <div className="quiz-options">
                                {lesson.quiz.options.map((option, idx) => {
                                    const isSelected = selectedAnswer === idx;
                                    const showResult = quizSubmitted;
                                    const isCorrect = idx === lesson.quiz.correctAnswer;

                                    return (
                                        <button
                                            key={idx}
                                            className={`quiz-option ${isSelected ? 'selected' : ''} ${showResult && isCorrect ? 'correct' : ''} ${showResult && isSelected && !isCorrect ? 'incorrect' : ''}`}
                                            onClick={() => !quizSubmitted && setSelectedAnswer(idx)}
                                            disabled={quizSubmitted}
                                        >
                                            <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                                            <span className="option-text">{option}</span>
                                            {showResult && isCorrect && <CheckCircle size={20} />}
                                        </button>
                                    );
                                })}
                            </div>

                            {quizSubmitted && (
                                <div className={`quiz-feedback ${isCorrectAnswer ? 'correct' : 'incorrect'}`}>
                                    <h4>{isCorrectAnswer ? '🎉 Correct!' : '❌ Incorrect'}</h4>
                                    <p>{lesson.quiz.explanation}</p>
                                </div>
                            )}

                            {!quizSubmitted && (
                                <Button
                                    onClick={handleQuizSubmit}
                                    disabled={selectedAnswer === null}
                                    className="submit-quiz-btn"
                                >
                                    Submit Answer
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="lesson-navigation">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={isFirstLesson}
                        >
                            <ChevronLeft size={20} />
                            Previous
                        </Button>

                        {!lesson.isQuiz && (
                            <Button onClick={handleCompleteLesson}>
                                {isLastLesson ? 'Complete Module' : 'Next Lesson'}
                                <ChevronRight size={20} />
                            </Button>
                        )}

                        {lesson.isQuiz && quizSubmitted && isCorrectAnswer && (
                            <Button onClick={handleCompleteLesson}>
                                {isLastLesson ? 'Complete Module' : 'Continue'}
                                <ChevronRight size={20} />
                            </Button>
                        )}
                    </div>
                </Card>

                {/* Completion Card */}
                {allLessonsCompleted && isLastLesson && (
                    <Card className="completion-card">
                        <div className="completion-icon">
                            <CheckCircle size={64} style={{ color: 'var(--color-success)' }} />
                        </div>
                        <h2>Module Completed! 🎉</h2>
                        <p>You've earned <strong>{module.points} points</strong></p>
                        <div className="completion-actions">
                            <Link to="/learning">
                                <Button variant="primary">Back to Modules</Button>
                            </Link>
                            <Button variant="outline" onClick={() => {
                                setCurrentLesson(0);
                                setCompletedLessons([]);
                            }}>
                                Review Module
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default LessonView;
