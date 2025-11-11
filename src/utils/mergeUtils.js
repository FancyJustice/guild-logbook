/**
 * Merge Utility Functions for Guild Logbook
 *
 * Handles intelligent merging of character and artifact data from imports.
 * Key principle: NEVER delete items, only add/update
 * This allows people to work with partial exports and merge back safely.
 *
 * Example use case:
 * 1. Export 50 characters
 * 2. Share export with team member
 * 3. Team member adds notes to 10 characters offline
 * 4. Import their changes - only those 10 are updated, others unchanged
 * 5. Original 40 characters are NOT deleted
 *
 * Functions:
 * - deepMerge: Recursively merge objects with imported data taking priority
 * - findDifferences: Compare arrays and categorize changes
 * - mergeCharacters: Combine two character arrays safely
 * - generateMergeReport: Create summary of changes for user review
 * - validateImportedData: Check JSON has required fields
 */

/**
 * Deep merge two objects, with imported data taking precedence
 * Used internally by other merge functions
 * @param {Object} current - Current/existing data
 * @param {Object} imported - New data from import
 * @returns {Object} Merged object
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
 * Find differences between two arrays of objects by comparing their IDs
 *
 * Categorizes items into four groups to understand what changed between
 * the current data and imported data.
 *
 * @param {Array} current - Current/existing items (default empty array)
 * @param {Array} imported - New items from import file (default empty array)
 * @returns {Object} Differences object with structure:
 *   {
 *     added: Array,      // Items only in imported (new items)
 *     removed: Array,    // Items only in current (items not in import)
 *     modified: Array,   // Items in both but with different values
 *     unchanged: Array   // Items that are identical
 *   }
 *
 * @example
 * const diff = findDifferences(
 *   [{ id: '1', name: 'Alice' }],
 *   [{ id: '1', name: 'Alice Updated' }, { id: '2', name: 'Bob' }]
 * )
 * // Returns:
 * // {
 * //   added: [{ id: '2', name: 'Bob' }],
 * //   removed: [],
 * //   modified: [{ id: '1', current: {...}, imported: {...} }],
 * //   unchanged: []
 * // }
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
 * Generate a detailed merge report for user review
 *
 * Creates a summary showing counts of all changes, and detailed lists
 * of what will be added, removed, or modified. Includes specific field
 * changes for modified items.
 *
 * @param {Object} differences - Result from findDifferences()
 * @returns {Object} Report with structure:
 *   {
 *     summary: {
 *       added: number,     // Count of new items
 *       removed: number,   // Count of items not in import
 *       modified: number,  // Count of items with changes
 *       unchanged: number  // Count of identical items
 *     },
 *     details: {
 *       added: Array,      // Items being added
 *       removed: Array,    // Items being removed
 *       modified: Array    // Items being modified with specific field changes
 *     }
 *   }
 *
 * @example
 * const report = generateMergeReport(differences)
 * console.log(`Adding ${report.summary.added} new characters`)
 * console.log(`Updating ${report.summary.modified} existing characters`)
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
 * Find specific field-level changes between two objects
 *
 * Compares all fields in both objects and returns which fields changed
 * and what the old and new values are.
 *
 * @param {Object} current - Current/existing object
 * @param {Object} imported - New object from import
 * @returns {Array} Array of change objects with structure:
 *   [{ field: string, from: any, to: any }, ...]
 *
 * @private - Used internally by generateMergeReport
 *
 * @example
 * const changes = findObjectChanges(
 *   { name: 'Alice', level: 5 },
 *   { name: 'Alice', level: 10 }
 * )
 * // Returns: [{ field: 'level', from: 5, to: 10 }]
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
 * Validate imported JSON data structure
 *
 * Ensures the imported data has the required structure and fields.
 * Performs validation on:
 * - Required "characters" array
 * - Each character has required "id" and "name" fields
 * - Optional "artifacts" array is properly formatted
 *
 * @param {Object} data - The imported data object to validate
 * @returns {Object} Validation result with structure:
 *   {
 *     isValid: boolean,  // true if data passes all checks
 *     errors: Array      // Array of error messages (empty if valid)
 *   }
 *
 * @example
 * const validation = validateImportedData(importedJSON)
 * if (!validation.isValid) {
 *   console.error('Import errors:', validation.errors)
 * }
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
