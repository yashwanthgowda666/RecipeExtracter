import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChefHat, Database, Utensils } from 'lucide-react';
import ExtractTab from './pages/ExtractTab';
import HistoryTab from './pages/HistoryTab';
import MealPlannerTab from './pages/MealPlannerTab';

const queryClient = new QueryClient();

function App() {
  // simple function to get the style for our nav links
  const getLinkStyle = ({ isActive }) => {
    let base = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ";
    if (isActive) {
      return base + "border-orange-500 text-gray-900";
    } else {
      return base + "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <ChefHat className="h-8 w-8 text-orange-500" />
                    <span className="ml-2 font-bold text-xl text-gray-900">My Recipe App</span>
                  </div>
                  <nav className="ml-6 flex space-x-8">
                    <NavLink to="/" className={getLinkStyle}>
                      <Utensils className="h-4 w-4 mr-1"/> Home
                    </NavLink>
                    <NavLink to="/history" className={getLinkStyle}>
                      <Database className="h-4 w-4 mr-1"/> History
                    </NavLink>
                    <NavLink to="/planner" className={getLinkStyle}>
                      <ChefHat className="h-4 w-4 mr-1"/> Planner
                    </NavLink>
                  </nav>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<ExtractTab />} />
              <Route path="/history" element={<HistoryTab />} />
              <Route path="/planner" element={<MealPlannerTab />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
