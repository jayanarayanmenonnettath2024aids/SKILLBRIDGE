import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getProfile = async () => {
    try {
        const response = await api.get('/profile');
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
};

export const updateProfile = async (profileData) => {
    try {
        const response = await api.post('/profile', profileData);
        return response.data;
    } catch (error) {
         console.error("Error updating profile:", error);
         throw error;
    }
};

export const searchOpportunities = async (query = 'hackathons', keywords = []) => {
    try {
        const params = new URLSearchParams();
        params.append('q', query);
        keywords.forEach(k => params.append('keywords', k));
        
        const response = await api.get(`/opportunities/search?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Error searching opportunities:", error);
        return [];
    }
};

export const checkEligibility = async (opportunity, profile) => {
    try {
        const response = await api.post('/check-eligibility', {
            opportunity,
            profile 
        });
        return response.data;
    } catch (error) {
        console.error("Error checking eligibility:", error);
        return null;
    }
};

// ========================================
// Authentication APIs
// ========================================

/**
 * Register or login a user with just name and email
 * @param {Object} userData - Object with name and email
 */
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error.response?.data || { message: "Registration failed" };
    }
};

/**
 * Login user with name and email
 * @param {string} name - User's name
 * @param {string} email - User's email
 */
export const loginUser = async (name, email) => {
    try {
        const response = await api.post('/auth/login', { name, email });
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error.response?.data || { message: "Login failed" };
    }
};

// ========================================
// Skill Gap Analysis APIs
// ========================================

/**
 * Fetch all users from Firestore
 */
export const getAllUsers = async () => {
    try {
        const response = await api.get('/skill-gap/users');
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

/**
 * Get comprehensive skill gap analysis for a specific user
 * @param {string} userId - The user ID to analyze
 */
export const getSkillGapAnalysis = async (userId) => {
    try {
        // Use the /users endpoint instead to get geminiAnalysis
        const response = await api.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching skill gap analysis:", error);
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

/** * Get resume analysis for a user
 * @param {string} userId - User ID
 */
export const getResumeAnalysisAPI = async (userId) => {
    try {
        const response = await api.get(`/ai/resume-analysis/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching resume analysis:", error);
        throw error.response?.data || { message: "Failed to fetch resume analysis" };
    }
};

/** * Get AI-powered job recommendations
 * @param {string} userId - User ID
 */
export const getJobRecommendations = async (userId) => {
    try {
        const response = await api.get(`/ai/job-recommendations?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching job recommendations:", error);
        throw error.response?.data || { message: "Failed to fetch recommendations" };
    }
};

// ========================================
// Job Matching APIs (Google Search)
// ========================================

/**
 * Search for matching jobs using Google Programmable Search
 * @param {Object} searchParams - Contains userId, jobTitle, location
 */
export const searchMatchingJobs = async (searchParams) => {
    try {
        const response = await api.post('/jobs/search', searchParams);
        return response.data;
    } catch (error) {
        console.error("Error searching jobs:", error);
        throw error.response?.data || { message: "Job search failed" };
    }
};

// ========================================
// User Profile APIs
// ========================================

/**
 * Update user profile with interests and skills
 * @param {Object} profileData - User profile data
 */
export const updateUserProfileAPI = async (profileData) => {
    try {
        const response = await api.post('/user/profile/update', profileData);
        return response.data;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error.response?.data || { message: "Profile update failed" };
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
        console.error("Error fetching learning videos:", error);
        throw error.response?.data || { message: "Failed to fetch learning videos" };
    }
};

export default api;
