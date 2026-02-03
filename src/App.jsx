import { useState } from 'react';
import { MealPlanProvider } from './context/MealPlanContext';
import { Layout } from './components/Layout';
import { Calendar } from './components/Calendar';
import { RecipeBrowser } from './components/RecipeBrowser';
import { GroceryList } from './components/GroceryList';

function App() {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <MealPlanProvider>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'calendar' && <Calendar />}
        {activeTab === 'recipes' && <RecipeBrowser />}
        {activeTab === 'grocery' && <GroceryList />}
      </Layout>
    </MealPlanProvider>
  );
}

export default App;
