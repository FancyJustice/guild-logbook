export default function FilterBar({
  filters,
  setFilters,
  searchTerm,
  setSearchTerm,
  dropdownOptions,
  uniqueAffiliations,
}) {
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
  }

  return (
    <div className="bg-parchment text-wood p-3 md:p-6 rounded-lg border-2 border-gold space-y-3 md:space-y-4">
      <h2 className="text-xl md:text-2xl font-medieval font-bold text-gold-dark">Search & Filter</h2>

      <div>
        <input
          type="text"
          placeholder="Search by name or VRC player..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 md:px-4 py-2 border-2 border-gold-dark rounded bg-parchment-dark text-wood text-sm md:text-base placeholder-wood-light focus:outline-none focus:border-gold"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-4">
        <FilterSelect
          label="Type"
          value={filters.type}
          onChange={(value) => handleFilterChange('type', value)}
          options={[
            { value: 'all', label: 'All Types' },
            { value: 'guild', label: 'Guild Members' },
            { value: 'criminal', label: 'Criminals' },
          ]}
        />

        <FilterSelect
          label="Race"
          value={filters.race}
          onChange={(value) => handleFilterChange('race', value)}
          options={[
            { value: 'all', label: 'All Races' },
            ...(dropdownOptions.race || []).map(r => ({ value: r, label: r }))
          ]}
        />

        <FilterSelect
          label="Class"
          value={filters.class}
          onChange={(value) => handleFilterChange('class', value)}
          options={[
            { value: 'all', label: 'All Classes' },
            ...(dropdownOptions.class || []).map(c => ({ value: c, label: c }))
          ]}
        />

        <FilterSelect
          label="Affiliation"
          value={filters.affiliation}
          onChange={(value) => handleFilterChange('affiliation', value)}
          options={[
            { value: 'all', label: 'All Affiliations' },
            ...uniqueAffiliations.map(a => ({ value: a, label: a }))
          ]}
        />

        <FilterSelect
          label="Personality"
          value={filters.personality}
          onChange={(value) => handleFilterChange('personality', value)}
          options={[
            { value: 'all', label: 'All Personalities' },
            ...(dropdownOptions.personality || []).map(p => ({ value: p, label: p }))
          ]}
        />
      </div>
    </div>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs text-gold-dark uppercase tracking-wide font-medieval mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 md:px-3 py-1 md:py-2 border-2 border-gold-dark rounded bg-parchment-dark text-wood text-sm focus:outline-none focus:border-gold font-medieval"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
