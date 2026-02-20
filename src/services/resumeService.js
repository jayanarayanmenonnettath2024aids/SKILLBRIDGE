import apiClient from './api';

/**
 * Check if user has uploaded a resume globally
 * Checks both localStorage and backend MongoDB for resume data
 * @param {string} userId - User ID to check
 * @returns {Promise<{hasResume: boolean, resumeURL: string|null, analysisData: object|null}>}
 */
export const checkUserResume = async (userId) => {
    try {
        // First check localStorage for quick access
        const localResume = localStorage.getItem('uploadedResume') || localStorage.getItem(`resume_${userId}`);
        
        if (localResume) {
            try {
                const resumeData = JSON.parse(localResume);
                return {
                    hasResume: true,
                    resumeURL: resumeData.resumeURL || resumeData.url || null,
                    analysisData: resumeData.analysis || resumeData.geminiAnalysis || null,
                    source: 'localStorage'
                };
            } catch (e) {
                // If parsing fails, treat as URL string
                return {
                    hasResume: true,
                    resumeURL: localResume,
                    analysisData: null,
                    source: 'localStorage'
                };
            }
        }

        // If not in localStorage, check backend
        if (userId) {
            const response = await apiClient.get(`/api/users/${userId}/resume`);
            
            if (response.data && response.data.hasResume) {
                // Cache in localStorage for faster future access
                const resumeData = {
                    resumeURL: response.data.resumeURL,
                    analysis: response.data.analysis,
                    geminiAnalysis: response.data.geminiAnalysis
                };
                localStorage.setItem(`resume_${userId}`, JSON.stringify(resumeData));
                
                return {
                    hasResume: true,
                    resumeURL: response.data.resumeURL,
                    analysisData: response.data.geminiAnalysis || response.data.analysis,
                    source: 'backend'
                };
            }
        }

        return {
            hasResume: false,
            resumeURL: null,
            analysisData: null,
            source: 'none'
        };
    } catch (error) {
        console.error('Error checking user resume:', error);
        // Fallback to localStorage only on error
        const localResume = localStorage.getItem('uploadedResume');
        if (localResume) {
            try {
                const resumeData = JSON.parse(localResume);
                return {
                    hasResume: true,
                    resumeURL: resumeData.resumeURL || resumeData.url,
                    analysisData: resumeData.analysis || resumeData.geminiAnalysis,
                    source: 'localStorage_fallback'
                };
            } catch (e) {
                return {
                    hasResume: true,
                    resumeURL: localResume,
                    analysisData: null,
                    source: 'localStorage_fallback'
                };
            }
        }
        
        return {
            hasResume: false,
            resumeURL: null,
            analysisData: null,
            source: 'error'
        };
    }
};

/**
 * Clear resume cache from localStorage
 * @param {string} userId - User ID
 */
export const clearResumeCache = (userId) => {
    localStorage.removeItem('uploadedResume');
    if (userId) {
        localStorage.removeItem(`resume_${userId}`);
    }
};

/**
 * Update resume data in localStorage cache
 * @param {string} userId - User ID
 * @param {object} resumeData - Resume data to cache
 */
export const updateResumeCache = (userId, resumeData) => {
    if (userId && resumeData) {
        localStorage.setItem(`resume_${userId}`, JSON.stringify(resumeData));
        localStorage.setItem('uploadedResume', JSON.stringify(resumeData));
    }
};
