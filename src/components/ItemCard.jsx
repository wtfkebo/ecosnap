// ItemCard — market listing card in 2-col bento grid
// Matches Stitch reuse-market.html market cards exactly

export default function ItemCard({
  image,
  condition = 'Gently Used',
  title,
  points,
  description,
  onList,
}) {
  return (
    <div className="bg-[#020617] border border-[#5F7F76] rounded-[12px] overflow-hidden flex flex-col h-full group">
      {/* Image */}
      <div className="aspect-square w-full relative overflow-hidden bg-surface-container">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Condition pill */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-[#a8d0b4]">
          {condition}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg leading-tight tracking-tight text-[#E5E7EB]">
            {title}
          </h3>
          <span className="text-[#a8d0b4] font-bold whitespace-nowrap ml-2">
            {points}
          </span>
        </div>
        <p className="text-[#98a093] text-xs mb-4 line-clamp-2">{description}</p>

        <div className="mt-auto">
          <button
            onClick={onList}
            className="w-full bg-[#7FA68C] text-black py-3 rounded-xl font-bold text-sm uppercase tracking-wider active:scale-95 transition-transform duration-150"
          >
            List Item
          </button>
        </div>
      </div>
    </div>
  )
}
