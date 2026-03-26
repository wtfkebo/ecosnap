// ScanReticle — animated ring + sweep line + corner brackets
// scan-pulse, scan-sweep, corner-glow all CSS-only from index.css

export default function ScanReticle({ scanning = true }) {
  return (
    <div className="relative z-10 flex items-center justify-center">
      {/* Outer pulse ring */}
      <div
        className={`w-64 h-64 border border-[#7FA68C] rounded-full flex items-center justify-center ${
          scanning ? 'scan-pulse' : ''
        }`}
      >
        {/* Inner sweep arc — visible while scanning */}
        {scanning && (
          <div className="absolute w-64 h-64 rounded-full scan-sweep overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 75%, rgba(127,166,140,0.35) 100%)',
              }}
            />
          </div>
        )}

        {/* Center dot */}
        <div
          className={`w-4 h-4 rounded-full transition-colors duration-500 ${
            scanning ? 'bg-[#7FA68C]' : 'bg-[#a8d0b4]'
          }`}
        />
      </div>

      {/* Corner brackets — glow when detected */}
      <div className={`absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-[#a8d0b4] rounded-tl-xl opacity-80 ${!scanning ? 'corner-glow' : ''}`} />
      <div className={`absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-[#a8d0b4] rounded-tr-xl opacity-80 ${!scanning ? 'corner-glow' : ''}`} />
      <div className={`absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-[#a8d0b4] rounded-bl-xl opacity-80 ${!scanning ? 'corner-glow' : ''}`} />
      <div className={`absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-[#a8d0b4] rounded-br-xl opacity-80 ${!scanning ? 'corner-glow' : ''}`} />
    </div>
  )
}
