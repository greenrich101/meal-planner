const tabs = [
  { id: 'calendar', label: 'Cardápio', icon: '📅' },
  { id: 'recipes', label: 'Receitas', icon: '📖' },
  { id: 'grocery', label: 'Compras', icon: '🛒' },
];

export function Layout({ children, activeTab, onTabChange }) {
  return (
    <div className="min-h-screen bg-amber-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Retro Header */}
      <header className="bg-gradient-to-r from-green-700 via-green-600 to-yellow-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            {/* Retro badge */}
            <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-yellow-300 shadow-md">
              <span className="text-2xl">🍲</span>
            </div>
            <div>
              <h1
                className="text-3xl font-black text-white tracking-tight drop-shadow-md"
                style={{ fontFamily: "'Archivo Black', sans-serif" }}
              >
                BOM
              </h1>
              <p className="text-yellow-200 text-sm font-medium tracking-widest uppercase">
                Bureau of Meals
              </p>
            </div>
          </div>
          <p className="text-green-100 text-sm mt-2 italic">
            Comida boa, sem leite de vaca, pra toda família
          </p>
        </div>
        {/* Retro stripe */}
        <div className="h-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-green-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-5 py-3 text-sm font-semibold transition-all relative ${
                  activeTab === tab.id
                    ? 'text-yellow-300 bg-green-900'
                    : 'text-green-100 hover:text-yellow-200 hover:bg-green-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Retro Footer */}
      <footer className="bg-green-800 mt-auto">
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div>
        <div className="max-w-7xl mx-auto px-4 py-4 text-center">
          <p className="text-green-200 text-sm">
            Feito com amor para a família
          </p>
          <p className="text-green-400 text-xs mt-1">
            🇧🇷 Todas as receitas são sem leite de vaca
          </p>
        </div>
      </footer>
    </div>
  );
}
