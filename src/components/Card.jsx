// Card — generic dark surface container
// Used for milestone, impact stats, profile stat tiles

export default function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-surface-container rounded-2xl p-6 border border-[#32457c]/10 ${className}`}
    >
      {children}
    </div>
  )
}
