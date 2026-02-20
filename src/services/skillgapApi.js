/**
 * Skill Gap Analysis API Service
 * 
 * Handles all API calls for the Skill Gap Analysis feature.
 * Communicates with the Flask backend running on port 5000.
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ========================================
// ========================================
// Skill Gap Analysis APIs
// ========================================

// Mock data for demo purposes when backend is unavailable
const mockUsers = [
    { user_id: 'demo-user-1', name: 'Demo User', email: 'demo@example.com', role: 'Data Analyst' }
];

const mockSkillGapData = {
    user_id: 'demo-user-1',
    name: 'Demo User',
    email: 'demo@example.com',
    role: 'Data Analyst',
    skills: {
        technical: ['Python', 'Excel', 'SQL'],
        soft: ['Communication', 'Problem Solving']
    },
    required_skills: {
        technical: ['Python', 'R', 'SQL', 'Tableau', 'Machine Learning'],
        soft: ['Communication', 'Problem Solving', 'Leadership']
    },
    match_percentage: 65,
    skill_gaps: [
        { skill: 'R Programming', category: 'technical', priority: 'high' },
        { skill: 'Tableau', category: 'technical', priority: 'medium' },
        { skill: 'Machine Learning', category: 'technical', priority: 'high' }
    ]
};

/**
 * Fetch all users from Firestore
 */
export const getAllUsers = async () => {
    try {
        const response = await api.get('/skill-gap/users');
        return response.data;
    } catch (error) {
        console.warn("Backend unavailable, using mock data:", error.message);
        return mockUsers;
    }
};

/**
 * Get comprehensive skill gap analysis for a specific user
 * @param {string} userId - The user ID to analyze
 */
export const getSkillGapAnalysis = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.warn("Backend unavailable, using mock data:", error.message);
        return mockSkillGapData;
        throw error;
    }
};

/**
 * Get required skills for a specific job role
 * @param {string} role - The job role name
 */
export const getRequiredSkills = async (role) => {
    try {
        const response = await api.get(`/skill-gap/required-skills/${role}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching required skills:", error);
        throw error;
    }
};

/**
 * Seed synthetic data into Firestore (for demo/hackathon setup)
 */
export const seedSkillGapData = async () => {
    try {
        const response = await api.post('/skill-gap/seed-data');
        return response.data;
    } catch (error) {
        console.error("Error seeding data:", error);
        throw error;
    }
};

// ========================================
// AI-Powered Resume Analysis APIs
// ========================================

/**
 * Upload resume file to backend
 * @param {File} file - PDF file
 * @param {string} userId - User ID
 */
export const uploadResumeAPI = async (file, userId) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);

        const response = await api.post('/resume/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error uploading resume:", error);
        throw error.response?.data || { message: "Resume upload failed" };
    }
};

/**
 * Analyze resume using Gemini API
 * @param {Object} data - Contains userId and resumeURL
 */
export const analyzeResumeAPI = async (data) => {
    try {
        const response = await api.post('/ai/analyze-resume', data);
        return response.data;
    } catch (error) {
        console.error("Error analyzing resume:", error);
        throw error.response?.data || { message: "Resume analysis failed" };
    }
};

/**
 * Get resume analysis for a user
 * @param {string} userId - User ID
 */
export const getResumeAnalysisAPI = async (userId) => {
    try {
        const response = await api.get(`/ai/resume-analysis/${userId}`);
        return response.data;
    } catch (error) {
        console.warn("Backend unavailable for resume analysis, using mock data");
        return {
            user_id: userId,
            analysis: {
                summary: 'Demo resume analysis unavailable without proper backend configuration.',
                skills_found: ['Python', 'JavaScript', 'React', 'SQL'],
                recommendations: [
                    'Complete certification in Cloud Computing',
                    'Learn advanced Data Structures',
                    'Practice System Design'
                ]
            }
        };
    }
};

// ========================================
// YouTube Learning Videos API
// ========================================

/**
 * Get educational YouTube videos based on user's resume analysis
 * @param {string} userId - User ID
 */
export const getLearningVideosAPI = async (userId) => {
    try {
        const response = await api.get(`/ai/learning-videos/${userId}`);
        return response.data;
    } catch (error) {
        console.warn("Backend unavailable for learning videos, using mock data");
        return {
            videos: [
                {
                    title: 'Python for Data Analysis - Complete Course',
                    url: 'https://www.youtube.com/watch?v=GPVsHOlRBBI',
                    thumbnail: 'https://img.youtube.com/vi/GPVsHOlRBBI/mqdefault.jpg',
                    duration: '4:32:22'
                },
                {
                    title: 'SQL Tutorial - Full Course',
                    url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
                    thumbnail: 'https://img.youtube.com/vi/HXV3zeQKqGY/mqdefault.jpg',
                    duration: '4:20:46'
                },
                {
                    title: 'Machine Learning Course for Beginners',
                    url: 'https://www.youtube.com/watch?v=NWONeJKn6kc',
                    thumbnail: 'https://img.youtube.com/vi/NWONeJKn6kc/mqdefault.jpg',
                    duration: '3:00:00'
                }
            ]
        };
    }
};

export default api;
