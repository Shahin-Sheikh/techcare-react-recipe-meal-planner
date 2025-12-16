import { ErrorBoundary } from "@/components/common";
import { MealPlanProvider } from "@/context/MealPlanContext";
import HomePage from "@/pages/HomePage";

function App() {
  return (
    <ErrorBoundary>
      <MealPlanProvider>
        <HomePage />
      </MealPlanProvider>
    </ErrorBoundary>
  );
}

export default App;
