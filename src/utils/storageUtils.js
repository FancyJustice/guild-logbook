import { storage } from '../firebaseConfig';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

/**
 * Upload an image to Firebase Storage
 * @param {string} base64Data - Base64 encoded image data
 * @param {string} fileName - Name for the file (e.g., "character_name.png")
 * @returns {Promise<string>} - Download URL for the uploaded image
 */
export async function uploadCharacterImage(base64Data, fileName) {
  try {
    // Create a reference to the file location
    const fileRef = ref(storage, `characters/${fileName}`);

    // Upload the base64 string
    await uploadString(fileRef, base64Data, 'data_url');

    // Get the download URL
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
