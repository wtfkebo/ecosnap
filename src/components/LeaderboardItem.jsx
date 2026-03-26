// LeaderboardItem — single row in community leaderboard
// Matches Stitch rewards-dashboard.html leaderboard rows exactly

export default function LeaderboardItem({
  rank,
  avatar,
  name,
  subtitle,
  points,
  isCurrentUser = false,
}) {
  return (
    <div
      className={`flex items-center justify-between p-5 transition-colors ${
        isCurrentUser
          ? 'bg-primary/5'
          : 'hover:bg-surface-container'
      }`}
    >
      {/* Left: rank + avatar + name */}
      <div className="flex items-center gap-4">
        <span
          className={`font-black w-4 text-center ${
            isCurrentUser ? 'text-[#a8d0b4]' : 'text-[#98a093]'
          }`}
        >
          {rank}
        </span>

        <div
          className={`w-10 h-10 rounded-full overflow-hidden border ${
            isCurrentUser ? 'border-[#a8d0b4]/30' : 'border-transparent'
          }`}
        >
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-[#98a093] text-sm">
                person
              </span>
            </div>
          )}
        </div>

        <div>
          <p className="font-bold text-sm text-[#E5E7EB]">{name}</p>
          <p className="text-[10px] text-[#98a093] uppercase tracking-wider">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: points */}
      <span
        className={`font-bold ${
          isCurrentUser ? 'text-[#a8d0b4]' : 'text-[#98a093]'
        }`}
      >
        {points}
      </span>
    </div>
  )
}
