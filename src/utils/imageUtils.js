/**
 * Utility functions for handling character images
 * Supports both old base64-encoded images and new file path references
 */

/**
 * Get the correct image source URL
 * Handles both base64 data URLs and file paths
 */
export const getImageSource = (photoField) => {
  if (!photoField) {
    return '' // Return empty if no photo
  }

  // Check if it's a base64 data URL (starts with 'data:')
  if (photoField.startsWith('data:')) {
    return photoField
  }

  // Otherwise treat it as a file path and prepend BASE_URL
  return import.meta.env.BASE_URL + photoField
}
