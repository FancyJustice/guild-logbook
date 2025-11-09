/**
 * Merge utility functions for handling character data conflicts
 */

/**
 * Deep merge two objects, with imported data taking precedence
 */
export const deepMerge = (current, imported) => {
  const result = { ...current }

  for (const key in imported) {
    if (imported[key] === null || imported[key] === undefined) {
      continue
    }

    if (typeof imported[key] === 'object' && !Array.isArray(imported[key])) {
      result[key] = deepMerge(result[key] || {}, imported[key])
    } else {
      result[key] = imported[key]
    }
  }

  return result
}

/**
 * Find differences between two arrays of objects (by id)
 */
export const findDifferences = (current = [], imported = []) => {
  const differences = {
    added: [],      // Items only in imported
    removed: [],    // Items only in current
    modified: [],   // Items in both but with changes
    unchanged: []   // Items that are identical
  }

  const currentMap = new Map(current.map(item => [item.id, item]))
  const importedMap = new Map(imported.map(item => [item.id, item]))

  // Find added and modified
  imported.forEach(importedItem => {
    const currentItem = currentMap.get(importedItem.id)
    if (!currentItem) {
      differences.added.push(importedItem)
    } else {
      const isDifferent = JSON.stringify(currentItem) !== JSON.stringify(importedItem)
      if (isDifferent) {
        differences.modified.push({
          id: importedItem.id,
          current: currentItem,
          imported: importedItem
        })
      } else {
        differences.unchanged.push(importedItem)
      }
    }
  })

  // Find removed
  current.forEach(currentItem => {
    if (!importedMap.has(currentItem.id)) {
      differences.removed.push(currentItem)
    }
  })

  return differences
}

/**
 * Merge character arrays with intelligent conflict resolution
 * Strategy: Only update/add items from import, NEVER remove items just because they're missing
 * This allows people to work with partial exports and merge them back safely
 */
export const mergeCharacters = (current = [], imported = [], strategy = 'smart') => {
  const differences = findDifferences(current, imported)

  let merged = [...current]

  // Add new items from import
  differences.added.forEach(item => {
    merged.push(item)
  })

  // Update modified items with imported versions
  differences.modified.forEach(({ id, imported: importedItem }) => {
    const index = merged.findIndex(item => item.id === id)
    if (index !== -1) {
      merged[index] = importedItem
    }
  })

  // IMPORTANT: Do NOT remove items that are in current but not in imported
  // This allows partial exports/imports without losing data
  // Items are only deleted if explicitly removed in the admin panel and re-exported

  return merged
}

/**
 * Generate a merge report for user review
 */
export const generateMergeReport = (differences) => {
  return {
    summary: {
      added: differences.added.length,
      removed: differences.removed.length,
      modified: differences.modified.length,
      unchanged: differences.unchanged.length
    },
    details: {
      added: differences.added.map(item => ({
        id: item.id,
        name: item.name,
        type: 'Added'
      })),
      removed: differences.removed.map(item => ({
        id: item.id,
        name: item.name,
        type: 'Removed'
      })),
      modified: differences.modified.map(({ id, current, imported }) => ({
        id,
        name: imported.name || current.name,
        type: 'Modified',
        changes: findObjectChanges(current, imported)
      }))
    }
  }
}

/**
 * Find specific field changes between two objects
 */
const findObjectChanges = (current, imported) => {
  const changes = []
  const allKeys = new Set([...Object.keys(current), ...Object.keys(imported)])

  allKeys.forEach(key => {
    const currentVal = current[key]
    const importedVal = imported[key]

    if (JSON.stringify(currentVal) !== JSON.stringify(importedVal)) {
      changes.push({
        field: key,
        from: currentVal,
        to: importedVal
      })
    }
  })

  return changes
}

/**
 * Validate imported data structure
 */
export const validateImportedData = (data) => {
  const errors = []

  if (!data.characters || !Array.isArray(data.characters)) {
    errors.push('Missing or invalid "characters" array')
  } else {
    data.characters.forEach((char, idx) => {
      if (!char.id) {
        errors.push(`Character at index ${idx} missing required "id" field`)
      }
      if (!char.name) {
        errors.push(`Character at index ${idx} missing required "name" field`)
      }
    })
  }

  if (data.artifacts && !Array.isArray(data.artifacts)) {
    errors.push('Invalid "artifacts" array format')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
