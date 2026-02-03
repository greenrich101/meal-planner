import { useDroppable } from '@dnd-kit/core';
import { useMealPlan } from '../context/MealPlanContext';
import { RecipeCardStatic } from './RecipeCard';

export function DayCard({ day, displayName, isOver: externalIsOver }) {
  const { mealPlan, getRecipe, clearDay } = useMealPlan();
  const recipeId = mealPlan[day];
  const recipe = recipeId ? getRecipe(recipeId) : null;

  const { setNodeRef, isOver } = useDroppable({
    id: `day-${day}`,
    data: { day },
  });

  const hovering = isOver || externalIsOver;

  return (
    <div
      ref={setNodeRef}
      className={`
        bg-white rounded-xl shadow-sm border-2 transition-all duration-200
        ${hovering ? 'border-yellow-400 bg-yellow-50 shadow-md scale-[1.02]' : 'border-green-200'}
        ${!recipe ? 'min-h-[120px]' : ''}
      `}
    >
      <div className="p-3">
        <h3 className="font-bold text-green-800 text-sm mb-2">{displayName || day}</h3>

        {recipe ? (
          <RecipeCardStatic recipe={recipe} onClear={() => clearDay(day)} />
        ) : (
          <div
            className={`
              border-2 border-dashed rounded-lg p-4 text-center transition-colors
              ${hovering ? 'border-yellow-400 bg-yellow-100' : 'border-green-300 bg-green-50'}
            `}
          >
            <p className={`text-sm ${hovering ? 'text-yellow-700 font-medium' : 'text-green-500'}`}>
              {hovering ? 'Solta aqui!' : 'Arrasta uma receita'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
