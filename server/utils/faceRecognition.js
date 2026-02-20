/**
 * Face Recognition Utility
 * This is a simplified face comparison using image similarity
 * For production, integrate with face-api.js or Azure Face API
 */

// Calculate similarity between two base64 images
export const compareFaces = async (storedFaceImage, capturedFaceImage) => {
  try {
    // Simple comparison based on base64 string similarity
    // In production, use proper face recognition like face-api.js descriptors
    
    // Extract base64 data (remove data:image/jpeg;base64, prefix)
    const stored = storedFaceImage.split(',')[1] || storedFaceImage;
    const captured = capturedFaceImage.split(',')[1] || capturedFaceImage;

    // For MVP, we'll use a basic similarity check
    // In production, implement proper face descriptor comparison
    if (!stored || !captured) {
      return {
        isMatch: false,
        confidence: 0,
        message: 'Invalid image data'
      };
    }

    // Calculate basic similarity (simplified approach)
    const similarity = calculateStringSimilarity(stored, captured);
    
    // Threshold for matching (70% similarity)
    const MATCH_THRESHOLD = 0.70;
    const isMatch = similarity >= MATCH_THRESHOLD;

    return {
      isMatch,
      confidence: Math.round(similarity * 100),
      message: isMatch ? 'Face matched' : 'Face does not match'
    };
  } catch (error) {
    console.error('Face comparison error:', error);
    return {
      isMatch: false,
      confidence: 0,
      message: 'Error comparing faces'
    };
  }
};

// Calculate string similarity using Levenshtein distance
function calculateStringSimilarity(str1, str2) {
  // For very long strings (images), sample portions
  const sampleSize = 1000;
  const sample1 = str1.substring(0, sampleSize);
  const sample2 = str2.substring(0, sampleSize);

  const longer = sample1.length > sample2.length ? sample1 : sample2;
  const shorter = sample1.length > sample2.length ? sample2 : sample1;

  if (longer.length === 0) {
    return 1.0;
  }

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

// Levenshtein distance algorithm
function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * NOTE FOR PRODUCTION:
 * Replace this simplified comparison with proper face recognition:
 * 
 * Option 1: face-api.js
 * - Extract face descriptors during registration
 * - Compare descriptors using euclidean distance
 * - Threshold: < 0.6 for match
 * 
 * Option 2: Azure Face API or AWS Rekognition
 * - Use cloud-based face verification
 * - More accurate and reliable
 * 
 * Option 3: TensorFlow face recognition models
 * - FaceNet or similar models
 * - Run on server with GPU for better performance
 */
