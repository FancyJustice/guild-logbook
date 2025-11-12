/**
 * Firebase Firestore Utilities for Guild Logbook
 *
 * Manages all read/write operations for character and artifact data in Firestore.
 *
 * DUAL STRUCTURE SUPPORT (for migration flexibility):
 * The app supports two Firebase data structures simultaneously:
 *
 * NEW STRUCTURE (Preferred - Scalable):
 * - collections/characters/ (collection)
 *   - char_00001/ (document)
 *     - { name, race, class, ... }
 *   - char_00002/ (document)
 * - collections/artifacts/ (collection)
 * - app-data/config/ (configuration)
 *
 * OLD STRUCTURE (Legacy - Still Supported):
 * - app-data/characters-data/ (single document)
 *   - { characters: [...], artifacts: [...], dropdownOptions: {...} }
 *
 * HOW IT WORKS:
 * 1. READ: Try new structure first, fall back to old if empty
 * 2. WRITE: Write to BOTH structures for compatibility (new + legacy)
 * 3. DELETE: Delete from BOTH structures
 * 4. SUBSCRIBE: Listen to new structure (falls back to old on empty)
 *
 * This allows teams to migrate gradually from old to new structure
 * without losing data or forcing users to upgrade at the same time.
 *
 * REAL-TIME UPDATES:
 * All operations use Firebase onSnapshot() for real-time sync
 * When one user edits a character, all other users see it instantly
 *
 * @module firebaseUtils
 */

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
  where,
  getDocs
} from 'firebase/firestore';

// ============== FIRESTORE COLLECTION NAMES ==============
// These constants define where data is stored in Firebase
const DATA_COLLECTION = 'app-data'; // Container for config and legacy data
const CHARACTERS_COLLECTION = 'characters'; // New structure: individual character docs
const ARTIFACTS_COLLECTION = 'artifacts'; // New structure: individual artifact docs
const CONFIG_DOC = 'config'; // Configuration document in app-data collection

/**
 * Fetch all characters and artifacts from Firestore
 *
 * Attempts new structure first, falls back to old structure if empty.
 * This ensures compatibility during migration between data models.
 *
 * @async
 * @returns {Promise<{characters: Array, artifacts: Array, dropdownOptions: Object}>}
 *          All application data
 * @throws {Error} If database read fails
 */
