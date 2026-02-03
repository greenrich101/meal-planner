import { useState } from 'react';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useMealPlan } from '../context/MealPlanContext';
import { RecipeCard } from './RecipeCard';
import { proteinEmojis } from '../data/recipes';

const dayTranslations = {
  Monday: 'Seg',
  Tuesday: 'Ter',
  Wednesday: 'Qua',
  Thursday: 'Qui',
  Friday: 'Sex',
  Saturday: 'Sáb',
  Sunday: 'Dom',
};

export function RecipeBrowser() {
  const { recipes, days, mealPlan, assignRecipe } = useMealPlan();
  const [search, setSearch] = useState('');
  const [proteinFilter, setProteinFilter] = useState('all');
  const [hiddenVeggiesOnly, setHiddenVeggiesOnly] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filter recipes
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(search.toLowerCase()) ||
      recipe.description.toLowerCase().includes(search.toLowerCase());
    const matchesProtein = proteinFilter === 'all' || recipe.protein === proteinFilter;
    const matchesVeggies = !hiddenVeggiesOnly || recipe.hiddenVeggies;
    return matchesSearch && matchesProtein && matchesVeggies;
  });

  const handleDragStart = (event) => {
    const recipe = recipes.find((r) => r.id === event.active.id);
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

  // Quick add to first empty day
  const quickAdd = (recipeId) => {
    const emptyDay = days.find((day) => !mealPlan[day]);
    if (emptyDay) {
      assignRecipe(emptyDay, recipeId);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-green-200">
          <h2 className="text-xl font-bold text-green-800">Nossas Receitas</h2>
          <p className="text-sm text-green-600 mt-1">
            Todas sem leite de vaca e prontas em 30 minutos ou menos
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-yellow-300 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar receitas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none bg-green-50"
              />
            </div>

            {/* Protein Filter */}
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'Todos', emoji: '🍽️' },
                { id: 'beef', label: 'Carne', emoji: proteinEmojis.beef },
                { id: 'chicken', label: 'Frango', emoji: proteinEmojis.chicken },
                { id: 'fish', label: 'Peixe', emoji: proteinEmojis.fish },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setProteinFilter(option.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    proteinFilter === option.id
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {option.emoji} {option.label}
                </button>
              ))}
            </div>

            {/* Hidden Veggies Toggle */}
            <button
              onClick={() => setHiddenVeggiesOnly(!hiddenVeggiesOnly)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                hiddenVeggiesOnly
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              🥕 Veggie Ninja
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-green-700 font-medium">
          Mostrando {filteredRecipes.length} de {recipes.length} receitas
        </p>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="relative">
              <div onClick={() => setSelectedRecipe(recipe)}>
                <RecipeCard recipe={recipe} />
              </div>
              <button
                onClick={() => quickAdd(recipe.id)}
                className="absolute top-2 right-2 bg-green-600 text-white w-8 h-8 rounded-full
                           flex items-center justify-center text-lg font-bold
                           opacity-0 hover:opacity-100 transition-opacity shadow-lg
                           hover:bg-green-700 border-2 border-yellow-300"
                title="Adicionar no próximo dia livre"
              >
                +
              </button>
            </div>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-green-200">
            <p className="text-green-600">Nenhuma receita encontrada com esses filtros</p>
            <button
              onClick={() => {
                setSearch('');
                setProteinFilter('all');
                setHiddenVeggiesOnly(false);
              }}
              className="mt-2 text-yellow-600 hover:text-yellow-700 font-semibold"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}

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

function RecipeModal({ recipe, onClose }) {
  const { days, mealPlan, assignRecipe } = useMealPlan();

  const addToDay = (day) => {
    assignRecipe(day, recipe.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-amber-50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-green-600 shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-5xl">{recipe.image}</span>
              <div>
                <h2 className="text-2xl font-bold text-green-800">{recipe.name}</h2>
                <p className="text-green-600 text-sm mt-1">{recipe.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-green-400 hover:text-green-600 text-3xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
              ⏱️ {recipe.prepTime} min preparo + {recipe.cookTime} min cozimento
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
              recipe.protein === 'beef' ? 'bg-red-100 text-red-800' :
              recipe.protein === 'chicken' ? 'bg-amber-100 text-amber-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {recipe.protein === 'beef' ? 'Carne' : recipe.protein === 'chicken' ? 'Frango' : 'Peixe'}
            </span>
            {recipe.hiddenVeggies && (
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">
                🥕 Veggie Ninja
              </span>
            )}
            {recipe.kidFriendly && (
              <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">
                👶 Kids Love
              </span>
            )}
          </div>

          {/* Quick Add to Day */}
          <div className="mb-6 p-4 bg-green-100 rounded-xl border-2 border-green-300">
            <p className="text-sm font-bold text-green-800 mb-2">Adicionar em:</p>
            <div className="flex flex-wrap gap-2">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => addToDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                    mealPlan[day]
                      ? 'bg-gray-200 text-gray-500'
                      : 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                  }`}
                >
                  {dayTranslations[day]}
                  {mealPlan[day] && ' ✓'}
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="font-bold text-green-800 mb-2 text-lg">Ingredientes</h3>
            <ul className="grid grid-cols-2 gap-1 bg-white rounded-lg p-3 border border-green-200">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="text-sm text-green-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                  {ing.amount} {ing.unit} {ing.item}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="font-bold text-green-800 mb-2 text-lg">Modo de Preparo</h3>
            <ol className="space-y-2 bg-white rounded-lg p-3 border border-green-200">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="text-sm text-green-700 flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 text-green-800 rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
