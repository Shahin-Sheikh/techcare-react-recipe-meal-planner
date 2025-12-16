import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RecipeBasic } from "@/types";

interface RecipeCardProps {
  recipe: RecipeBasic;
  onClick: () => void;
}

export function RecipeCard({
  recipe,
  onClick,
}: RecipeCardProps): React.JSX.Element {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl overflow-hidden"
    >
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img
          src={recipe.thumbnail}
          alt={recipe.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <Badge
            variant="secondary"
            className="bg-white/90 backdrop-blur-sm text-xs"
          >
            {recipe.category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2 mb-1">
          {recipe.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600">
          Click to view details
        </p>
      </CardContent>
    </Card>
  );
}
