// Button — primary / secondary / ghost variants
// Matches Stitch scan-screen.html action buttons exactly

export default function Button({
  variant = 'primary',
  icon,
  pointsBadge,
  onClick,
  children,
  className = '',
}) {
  const base =
    'flex items-center justify-between px-6 active:scale-95 transition-transform duration-200 font-bold rounded-xl'

  const variants = {
    primary:
      'w-full h-14 bg-[#7FA68C] text-black ' + base,
    secondary:
      'w-full h-14 border border-[#AEB6A8] text-white font-semibold ' + base,
    ghost:
      'w-full h-10 text-[#9CA3AF] text-sm font-medium uppercase tracking-widest hover:text-white transition-colors duration-200 flex items-center justify-center',
  }

  return (
    <button
      onClick={onClick}
      className={`${variants[variant]} ${className}`}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className="material-symbols-outlined">
            {icon}
          </span>
        )}
        <span>{children}</span>
      </div>
      {pointsBadge && (
        <span className="text-sm">{pointsBadge}</span>
      )}
    </button>
  )
}
