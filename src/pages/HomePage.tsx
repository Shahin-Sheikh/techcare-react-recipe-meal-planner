import { Button } from "@/components/ui/button";
import { MealPlanView, ShoppingList } from "@/features/meal-plans";
import { RecipeDetailsModal, RecipeSearch } from "@/features/recipes";
import { Calendar, ChefHat, Home, Search, ShoppingCart } from "lucide-react";
import { useState } from "react";

type View = "search" | "mealplan" | "shopping";

export default function HomePage() {
  const [currentView, setCurrentView] = useState<View>("search");
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const handleRecipeClick = (id: string) => {
    setSelectedRecipeId(id);
  };

  const handleCloseModal = () => {
    setSelectedRecipeId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer">
              <Home
                className="h-8 w-8 text-tale-600"
                onClick={() => setCurrentView("search")}
              />
            </div>
            <nav className="flex space-x-1">
              <Button
                onClick={() => setCurrentView("search")}
                variant={currentView === "search" ? "default" : "ghost"}
                className="cursor-pointer"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
              <Button
                onClick={() => setCurrentView("mealplan")}
                variant={currentView === "mealplan" ? "default" : "ghost"}
                className="cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                Meal Plan
              </Button>
              <Button
                onClick={() => setCurrentView("shopping")}
                variant={currentView === "shopping" ? "default" : "ghost"}
                className="cursor-pointer"
              >
                <ShoppingCart className="h-4 w-4" />
                Shopping List
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        {currentView === "search" && (
          <RecipeSearch onRecipeClick={handleRecipeClick} />
        )}
        {currentView === "mealplan" && (
          <MealPlanView onRecipeClick={handleRecipeClick} />
        )}
        {currentView === "shopping" && <ShoppingList />}
      </main>

      {/* Recipe Details Modal */}
      {selectedRecipeId && (
        <RecipeDetailsModal
          recipeId={selectedRecipeId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