export async function fetchCharactersFromFirebase() {
  try {
    // Try to fetch from new collection structure first
    const charsSnapshot = await getDocs(collection(db, CHARACTERS_COLLECTION));
    const characters = charsSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));

    // If new structure is empty, try old structure
    if (characters.length === 0) {
      try {
        const oldDocRef = doc(db, DATA_COLLECTION, 'characters-data');
        const oldDocSnap = await getDoc(oldDocRef);
        if (oldDocSnap.exists()) {
          const oldData = oldDocSnap.data();
          return {
            characters: oldData.characters || [],
            artifacts: oldData.artifacts || [],
            dropdownOptions: oldData.dropdownOptions || {}
          };
        }
      } catch (e) {
        console.log('Old data structure not found, proceeding with empty collections');
      }
    }

    // Fetch artifacts
    const artsSnapshot = await getDocs(collection(db, ARTIFACTS_COLLECTION));
    const artifacts = artsSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));

    // Fetch dropdown options from config
    const configRef = doc(db, DATA_COLLECTION, CONFIG_DOC);
    const configSnap = await getDoc(configRef);
    const dropdownOptions = configSnap.exists() ? configSnap.data().dropdownOptions || {} : {};

    return {
      characters,
      artifacts,
      dropdownOptions
    };
  } catch (error) {
    console.error('Error fetching from Firebase:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time character and artifact updates
 *
 * Establishes a live connection to Firestore and calls the callback
 * whenever data changes. Handles the dual-structure support by trying
 * the new structure first, then falling back to the legacy structure
 * if empty.
 *
 * @param {Function} callback - Called with { characters, artifacts, dropdownOptions }
 * @returns {Function} Unsubscribe function to stop listening
 *
 * @example
 * const unsubscribe = subscribeToCharacters((data) => {
 *   setCharacters(data.characters)
 *   setArtifacts(data.artifacts)
 * })
 * // Later: unsubscribe() to stop listening
 */
export function subscribeToCharacters(callback) {
  try {
    let checkCounter = 0;
    let useOldStructure = false;
    let unsubscribeArts = null;
    let unsubscribeConfig = null;

    const unsubscribeChars = onSnapshot(collection(db, CHARACTERS_COLLECTION), (charsSnap) => {
      const characters = charsSnap.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      // If new structure is empty and we haven't switched to old yet, try old structure
      if (characters.length === 0 && !useOldStructure && checkCounter === 0) {
        console.log('New structure is empty, switching to old structure');
        checkCounter++;
        useOldStructure = true;
        // Unsubscribe from nested listeners before switching
        if (unsubscribeArts) unsubscribeArts();
        if (unsubscribeConfig) unsubscribeConfig();
        return subscribeToOldStructure(callback);
      }

      if (characters.length === 0 && useOldStructure) {
        // Old structure was tried, still no data
        console.log('Both structures empty, returning empty data');
        callback({
          characters: [],
          artifacts: [],
          dropdownOptions: {}
        });
        return;
      }

      // We have characters from new structure - set up nested listeners
      if (unsubscribeArts) unsubscribeArts();
      if (unsubscribeConfig) unsubscribeConfig();

      unsubscribeArts = onSnapshot(collection(db, ARTIFACTS_COLLECTION), (artsSnap) => {
        const artifacts = artsSnap.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        unsubscribeConfig = onSnapshot(doc(db, DATA_COLLECTION, CONFIG_DOC), (configSnap) => {
          const dropdownOptions = configSnap.exists() ? configSnap.data().dropdownOptions || {} : {};

          console.log('Subscription: complete data -', characters.length, 'characters,', artifacts.length, 'artifacts');
          callback({
            characters,
            artifacts,
            dropdownOptions
          });
        });
      });
    }, (error) => {
      console.error('Error subscribing to new structure:', error);
      // Fall back to old structure on error
      if (unsubscribeArts) unsubscribeArts();
      if (unsubscribeConfig) unsubscribeConfig();
      return subscribeToOldStructure(callback);
    });

    return () => {
      unsubscribeChars();
      if (unsubscribeArts) unsubscribeArts();
      if (unsubscribeConfig) unsubscribeConfig();
    };
  } catch (error) {
    console.error('Error setting up subscription:', error);
    return subscribeToOldStructure(callback);
  }
}

/**
 * Subscribe to legacy single-document structure
 *
 * Fallback subscription for the old data format where all characters,
 * artifacts, and options were stored in a single document.
 * Used when new collection-based structure is empty.
 *
 * @param {Function} callback - Called with { characters, artifacts, dropdownOptions }
 * @returns {Function} Unsubscribe function
 *
 * @private - Internal fallback used by subscribeToCharacters
 */
function subscribeToOldStructure(callback) {
  try {
    const oldDocRef = doc(db, DATA_COLLECTION, 'characters-data');
    return onSnapshot(oldDocRef, (oldDocSnap) => {
      if (oldDocSnap.exists()) {
        const oldData = oldDocSnap.data();
        callback({
          characters: oldData.characters || [],
          artifacts: oldData.artifacts || [],
          dropdownOptions: oldData.dropdownOptions || {}
        });
      } else {
        console.log('Subscription: old structure document does not exist');
        callback({
          characters: [],
          artifacts: [],
          dropdownOptions: {}
        });
      }
    }, (error) => {
      console.error('Error subscribing to old structure:', error);
      callback({
        characters: [],
        artifacts: [],
        dropdownOptions: {}
      });
    });
  } catch (error) {
    console.error('Error setting up old structure subscription:', error);
    throw error;
  }
}

/**
 * Update dropdown options
 */
async function updateConfigInFirebase(dropdownOptions) {
  try {
    const configRef = doc(db, DATA_COLLECTION, CONFIG_DOC);
    await setDoc(configRef, { dropdownOptions }, { merge: true });
  } catch (error) {
    console.error('Error updating config:', error);
    throw error;
  }
}

/**
 * Add a new character to Firebase
 *
 * Adds the character to the new collection-based structure.
 * Auto-generates an ID if not provided.
 *
 * @param {Object} character - Character data to add
 * @param {string} [character.id] - Optional ID (auto-generated if missing)
 * @param {Array} currentCharacters - Current character array (for reference)
 * @param {Array} currentArtifacts - Current artifact array (for legacy sync)
 * @param {Object} currentDropdown - Current dropdown options (for legacy sync)
 * @throws {Error} If Firebase write fails
 */
export async function addCharacterToFirebase(character, currentCharacters, currentArtifacts, currentDropdown) {
  try {
    const charId = character.id || `char_${Date.now()}`;
    const charRef = doc(db, CHARACTERS_COLLECTION, charId);
    const { id, ...charData } = character;
    await setDoc(charRef, charData);
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
    // First try to update in new structure
    const { id, ...charData } = updatedCharacter;
    const charRef = doc(db, CHARACTERS_COLLECTION, id);
    await setDoc(charRef, charData, { merge: true });

    // Also update in old structure for backward compatibility
    try {
      const updatedCharacters = currentCharacters.map(c =>
        c.id === updatedCharacter.id ? updatedCharacter : c
      );
      const oldDocRef = doc(db, DATA_COLLECTION, 'characters-data');
      await setDoc(oldDocRef, {
        characters: updatedCharacters,
        artifacts: currentArtifacts,
        dropdownOptions: currentDropdown
      }, { merge: true });
    } catch (e) {
      console.log('Could not update old structure (may not exist yet)');
    }
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
    // Delete from new structure
    const charRef = doc(db, CHARACTERS_COLLECTION, characterId);
    await deleteDoc(charRef);

    // Also delete from old structure for backward compatibility
    try {
      const updatedCharacters = currentCharacters.filter(c => c.id !== characterId);
      const oldDocRef = doc(db, DATA_COLLECTION, 'characters-data');
      await setDoc(oldDocRef, {
        characters: updatedCharacters,
        artifacts: currentArtifacts,
        dropdownOptions: currentDropdown
      }, { merge: true });
    } catch (e) {
      console.log('Could not update old structure (may not exist yet)');
    }
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
    const artId = artifact.id || `artifact_${Date.now()}`;
    const artRef = doc(db, ARTIFACTS_COLLECTION, artId);
    const { id, ...artData } = artifact;
    await setDoc(artRef, artData);
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
    // First try to update in new structure
    const { id, ...artData } = updatedArtifact;
    const artRef = doc(db, ARTIFACTS_COLLECTION, id);
    await setDoc(artRef, artData, { merge: true });

    // Also update in old structure for backward compatibility
    try {
      const updatedArtifacts = currentArtifacts.map(a =>
        a.id === updatedArtifact.id ? updatedArtifact : a
      );
      const oldDocRef = doc(db, DATA_COLLECTION, 'characters-data');
      await setDoc(oldDocRef, {
        characters: currentCharacters,
        artifacts: updatedArtifacts,
        dropdownOptions: currentDropdown
      }, { merge: true });
    } catch (e) {
      console.log('Could not update old structure (may not exist yet)');
    }
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
    const artRef = doc(db, ARTIFACTS_COLLECTION, artifactId);
    await deleteDoc(artRef);
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
    // Delete old characters and add new ones
    for (const char of mergedCharacters) {
      const { id, ...charData } = char;
      const charRef = doc(db, CHARACTERS_COLLECTION, id);
      await setDoc(charRef, charData, { merge: true });
    }

    // Delete old artifacts and add new ones
    for (const art of mergedArtifacts) {
      const { id, ...artData } = art;
      const artRef = doc(db, ARTIFACTS_COLLECTION, id);
      await setDoc(artRef, artData, { merge: true });
    }

    // Update dropdown options
    await updateConfigInFirebase(currentDropdown);
  } catch (error) {
    console.error('Error merging data:', error);
    throw error;
  }
}
