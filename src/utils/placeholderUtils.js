/**
 * Placeholder Utilities
 * Provides placeholder images and text for empty fields
 */

/**
 * Get placeholder image SVG for a given type
 * @param {string} type - Type: 'character', 'artifact', 'place', 'affiliation'
 * @returns {string} SVG data URL or empty string
 */
export function getPlaceholderImage(type) {
  const svgs = {
    character: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250" width="200" height="250">
      <rect width="200" height="250" fill="#8B7355"/>
      <circle cx="100" cy="70" r="40" fill="#D2A679"/>
      <path d="M 60 120 Q 60 100 100 100 Q 140 100 140 120 L 140 200 Q 100 220 60 200 Z" fill="#6B4423"/>
      <text x="100" y="240" font-family="serif" font-size="16" fill="#D2A679" text-anchor="middle">No Photo</text>
    </svg>`,
    artifact: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <rect width="200" height="200" fill="#8B7355"/>
      <path d="M 100 30 L 130 70 L 140 140 L 100 160 L 60 140 L 70 70 Z" fill="#DAA520" stroke="#8B7355" stroke-width="2"/>
      <circle cx="100" cy="100" r="20" fill="#FFD700" opacity="0.5"/>
      <text x="100" y="185" font-family="serif" font-size="14" fill="#DAA520" text-anchor="middle">No Photo</text>
    </svg>`,
    place: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <rect width="200" height="200" fill="#4A7C8C"/>
      <path d="M 100 30 C 85 30 75 40 75 55 C 75 75 100 110 100 110 C 100 110 125 75 125 55 C 125 40 115 30 100 30 Z" fill="#DAA520" stroke="#2C4C5C" stroke-width="2"/>
      <circle cx="100" cy="55" r="8" fill="#2C4C5C"/>
      <text x="100" y="185" font-family="serif" font-size="14" fill="#DAA520" text-anchor="middle">No Photo</text>
    </svg>`,
    affiliation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <rect width="200" height="200" fill="#5C3C3C"/>
      <path d="M 100 30 L 140 60 L 130 110 L 100 130 L 70 110 L 60 60 Z" fill="#DAA520" stroke="#2C2C2C" stroke-width="2"/>
      <line x1="100" y1="30" x2="100" y2="130" stroke="#2C2C2C" stroke-width="2"/>
      <line x1="70" y1="70" x2="130" y2="70" stroke="#2C2C2C" stroke-width="2"/>
      <text x="100" y="185" font-family="serif" font-size="14" fill="#DAA520" text-anchor="middle">No Photo</text>
    </svg>`,
  };

  const svg = svgs[type] || svgs.character;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Get placeholder text for a field
 * @param {string} field - Field type: 'description', 'name', etc.
 * @returns {string} Placeholder text
 */
export function getPlaceholderText(field) {
  const placeholders = {
    description: 'No description added yet',
    name: 'Enter a name...',
    text: 'No text provided',
    lore: 'No lore information added',
  };

  return placeholders[field] || placeholders.text;
}

/**
 * Check if an item has missing photo or description
 * @param {object} item - Item to check
 * @param {string} type - Item type for validation
 * @returns {object} Object with missing fields
 */
export function getMissingFields(item, type) {
  const missing = {
    photo: !item.photo,
    description: !item.description || item.description.trim() === '',
  };

  return missing;
}
