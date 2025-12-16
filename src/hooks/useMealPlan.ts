import { useContext } from "react";
import { MealPlanContext } from "@/context/MealPlanContext";
import type { UseMealPlanReturn } from "@/types";

/**
 * Custom hook for accessing meal plan context
 * Provides meal plan state and actions (add, remove, clear)
 */
export function useMealPlan(): UseMealPlanReturn {
  const context = useContext(MealPlanContext);

  if (!context) {
    throw new Error("useMealPlan must be used within a MealPlanProvider");
  }

  return context;
}
