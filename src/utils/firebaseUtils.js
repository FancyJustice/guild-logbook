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

const DATA_COLLECTION = 'app-data';
const CHARACTERS_COLLECTION = 'characters';
const ARTIFACTS_COLLECTION = 'artifacts';
const CONFIG_DOC = 'config';

/**
 * Read all characters and artifacts from Firestore
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
 * Subscribe to real-time updates
 */
export function subscribeToCharacters(callback) {
  try {
    let useNewStructure = true;

    const unsubscribeChars = onSnapshot(collection(db, CHARACTERS_COLLECTION), (charsSnap) => {
      const characters = charsSnap.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));

      // If new structure is empty, try old structure
      if (characters.length === 0 && useNewStructure) {
        useNewStructure = false;
        try {
          const oldDocRef = doc(db, DATA_COLLECTION, 'characters-data');
          const unsubscribeOld = onSnapshot(oldDocRef, (oldDocSnap) => {
            if (oldDocSnap.exists()) {
              const oldData = oldDocSnap.data();
              callback({
                characters: oldData.characters || [],
                artifacts: oldData.artifacts || [],
                dropdownOptions: oldData.dropdownOptions || {}
              });
            }
          });
          return unsubscribeOld;
        } catch (e) {
          console.log('Old data structure not found');
        }
      }

      const unsubscribeArts = onSnapshot(collection(db, ARTIFACTS_COLLECTION), (artsSnap) => {
        const artifacts = artsSnap.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        const unsubscribeConfig = onSnapshot(doc(db, DATA_COLLECTION, CONFIG_DOC), (configSnap) => {
          const dropdownOptions = configSnap.exists() ? configSnap.data().dropdownOptions || {} : {};

          callback({
            characters,
            artifacts,
            dropdownOptions
          });
        });

        return () => {
          unsubscribeConfig();
          unsubscribeArts();
        };
      });

      return unsubscribeArts;
    }, (error) => {
      console.error('Error subscribing to characters:', error);
    });

    return unsubscribeChars;
  } catch (error) {
    console.error('Error setting up subscription:', error);
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
 * Add a single character
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
    const { id, ...charData } = updatedCharacter;
    const charRef = doc(db, CHARACTERS_COLLECTION, id);
    await updateDoc(charRef, charData);
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
    const charRef = doc(db, CHARACTERS_COLLECTION, characterId);
    await deleteDoc(charRef);
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
    const { id, ...artData } = updatedArtifact;
    const artRef = doc(db, ARTIFACTS_COLLECTION, id);
    await updateDoc(artRef, artData);
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
