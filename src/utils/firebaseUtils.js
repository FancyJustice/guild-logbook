import { db } from '../firebaseConfig';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';

const CHARACTERS_DOC = 'characters-data';
const DATA_COLLECTION = 'app-data';

/**
 * Read all characters and artifacts from Firestore
 */
export async function fetchCharactersFromFirebase() {
  try {
    const docRef = doc(db, DATA_COLLECTION, CHARACTERS_DOC);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Initialize with empty data
      const emptyData = {
        characters: [],
        artifacts: [],
        dropdownOptions: {}
      };
      await setDoc(docRef, emptyData);
      return emptyData;
    }
  } catch (error) {
    console.error('Error fetching from Firebase:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time updates
 */
export function subscribeToCharacters(callback) {
  try {
    const docRef = doc(db, DATA_COLLECTION, CHARACTERS_DOC);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      }
    }, (error) => {
      console.error('Error subscribing to characters:', error);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up subscription:', error);
    throw error;
  }
}

/**
 * Update all characters and artifacts
 */
export async function updateCharactersInFirebase(characters, artifacts, dropdownOptions) {
  try {
    const docRef = doc(db, DATA_COLLECTION, CHARACTERS_DOC);
    await updateDoc(docRef, {
      characters: characters,
      artifacts: artifacts,
      dropdownOptions: dropdownOptions,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating Firebase:', error);
    throw error;
  }
}

/**
 * Add a single character
 */
export async function addCharacterToFirebase(character, currentCharacters, currentArtifacts, currentDropdown) {
  try {
    const updatedCharacters = [...currentCharacters, character];
    await updateCharactersInFirebase(updatedCharacters, currentArtifacts, currentDropdown);
  } catch (error) {
    console.error('Error adding character:', error);
    throw error;
  }
}

/**
 * Update a single character
 */
export async function updateCharacterInFirebase(updatedCharacter, currentCharacters, currentArtifacts, currentDropdown) {
  try {
    const updatedCharacters = currentCharacters.map(c =>
      c.id === updatedCharacter.id ? updatedCharacter : c
    );
    await updateCharactersInFirebase(updatedCharacters, currentArtifacts, currentDropdown);
  } catch (error) {
    console.error('Error updating character:', error);
    throw error;
  }
}

/**
 * Delete a character
 */
export async function deleteCharacterFromFirebase(characterId, currentCharacters, currentArtifacts, currentDropdown) {
  try {
    const updatedCharacters = currentCharacters.filter(c => c.id !== characterId);
    await updateCharactersInFirebase(updatedCharacters, currentArtifacts, currentDropdown);
  } catch (error) {
    console.error('Error deleting character:', error);
    throw error;
  }
}

/**
 * Add a single artifact
 */
export async function addArtifactToFirebase(artifact, currentCharacters, currentArtifacts, currentDropdown) {
  try {
    const updatedArtifacts = [...currentArtifacts, artifact];
    await updateCharactersInFirebase(currentCharacters, updatedArtifacts, currentDropdown);
  } catch (error) {
    console.error('Error adding artifact:', error);
    throw error;
  }
}

/**
 * Update a single artifact
 */
export async function updateArtifactInFirebase(updatedArtifact, currentCharacters, currentArtifacts, currentDropdown) {
  try {
    const updatedArtifacts = currentArtifacts.map(a =>
      a.id === updatedArtifact.id ? updatedArtifact : a
    );
    await updateCharactersInFirebase(currentCharacters, updatedArtifacts, currentDropdown);
  } catch (error) {
    console.error('Error updating artifact:', error);
    throw error;
  }
}

/**
 * Delete an artifact
 */
export async function deleteArtifactFromFirebase(artifactId, currentCharacters, currentArtifacts, currentDropdown) {
  try {
    const updatedArtifacts = currentArtifacts.filter(a => a.id !== artifactId);
    await updateCharactersInFirebase(currentCharacters, updatedArtifacts, currentDropdown);
  } catch (error) {
    console.error('Error deleting artifact:', error);
    throw error;
  }
}

/**
 * Merge characters and artifacts
 */
export async function mergeCharactersInFirebase(mergedCharacters, mergedArtifacts, currentDropdown) {
  try {
    await updateCharactersInFirebase(mergedCharacters, mergedArtifacts, currentDropdown);
  } catch (error) {
    console.error('Error merging data:', error);
    throw error;
  }
}
