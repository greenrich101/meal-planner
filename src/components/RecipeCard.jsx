import { useDraggable } from '@dnd-kit/core';
import { proteinColors } from '../data/recipes';

export function RecipeCard({ recipe, isDragging: externalDragging, compact = false }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: recipe.id,
    data: { recipe },
  });

  const dragging = isDragging || externalDragging;

  if (compact) {
    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={`
          p-2 rounded-lg border-2 cursor-grab active:cursor-grabbing
          transition-all duration-200
          ${proteinColors[recipe.protein]}
          ${dragging ? 'opacity-50 scale-95' : 'hover:shadow-md hover:-translate-y-0.5'}
        `}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{recipe.image}</span>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm truncate">{recipe.name}</h4>
            <p className="text-xs opacity-75">{recipe.prepTime + recipe.cookTime} min</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        p-4 rounded-xl border-2 cursor-grab active:cursor-grabbing
        transition-all duration-200
        ${proteinColors[recipe.protein]}
        ${dragging ? 'opacity-50 scale-95 shadow-lg' : 'hover:shadow-lg hover:-translate-y-1'}
      `}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{recipe.image}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base leading-tight">{recipe.name}</h3>
          <p className="text-xs mt-1 opacity-75 line-clamp-2">{recipe.description}</p>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full font-medium">
              {recipe.prepTime + recipe.cookTime} min
            </span>
            {recipe.hiddenVeggies && (
              <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-medium">
                🥕 Veggie Ninja
              </span>
            )}
            {recipe.kidFriendly && (
              <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-medium">
                👶 Kids Love
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Non-draggable version for display in calendar
export function RecipeCardStatic({ recipe, onClear }) {
  return (
    <div
      className={`
        p-3 rounded-lg border-2 relative group
        ${proteinColors[recipe.protein]}
      `}
    >
      {onClear && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full
                     opacity-0 group-hover:opacity-100 transition-opacity
                     flex items-center justify-center text-sm font-bold
                     hover:bg-red-600 shadow-md"
        >
          ×
        </button>
      )}
      <div className="flex items-center gap-2">
        <span className="text-2xl">{recipe.image}</span>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-sm leading-tight">{recipe.name}</h4>
          <p className="text-xs opacity-75 mt-0.5">
            {recipe.prepTime + recipe.cookTime} min
          </p>
        </div>
      </div>
    </div>
  );
}
