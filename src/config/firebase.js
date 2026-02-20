// Firebase Configuration for SkillBridge AI
// TEMPORARY STUB FILE - Firebase SDK not yet installed
//
// TO ENABLE FIREBASE:
// 1. Run: npm install firebase
// 2. Replace this file with the full implementation
// 3. Add your Firebase credentials

// Temporary exports to prevent import errors
export const auth = null;
export const db = null;
export const storage = null;
export const googleProvider = null;

// Stub authentication functions
export const signInWithGoogle = async () => {
  console.warn('⚠️ Firebase not installed. Run: npm install firebase');
  return { success: false, error: 'Firebase SDK not installed' };
};

export const signInWithEmail = async (_email, _password) => {
  console.warn('⚠️ Firebase not installed. Run: npm install firebase');
  return { success: false, error: 'Firebase SDK not installed' };
};

export const registerWithEmail = async (_email, _password, _userData) => {
  console.warn('⚠️ Firebase not installed. Run: npm install firebase');
  return { success: false, error: 'Firebase SDK not installed' };
};

export const createUserProfile = async (_userId, _userData) => {
  console.warn('⚠️ Firebase not installed. Run: npm install firebase');
  return { success: false, error: 'Firebase SDK not installed' };
};

export const getUserProfile = async (_userId) => {
  console.warn('⚠️ Firebase not installed. Run: npm install firebase');
  return { success: false, data: null };
};

export const updateUserProfile = async (_userId, _updates) => {
  console.warn('⚠️ Firebase not installed. Run: npm install firebase');
  return { success: false, error: 'Firebase SDK not installed' };
};

export const uploadResume = async (_file, _userId) => {
  console.warn('⚠️ Firebase not installed. Run: npm install firebase');
  return { success: false, error: 'Firebase SDK not installed' };
};

export const storeGeminiAnalysis = async (_userId, _analysis) => {
  console.warn('⚠️ Firebase not installed. Run: npm install firebase');
  return { success: false, error: 'Firebase SDK not installed' };
};

export const storeSkillGapAnalysis = async (_userId, _analysis) => {
  console.warn('⚠️ Firebase not installed. Run: npm install firebase');
  return { success: false, error: 'Firebase SDK not installed' };
};

export const storeJobRecommendations = async (_userId, _recommendations) => {
  console.warn('⚠️ Firebase not installed. Run: npm install firebase');
  return { success: false, error: 'Firebase SDK not installed' };
};

export const storeJobMatches = async (_userId, _matches) => {
  console.warn('⚠️ Firebase not installed. Run: npm install firebase');
  return { success: false, error: 'Firebase SDK not installed' };
};

export default null;
