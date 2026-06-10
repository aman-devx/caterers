interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
}

export default function StarRating({ rating, size = "md" }: StarRatingProps) {
  const starSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <div className="flex items-center gap-1.5" aria-label={`Rating: ${rating} out of 5`}>
      <div className={`flex ${starSize}`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = rating >= i + 1;
          const half = !filled && rating > i && rating < i + 1;

          return (
            <span
              key={i}
              className={
                filled
                  ? "text-amber-400"
                  : half
                    ? "text-amber-300"
                    : "text-stone-300"
              }
            >
              ★
            </span>
          );
        })}
      </div>
      <span className="text-sm font-semibold text-stone-700">{rating.toFixed(1)}</span>
    </div>
  );
}
