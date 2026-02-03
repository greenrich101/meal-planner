import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { recipes } from '../data/recipes';

const MealPlanContext = createContext(null);

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const initialMealPlan = DAYS.reduce((acc, day) => {
  acc[day] = null;
  return acc;
}, {});

const initialGroceryList = [];

export function MealPlanProvider({ children }) {
  const [mealPlan, setMealPlan] = useLocalStorage('mealPlan', initialMealPlan);
  const [groceryList, setGroceryList] = useLocalStorage('groceryList', initialGroceryList);
  const [checkedItems, setCheckedItems] = useLocalStorage('checkedItems', {});

  // Assign a recipe to a day
  const assignRecipe = useCallback((day, recipeId) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: recipeId,
    }));
  }, [setMealPlan]);

  // Clear a day's meal
  const clearDay = useCallback((day) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: null,
    }));
  }, [setMealPlan]);

  // Swap meals between two days
  const swapMeals = useCallback((day1, day2) => {
    setMealPlan((prev) => ({
      ...prev,
      [day1]: prev[day2],
      [day2]: prev[day1],
    }));
  }, [setMealPlan]);

  // Clear entire week
  const clearWeek = useCallback(() => {
    setMealPlan(initialMealPlan);
  }, [setMealPlan]);

  // Get recipe by ID
  const getRecipe = useCallback((recipeId) => {
    return recipes.find((r) => r.id === recipeId) || null;
  }, []);

  // Generate grocery list from current meal plan
  const generateGroceryList = useCallback(() => {
    const ingredientMap = new Map();

    // Collect all ingredients from planned meals
    Object.values(mealPlan).forEach((recipeId) => {
      if (!recipeId) return;
      const recipe = getRecipe(recipeId);
      if (!recipe) return;

      recipe.ingredients.forEach((ing) => {
        const key = `${ing.item}-${ing.unit}`;
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key);
          existing.amount += ing.amount;
        } else {
          ingredientMap.set(key, { ...ing });
        }
      });
    });

    // Convert to array and sort alphabetically
    const list = Array.from(ingredientMap.values()).sort((a, b) =>
      a.item.localeCompare(b.item)
    );

    setGroceryList(list);
    setCheckedItems({});
    return list;
  }, [mealPlan, getRecipe, setGroceryList, setCheckedItems]);

  // Toggle checked state of grocery item
  const toggleGroceryItem = useCallback((itemKey) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  }, [setCheckedItems]);

  // Clear grocery list
  const clearGroceryList = useCallback(() => {
    setGroceryList([]);
    setCheckedItems({});
  }, [setGroceryList, setCheckedItems]);

  // Get planned meals count by protein
  const getProteinCounts = useCallback(() => {
    const counts = { beef: 0, chicken: 0, fish: 0 };
    Object.values(mealPlan).forEach((recipeId) => {
      if (!recipeId) return;
      const recipe = getRecipe(recipeId);
      if (recipe && counts[recipe.protein] !== undefined) {
        counts[recipe.protein]++;
      }
    });
    return counts;
  }, [mealPlan, getRecipe]);

  const value = {
    mealPlan,
    groceryList,
    checkedItems,
    recipes,
    days: DAYS,
    assignRecipe,
    clearDay,
    swapMeals,
    clearWeek,
    getRecipe,
    generateGroceryList,
    toggleGroceryItem,
    clearGroceryList,
    getProteinCounts,
  };

  return (
    <MealPlanContext.Provider value={value}>
      {children}
    </MealPlanContext.Provider>
  );
}

export function useMealPlan() {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  return context;
}
