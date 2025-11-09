/**
 * API endpoint for uploading character images
 * Stores images in Firebase Storage via a server-side function
 */

import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDn9uDPgsKgauBqIoWA04LIBvTA2KCyO8k",
  authDomain: "logbook-de087.firebaseapp.com",
  projectId: "logbook-de087",
  storageBucket: "logbook-de087.firebasestorage.app",
  messagingSenderId: "614762996993",
  appId: "1:614762996993:web:ff692aef695180a2992700",
  measurementId: "G-NLVMW5BH1T"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { imageData, fileName } = req.body;

      if (!imageData || !fileName) {
        return res.status(400).json({ error: 'Missing imageData or fileName' });
      }

      // Convert base64 to buffer
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Create storage reference
      const storageRef = ref(storage, `characters/${fileName}`);

      // Upload to Firebase Storage
      const snapshot = await uploadBytes(storageRef, buffer, {
        contentType: 'image/png'
      });

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return res.status(200).json({
        success: true,
        url: downloadURL,
        message: 'Image uploaded successfully'
      });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({
        error: 'Failed to upload image',
        message: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
