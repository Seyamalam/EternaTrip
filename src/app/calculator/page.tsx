"use client";

import { TravelBudgetCalculator } from "@/components/calculator/travel-budget-calculator";

export default function CalculatorPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Travel Budget Calculator</h1>
        <p className="text-gray-600 mb-8">
          Plan your trip budget by estimating costs for accommodation,
          transportation, activities, and more.
        </p>
        <TravelBudgetCalculator />
      </div>
    </div>
  );
} 