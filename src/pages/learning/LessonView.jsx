import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, PlayCircle, Award, ChevronRight, ChevronLeft, Clock, Zap } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import '../../styles/LessonView.css';

const LessonView = () => {
    const { moduleId } = useParams();
    const [currentLesson, setCurrentLesson] = useState(0);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    // Module lessons data with YouTube videos (Retained existing data)
    const modulesData = {
        '1': {
            title: 'Introduction to AI',
            category: 'ai',
            difficulty: 'Beginner',
            totalLessons: 8,
            points: 80,
            lessons: [
                {
                    id: 0,
                    title: 'What is Artificial Intelligence?',
                    duration: '10 mins',
                    content: 'Discover the fundamentals of AI and how machines can learn, reason, and solve problems like humans. Artificial Intelligence is transforming how we interact with technology, making systems more autonomous and capable of handling complex cognitive tasks.',
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
                    content: 'Explore the evolution of AI from early concepts to modern breakthroughs. The journey of AI began with simple logic machines and has evolved into the sophisticated neural networks we see today.',
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
            difficulty: 'Intermediate',
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
                }
                // ... other intermediate data as requested/retained
            ]
        }
    };

    // Get module data or use default
    const module = modulesData[moduleId] || {
        title: 'Course Module',
        difficulty: 'Beginner',
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
            // Quiz already displayed
        } else if (!isLastLesson) {
            setCurrentLesson(currentLesson + 1);
            setSelectedAnswer(null);
            setQuizSubmitted(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleQuizSubmit = () => {
        setQuizSubmitted(true);
        if (selectedAnswer === lesson.quiz.correctAnswer) {
            setTimeout(() => {
                if (!isLastLesson) {
                    setCurrentLesson(currentLesson + 1);
                    setSelectedAnswer(null);
                    setQuizSubmitted(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 2000);
        }
    };

    const handlePrevious = () => {
        if (!isFirstLesson) {
            setCurrentLesson(currentLesson - 1);
            setSelectedAnswer(null);
            setQuizSubmitted(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const isCorrectAnswer = selectedAnswer === lesson.quiz?.correctAnswer;
    const allLessonsCompleted = completedLessons.length === module.lessons.length;
    const progressPercentage = ((currentLesson + 1) / module.lessons.length) * 100;

    return (
        <div className="lesson-view-page">
            <div className="lesson-view-container">
                {/* 1. Header Section */}
                <nav className="lesson-top-nav">
                    <Link to="/learning" className="back-link">
                        <ArrowLeft size={16} />
                        Back to Modules
                    </Link>
                    <h1 className="course-main-title">{module.title}</h1>
                </nav>

                {/* 2. Progress Section */}
                <div className="lesson-progress-section">
                    <div className="progress-info-row">
                        <span className="progress-label">Lesson {currentLesson + 1} of {module.lessons.length}</span>
                    </div>
                    <div className="lesson-progress-bar-bg">
                        <div
                            className="lesson-progress-fill"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* 3. Title Block */}
                <div className="lesson-title-block">
                    <h2 className="current-lesson-title">{lesson.title}</h2>
                    <div className="lesson-meta-info">
                        <span className="meta-item">
                            <Clock size={14} />
                            {lesson.duration}
                        </span>
                        <span className="meta-separator">•</span>
                        <span className="meta-item">
                            <Zap size={14} />
                            {module.difficulty}
                        </span>
                    </div>
                </div>

                {/* 4. Video Player Section */}
                <div className="lesson-video-frame">
                    {lesson.youtubeId ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${lesson.youtubeId}?rel=0&modestbranding=1`}
                            title={lesson.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="video-placeholder-card">
                            <PlayCircle size={48} />
                            <p>Video content loading...</p>
                        </div>
                    )}
                </div>

                {/* 5. Content Section (Standard Lesson) */}
                {!lesson.isQuiz ? (
                    <Card className="lesson-content-card">
                        <div className="description-text">
                            {lesson.content}
                        </div>

                        {lesson.keyPoints && (
                            <div className="key-points-section">
                                <h3 className="section-heading">Key Points</h3>
                                <div className="points-list">
                                    {lesson.keyPoints.map((point, idx) => (
                                        <div key={idx} className="point-item">
                                            <div className="bullet-icon">
                                                <div className="bullet-dot"></div>
                                            </div>
                                            <span className="point-text">{point}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                ) : (
                    /* Quiz View (Simplified consistency) */
                    <Card className="lesson-content-card quiz-mode">
                        <div className="quiz-header">
                            <Award size={32} className="quiz-award-icon" />
                            <h3 className="section-heading">Knowledge Check</h3>
                        </div>
                        <p className="quiz-question-text">{lesson.quiz.question}</p>
                        <div className="quiz-options-group">
                            {lesson.quiz.options.map((option, idx) => {
                                const isSelected = selectedAnswer === idx;
                                const showResult = quizSubmitted;
                                const isCorrect = idx === lesson.quiz.correctAnswer;
                                return (
                                    <button
                                        key={idx}
                                        className={`quiz-opt-btn ${isSelected ? 'selected' : ''} ${showResult && isCorrect ? 'correct' : ''} ${showResult && isSelected && !isCorrect ? 'incorrect' : ''}`}
                                        onClick={() => !quizSubmitted && setSelectedAnswer(idx)}
                                        disabled={quizSubmitted}
                                    >
                                        <span className="opt-index">{String.fromCharCode(65 + idx)}</span>
                                        <span className="opt-text">{option}</span>
                                        {showResult && isCorrect && <CheckCircle size={18} />}
                                    </button>
                                );
                            })}
                        </div>
                        {quizSubmitted && (
                            <div className={`quiz-feedback-box ${isCorrectAnswer ? 'correct' : 'incorrect'}`}>
                                <strong>{isCorrectAnswer ? 'Correct!' : 'Incorrect'}</strong>
                                <p>{lesson.quiz.explanation}</p>
                            </div>
                        )}
                        {!quizSubmitted && (
                            <Button
                                onClick={handleQuizSubmit}
                                disabled={selectedAnswer === null}
                                className="quiz-submit-button"
                            >
                                Submit Answer
                            </Button>
                        )}
                    </Card>
                )}

                {/* 6. Navigation Controls */}
                <div className="lesson-nav-controls">
                    <Button
                        className="prev-lesson-btn"
                        onClick={handlePrevious}
                        disabled={isFirstLesson}
                    >
                        <ChevronLeft size={20} />
                        Previous Lesson
                    </Button>

                    {!lesson.isQuiz && (
                        <Button
                            className="next-lesson-btn"
                            onClick={handleCompleteLesson}
                        >
                            {isLastLesson ? 'Complete Module' : 'Next Lesson'}
                            {!isLastLesson && <ChevronRight size={20} />}
                        </Button>
                    )}

                    {lesson.isQuiz && quizSubmitted && isCorrectAnswer && (
                        <Button
                            className="next-lesson-btn"
                            onClick={handleCompleteLesson}
                        >
                            {isLastLesson ? 'Complete Module' : 'Continue'}
                            {!isLastLesson && <ChevronRight size={20} />}
                        </Button>
                    )}
                </div>

                {/* Completion Modal Overlay (Optional addition for wow factor) */}
                {allLessonsCompleted && isLastLesson && (
                    <div className="completion-overlay-view">
                        <Card className="celebration-card">
                            <div className="confetti-icon">🎉</div>
                            <h2 className="celebration-title">Module Completed!</h2>
                            <p className="celebration-text">You've successfully mastered <strong>{module.title}</strong> and earned <strong>{module.points} points</strong>.</p>
                            <div className="celebration-actions">
                                <Link to="/learning" className="celebration-link">
                                    <Button className="primary-back-btn">Return to Dashboard</Button>
                                </Link>
                                <Button variant="ghost" onClick={() => {
                                    setCurrentLesson(0);
                                    setCompletedLessons([]);
                                }}>
                                    Review Lessons
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LessonView;
