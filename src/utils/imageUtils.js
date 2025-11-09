/**
 * Utility functions for handling character images
 * Supports both old base64-encoded images and new file path references
 */

/**
 * Get the correct image source URL
 * Handles base64 data URLs, Firebase Storage URLs, and file paths
 */
export const getImageSource = (photoField) => {
  if (!photoField) {
    return '' // Return empty if no photo
  }

  // Check if it's a base64 data URL (starts with 'data:')
  if (photoField.startsWith('data:')) {
    return photoField
  }

  // Check if it's a Firebase Storage URL (contains 'firebasestorage')
  if (photoField.includes('firebasestorage')) {
    return photoField
  }

  // Otherwise treat it as a local file path and prepend BASE_URL
  return import.meta.env.BASE_URL + photoField
}
