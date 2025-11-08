import { useState } from 'react'

export default function MergePreview({ differences, onConfirm, onCancel, report }) {
  const [selectedTab, setSelectedTab] = useState('summary')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-parchment text-wood p-6 rounded-lg border-2 border-gold max-w-2xl max-h-96 overflow-y-auto">
        <h2 className="text-2xl font-medieval font-bold mb-4 text-gold-dark">
          <i className="ra ra-scroll" style={{ marginRight: '0.5rem', color: '#d4a574' }}></i>
          Merge Preview
        </h2>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-gold-light text-wood p-3 rounded text-center">
            <div className="text-2xl font-bold">{report.summary.added}</div>
            <div className="text-xs uppercase">Added</div>
          </div>
          <div className="bg-gold-light text-wood p-3 rounded text-center">
            <div className="text-2xl font-bold">{report.summary.modified}</div>
            <div className="text-xs uppercase">Modified</div>
          </div>
          <div className="bg-gold-light text-wood p-3 rounded text-center">
            <div className="text-2xl font-bold">{report.summary.removed}</div>
            <div className="text-xs uppercase">Removed</div>
          </div>
          <div className="bg-gold-light text-wood p-3 rounded text-center">
            <div className="text-2xl font-bold">{report.summary.unchanged}</div>
            <div className="text-xs uppercase">Unchanged</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-gold-dark">
          {['summary', 'added', 'modified', 'removed'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 font-medieval uppercase text-sm ${
                selectedTab === tab
                  ? 'border-b-2 border-gold text-gold-dark'
                  : 'text-wood-light hover:text-gold'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({report.summary[tab] || 0})
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
          {selectedTab === 'summary' && (
            <div className="text-sm text-wood-light">
              <p className="mb-3">Review the changes that will be applied:</p>
              <ul className="space-y-2 ml-4">
                <li>✓ <strong>{report.summary.added}</strong> new character(s) will be added</li>
                <li>✎ <strong>{report.summary.modified}</strong> character(s) will be updated</li>
                <li>✗ <strong>{report.summary.removed}</strong> character(s) will be removed</li>
              </ul>
            </div>
          )}

          {selectedTab === 'added' && (
            <div className="space-y-2">
              {report.details.added.map(item => (
                <div key={item.id} className="bg-parchment-dark p-2 rounded border-l-4 border-gold">
                  <div className="font-bold text-sm">{item.name}</div>
                  <div className="text-xs text-wood-light">ID: {item.id}</div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'modified' && (
            <div className="space-y-3">
              {report.details.modified.map(item => (
                <div key={item.id} className="bg-parchment-dark p-2 rounded border-l-4 border-gold-dark">
                  <div className="font-bold text-sm mb-1">{item.name}</div>
                  <div className="text-xs text-wood-light space-y-1">
                    {item.changes.slice(0, 3).map((change, idx) => (
                      <div key={idx}>
                        <strong>{change.field}:</strong> {String(change.from).substring(0, 20)}... → {String(change.to).substring(0, 20)}...
                      </div>
                    ))}
                    {item.changes.length > 3 && <div>+{item.changes.length - 3} more changes</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'removed' && (
            <div className="space-y-2">
              {report.details.removed.map(item => (
                <div key={item.id} className="bg-parchment-dark p-2 rounded border-l-4 border-seal">
                  <div className="font-bold text-sm">{item.name}</div>
                  <div className="text-xs text-wood-light">ID: {item.id}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(differences)}
            className="flex-1 px-4 py-2 bg-gold-dark text-parchment hover:bg-gold transition rounded font-medieval"
          >
            Confirm Merge
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-wood-light text-parchment hover:bg-wood transition rounded font-medieval"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
