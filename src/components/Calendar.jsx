import { useState } from 'react';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useMealPlan } from '../context/MealPlanContext';
import { DayCard } from './DayCard';
import { RecipeCard } from './RecipeCard';
import { proteinEmojis } from '../data/recipes';

const dayTranslations = {
  Monday: 'Segunda',
  Tuesday: 'Terça',
  Wednesday: 'Quarta',
  Thursday: 'Quinta',
  Friday: 'Sexta',
  Saturday: 'Sábado',
  Sunday: 'Domingo',
};

export function Calendar() {
  const { days, mealPlan, recipes, assignRecipe, clearWeek, getRecipe, getProteinCounts } = useMealPlan();
  const [activeRecipe, setActiveRecipe] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const recipe = recipes.find((r) => r.id === active.id);
    if (recipe) {
      setActiveRecipe(recipe);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveRecipe(null);

    if (over && over.id.toString().startsWith('day-')) {
      const day = over.data.current.day;
      assignRecipe(day, active.id);
    }
  };

  const proteinCounts = getProteinCounts();
  const plannedMeals = Object.values(mealPlan).filter(Boolean).length;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Header with stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl p-4 shadow-sm border-2 border-green-200">
          <div>
            <h2 className="text-xl font-bold text-green-800">Cardápio da Semana</h2>
            <p className="text-sm text-green-600 mt-1">
              {plannedMeals}/7 jantares planejados
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Protein summary */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-700 font-medium">Esta semana:</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                {proteinEmojis.beef} {proteinCounts.beef}
              </span>
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-medium">
                {proteinEmojis.chicken} {proteinCounts.chicken}
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                {proteinEmojis.fish} {proteinCounts.fish}
              </span>
            </div>

            <button
              onClick={clearWeek}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium border border-red-200"
            >
              Limpar Semana
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {days.map((day) => (
            <DayCard key={day} day={day} displayName={dayTranslations[day]} />
          ))}
        </div>

        {/* Quick Recipe Selection */}
        <div className="mt-8 bg-white rounded-2xl p-5 shadow-sm border-2 border-yellow-300">
          <h3 className="text-lg font-bold text-green-800 mb-4">
            Arrasta pra cá! Escolhe a receita e joga no dia
          </h3>

          {/* Category tabs */}
          <div className="space-y-5">
            {['beef', 'chicken', 'fish'].map((protein) => (
              <div key={protein}>
                <h4 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-2 uppercase tracking-wide">
                  <span className="text-lg">{proteinEmojis[protein]}</span>
                  <span>{protein === 'beef' ? 'Carne' : protein === 'chicken' ? 'Frango' : 'Peixe'}</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {recipes
                    .filter((r) => r.protein === protein)
                    .slice(0, 6)
                    .map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        compact
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeRecipe ? (
          <div className="opacity-90">
            <RecipeCard recipe={activeRecipe} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
