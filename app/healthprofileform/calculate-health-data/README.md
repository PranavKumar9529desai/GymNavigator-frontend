# Health Data Calculation Functions

This directory contains functions for calculating various health-related metrics based on the user's health profile data. These calculations are based on formulas documented in `diet-formulas.md`.

## Available Functions

### Main Function

- `calculateHealthMetrics`: Calculates all health metrics based on the user's profile

### Individual Functions

- `calculateBMI`: Calculates Body Mass Index
- `getBMICategory`: Determines BMI category (Underweight, Normal, etc.)
- `calculateBMR`: Calculates Basal Metabolic Rate
- `calculateTDEE`: Calculates Total Daily Energy Expenditure
- `calculateTargetCalories`: Calculates target daily caloric intake based on goal
- `calculateMacros`: Calculates macronutrient distribution (protein, carbs, fat)

### Utility Functions

- `convertWeight`: Converts weight between kg and lb
- `convertHeight`: Converts height between cm and ft
- `getActivityFactor`: Converts activity level to a numerical factor

## Usage Example

```typescript
import { calculateHealthMetrics } from './calculate-health-data';

// Calculate health metrics
const healthMetrics = calculateHealthMetrics({
  gender: 'female',
  age: 30,
  weight: { value: 65, unit: 'kg' },
  height: { value: 165, unit: 'cm' },
  activityLevel: 'moderate',
  goal: 'fat-loss'
});

// Output:
// {
//   bmi: 23.9,
//   bmiCategory: 'Normal weight',
//   bmr: 1442,
//   tdee: 2235,
//   targetCalories: 1735,
//   macros: {
//     protein: 174,
//     carbs: 130,
//     fat: 58
//   }
// }
```

## Implementation Details

The calculation functions implement the formulas described in `diet-formulas.md`. They follow these steps:

1. Calculate BMI using `weight (kg) / (height (m))²`
2. Calculate BMR using gender-specific formulas
3. Calculate TDEE by multiplying BMR by an activity factor
4. Adjust calories based on the user's goal
5. Distribute calories into macronutrients based on goal type

All functions handle unit conversions automatically, so you can pass values in either metric or imperial units. 