// src/components/DspChainViewer.jsx
import { DSP_PROCESSORS } from '../lib/dsp-processors';

export default function DspChainViewer({ dspChain }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl mt-6">
      <h3 className="text-xl font-bold mb-4">🔧 DSP Chain</h3>
      <div className="flex items-center justify-between overflow-x-auto pb-4">
        {dspChain.map((proc, i) => (
          <React.Fragment key={i}>
            <div className="flex-shrink-0 bg-purple-600 p-4 rounded-lg min-w-[180px]">
              <div className="text-white font-bold">{DSP_PROCESSORS[proc.type]?.name || proc.type}</div>
              <div className="text-xs text-gray-200 mt-2">
                {Object.entries(proc.params).map(([k, v]) => (
                  <div key={k}>{k}: {v}</div>
                ))}
              </div>
            </div>
            {i < dspChain.length - 1 && (
              <div className="flex-shrink-0 px-2">
                <svg width="24" height="24">
                  <line x1="0" y1="12" x2="24" y2="12" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrow)" />
                  <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
                    </marker>
                  </defs>
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}