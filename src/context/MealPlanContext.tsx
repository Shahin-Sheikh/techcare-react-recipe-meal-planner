import type {
  MealPlan,
  MealPlanAction,
  MealPlanState,
  RecipeDetails,
  UseMealPlanReturn,
} from "@/types";
import { createContext, useReducer, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "recipe-meal-plan";

const initialState: MealPlanState = {
  mealPlan: {},
};

function mealPlanReducer(
  state: MealPlanState,
  action: MealPlanAction
): MealPlanState {
  switch (action.type) {
    case "ADD_MEAL":
      return {
        ...state,
        mealPlan: {
          ...state.mealPlan,
          [action.payload.date]: action.payload.recipe,
        },
      };

    case "REMOVE_MEAL": {
      const newMealPlan = { ...state.mealPlan };
      delete newMealPlan[action.payload.date];
      return {
        ...state,
        mealPlan: newMealPlan,
      };
    }

    case "CLEAR_MEAL_PLAN":
      return {
        ...state,
        mealPlan: {},
      };

    case "LOAD_MEAL_PLAN":
      return {
        ...state,
        mealPlan: action.payload,
      };

    default:
      return state;
  }
}

// Load meal plan from localStorage
function loadMealPlanFromStorage(): MealPlan {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading meal plan from storage:", error);
  }
  return {};
}

// Save meal plan to localStorage
function saveMealPlanToStorage(mealPlan: MealPlan): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mealPlan));
  } catch (error) {
    console.error("Error saving meal plan to storage:", error);
  }
}

// Create context
// eslint-disable-next-line react-refresh/only-export-components
export const MealPlanContext = createContext<UseMealPlanReturn | undefined>(
  undefined
);

interface MealPlanProviderProps {
  children: ReactNode;
}

export function MealPlanProvider({
  children,
}: MealPlanProviderProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    mealPlanReducer,
    initialState,
    (initial) => {
      const loadedMealPlan = loadMealPlanFromStorage();
      return {
        ...initial,
        mealPlan: loadedMealPlan,
      };
    }
  );

  // Save to localStorage whenever meal plan changes
  useEffect(() => {
    saveMealPlanToStorage(state.mealPlan);
  }, [state.mealPlan]);

  const value: UseMealPlanReturn = {
    mealPlan: state.mealPlan,
    addMeal: (date: string, recipe: RecipeDetails) => {
      dispatch({ type: "ADD_MEAL", payload: { date, recipe } });
    },
    removeMeal: (date: string) => {
      dispatch({ type: "REMOVE_MEAL", payload: { date } });
    },
    clearMealPlan: () => {
      dispatch({ type: "CLEAR_MEAL_PLAN" });
    },
  };

  return (
    <MealPlanContext.Provider value={value}>
      {children}
    </MealPlanContext.Provider>
  );
}
