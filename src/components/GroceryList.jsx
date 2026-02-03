import { useState } from 'react';
import { useMealPlan } from '../context/MealPlanContext';

const dayTranslations = {
  Monday: 'Segunda',
  Tuesday: 'Terça',
  Wednesday: 'Quarta',
  Thursday: 'Quinta',
  Friday: 'Sexta',
  Saturday: 'Sábado',
  Sunday: 'Domingo',
};

const categoryTranslations = {
  'Meat & Fish': '🥩 Carnes & Peixes',
  'Produce': '🥬 Hortifruti',
  'Dairy-Free': '🥛 Sem Leite',
  'Frozen': '🧊 Congelados',
  'Canned': '🥫 Enlatados',
  'Pantry': '🏪 Despensa',
  'Other': '📦 Outros',
};

export function GroceryList() {
  const {
    groceryList,
    checkedItems,
    mealPlan,
    getRecipe,
    days,
    generateGroceryList,
    toggleGroceryItem,
    clearGroceryList,
  } = useMealPlan();

  const [copied, setCopied] = useState(false);

  // Get planned meals summary
  const plannedMeals = days
    .map((day) => ({ day, recipe: mealPlan[day] ? getRecipe(mealPlan[day]) : null }))
    .filter((m) => m.recipe);

  // Group ingredients by category (rough grouping)
  const categorizeItem = (item) => {
    const produce = ['onion', 'garlic', 'carrot', 'celery', 'zucchini', 'capsicum', 'broccoli', 'lettuce', 'tomato', 'potato', 'sweet potato', 'cabbage', 'cucumber', 'avocado', 'lemon', 'lime', 'ginger', 'cauliflower', 'spring onion', 'okra', 'mushrooms', 'coriander', 'orange'];
    const protein = ['beef mince', 'beef strips', 'chicken breast', 'chicken thigh', 'white fish', 'salmon', 'tinned salmon', 'tinned tuna', 'bacon', 'beef sausage'];
    const dairy = ['dairy-free butter', 'dairy-free cheese', 'oat milk', 'coconut cream'];
    const pantry = ['olive oil', 'vegetable oil', 'sesame oil', 'soy sauce', 'honey', 'cumin', 'paprika', 'oregano', 'italian herbs', 'curry powder', 'salt', 'pepper', 'breadcrumbs', 'flour', 'cornflour', 'rice', 'pasta', 'spaghetti', 'lasagne sheets', 'tortillas', 'burger buns', 'corn chips', 'stock', 'tomato paste', 'tinned crushed tomatoes', 'worcestershire sauce', 'hoisin sauce', 'rice wine vinegar', 'nutritional yeast', 'dill', 'sesame seeds', 'garlic powder', 'cassava flour', 'farofa', 'bay leaves', 'turmeric'];
    const frozen = ['frozen peas', 'corn kernels'];
    const canned = ['kidney beans', 'water chestnuts', 'black beans', 'pinto beans'];

    const itemLower = item.toLowerCase();
    if (produce.some(p => itemLower.includes(p))) return 'Produce';
    if (protein.some(p => itemLower.includes(p))) return 'Meat & Fish';
    if (dairy.some(p => itemLower.includes(p))) return 'Dairy-Free';
    if (frozen.some(p => itemLower.includes(p))) return 'Frozen';
    if (canned.some(p => itemLower.includes(p))) return 'Canned';
    if (pantry.some(p => itemLower.includes(p))) return 'Pantry';
    return 'Other';
  };

  const groupedItems = groceryList.reduce((acc, item) => {
    const category = categorizeItem(item.item);
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const categoryOrder = ['Meat & Fish', 'Produce', 'Dairy-Free', 'Frozen', 'Canned', 'Pantry', 'Other'];

  // Format item for display
  const formatItem = (item) => {
    const amount = item.amount % 1 === 0 ? item.amount : item.amount.toFixed(1);
    return `${amount} ${item.unit} ${item.item}`;
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    const text = categoryOrder
      .filter(cat => groupedItems[cat])
      .map(cat => {
        const items = groupedItems[cat]
          .map(item => `- ${formatItem(item)}`)
          .join('\n');
        return `${categoryTranslations[cat]}:\n${items}`;
      })
      .join('\n\n');

    const header = `🛒 Lista de Compras da Semana\n${'='.repeat(30)}\n\nRefeições Planejadas:\n${plannedMeals.map(m => `- ${dayTranslations[m.day]}: ${m.recipe.name}`).join('\n')}\n\n`;

    navigator.clipboard.writeText(header + text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalItems = groceryList.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl p-4 shadow-sm border-2 border-green-200">
        <div>
          <h2 className="text-xl font-bold text-green-800">Lista de Compras</h2>
          <p className="text-sm text-green-600 mt-1">
            {plannedMeals.length} refeições planejadas pra semana
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={generateGroceryList}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md"
          >
            Gerar Lista
          </button>
          {groceryList.length > 0 && (
            <>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-yellow-500 text-green-900 rounded-lg hover:bg-yellow-400 transition-colors font-semibold shadow-md"
              >
                {copied ? '✓ Copiado!' : 'Copiar Lista'}
              </button>
              <button
                onClick={clearGroceryList}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium border border-red-200"
              >
                Limpar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Planned Meals Summary */}
      {plannedMeals.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border-2 border-yellow-300 p-4">
          <h3 className="font-bold text-green-800 mb-3">Cardápio da Semana</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {days.map((day) => {
              const recipe = mealPlan[day] ? getRecipe(mealPlan[day]) : null;
              return (
                <div
                  key={day}
                  className={`p-2 rounded-lg text-center ${
                    recipe ? 'bg-green-100 border border-green-300' : 'bg-gray-100'
                  }`}
                >
                  <p className="text-xs font-bold text-green-700">{dayTranslations[day].slice(0, 3)}</p>
                  {recipe ? (
                    <p className="text-sm mt-1 flex items-center justify-center gap-1">
                      <span>{recipe.image}</span>
                      <span className="truncate text-green-800">{recipe.name.split(' ')[0]}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 mt-1">-</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No meals planned */}
      {plannedMeals.length === 0 && (
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-6 text-center">
          <p className="text-yellow-800 font-medium">
            Ainda não tem nada planejado. Vai no Cardápio e adiciona umas receitas!
          </p>
        </div>
      )}

      {/* Grocery List */}
      {groceryList.length > 0 ? (
        <div className="space-y-4">
          {/* Progress */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-green-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-green-700">Progresso das Compras</span>
              <span className="text-sm text-green-600 font-medium">{checkedCount} / {totalItems} itens</span>
            </div>
            <div className="w-full bg-green-100 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-yellow-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` }}
              />
            </div>
            {checkedCount === totalItems && totalItems > 0 && (
              <p className="text-center text-green-600 font-bold mt-2">
                Compras completas! Bora cozinhar!
              </p>
            )}
          </div>

          {/* Items by category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryOrder
              .filter((cat) => groupedItems[cat])
              .map((category) => (
                <div
                  key={category}
                  className="bg-white rounded-2xl shadow-sm border-2 border-green-200 overflow-hidden"
                >
                  <div className="bg-green-600 px-4 py-2">
                    <h3 className="font-bold text-white">{categoryTranslations[category]}</h3>
                  </div>
                  <ul className="divide-y divide-green-100">
                    {groupedItems[category].map((item, index) => {
                      const itemKey = `${item.item}-${item.unit}`;
                      const isChecked = checkedItems[itemKey];
                      return (
                        <li
                          key={index}
                          className={`px-4 py-2 flex items-center gap-3 transition-colors ${
                            isChecked ? 'bg-green-50' : 'hover:bg-yellow-50'
                          }`}
                        >
                          <button
                            onClick={() => toggleGroceryItem(itemKey)}
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                              isChecked
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-green-400 hover:border-yellow-500 hover:bg-yellow-100'
                            }`}
                          >
                            {isChecked && '✓'}
                          </button>
                          <span
                            className={`flex-1 text-sm ${
                              isChecked ? 'text-green-400 line-through' : 'text-green-800'
                            }`}
                          >
                            {formatItem(item)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      ) : plannedMeals.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border-2 border-yellow-300 p-8 text-center">
          <p className="text-green-700 mb-4 font-medium">
            Clica em "Gerar Lista" pra criar a lista de compras das refeições planejadas
          </p>
          <button
            onClick={generateGroceryList}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold shadow-lg"
          >
            Gerar Lista de Compras
          </button>
        </div>
      ) : null}
    </div>
  );
}
