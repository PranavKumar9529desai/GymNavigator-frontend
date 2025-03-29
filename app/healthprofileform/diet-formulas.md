Okay, here is a step-by-step breakdown of the formulas based on the provided flowchart. You will input the user's details, and follow these calculations sequentially.

**Required Inputs:**

1.  **Age:** In years
2.  **Gender:** Male or Female
3.  **Weight:** In kilograms (kg)
4.  **Height:** In centimeters (cm)
5.  **Activity Level:** Choose one:
    *   Sedentary (little exercise): Factor = 1.2
    *   Lightly active (light exercise 1-3 days/week): Factor = 1.375
    *   Moderately active (moderate exercise 3-5 days/week): Factor = 1.55
    *   Very active (hard exercise 6-7 days/week): Factor = 1.725
    *   Extra active (very hard exercise & physical job or 2x training): Factor = 1.9
6.  **Weight Goal:** Choose one:
    *   Fat Loss
    *   Maintenance
    *   Muscle Gain
7.  **Macronutrient Goal Type (Optional but recommended for Step 5):** Choose one:
    *   Body-Building
    *   Maintenance
    *   Weight Loss

---

**Calculations:**

**Step 1: Calculate Body Mass Index (BMI)**
*   **Purpose:** To categorize weight status (optional but good context).
*   **Formula:**
    `BMI = Weight (kg) / (Height (cm) / 100)²`
*   **Interpretation (Based on PDF):**
    *   Below 18.5: Underweight
    *   18.5 – 24.9: Normal weight
    *   25 – 29.9: Overweight
    *   30 – 34.9: Obesity (Class 1)
    *   35 – 39.9: Obesity (Class 2)
    *   40 and above: Obesity (Class 3 - Severe/Morbid)

**Step 2: Calculate Basal Metabolic Rate (BMR)**
*   **Purpose:** To find the calories burned at rest.
*   **Formula (Choose based on Gender):**
    *   **For Men:**
        `BMR = 66.5 + (13.75 * Weight (kg)) + (5.003 * Height (cm)) - (6.755 * Age (years))`
    *   **For Women:**
        `BMR = 655.1 + (9.563 * Weight (kg)) + (1.850 * Height (cm)) - (4.676 * Age (years))`

**Step 3: Calculate Total Daily Energy Expenditure (TDEE)**
*   **Purpose:** To estimate total calories burned including activity.
*   **Formula:**
    `TDEE = BMR * Activity Factor`
    *(Use the Activity Factor corresponding to the chosen Activity Level from the inputs)*

**Step 4: Calculate Target Daily Caloric Intake**
*   **Purpose:** To adjust TDEE based on the weight goal.
*   **Formula (Choose based on Weight Goal):**
    *   **For Fat Loss:**
        `Target Calories = TDEE - 500` (for approx. 0.5 kg/week loss)
        *(Note: The PDF allows a range of 500-1000 calorie deficit. 500 is a common starting point.)*
    *   **For Maintenance:**
        `Target Calories = TDEE`
    *   **For Muscle Gain:**
        `Target Calories = TDEE + 250` (for approx. 0.25 kg/week gain)
        *(Note: The PDF allows a range of 250-500 calorie surplus. 250 is a common starting point for lean gain.)*

**Step 5: Calculate Macronutrient Distribution (in Grams)**
*   **Purpose:** To break down the Target Calories into Protein, Carbohydrates, and Fat.
*   **A. Choose Macronutrient Percentages (Based on Macronutrient Goal Type from inputs):**
    *   **Body-Building:**
        *   Protein: 25% to 35%
        *   Carbs: 40% to 60%
        *   Fat: 15% to 25%
    *   **Maintenance:**
        *   Protein: 25% to 35%
        *   Carbs: 30% to 50%
        *   Fat: 25% to 35%
    *   **Weight Loss:**
        *   Protein: 40% to 50%
        *   Carbs: 10% to 30%
        *   Fat: 30% to 40%
    *(Select specific percentages within these ranges. Common practice is to start mid-range or use standard splits like 40% Carbs, 30% Protein, 30% Fat for general fitness/maintenance, or adjust based on preference/needs).*

*   **B. Calculate Grams for each Macronutrient:**
    *   **Standard Calorie Values:**
        *   1 gram Protein = 4 kcal
        *   1 gram Carbohydrate = 4 kcal
        *   1 gram Fat = 9 kcal
    *   **Formulas:**
        `Protein (g) = (Target Calories * Protein %) / 4`
        `Carbs (g) = (Target Calories * Carb %) / 4`
        `Fat (g) = (Target Calories * Fat %) / 9`
        *(Remember to use the percentage as a decimal, e.g., 30% = 0.30)*

**Example Calculation (Using the PDF's example values where applicable):**

*   **Inputs (Hypothetical):**
    *   Age: 30
    *   Gender: Female
    *   Weight: 65 kg
    *   Height: 165 cm
    *   Activity Level: Moderately Active (Factor = 1.55)
    *   Weight Goal: Fat Loss
    *   Macronutrient Goal Type: Weight Loss (Let's use 40% Protein, 30% Carbs, 30% Fat for this example)

*   **Calculations:**
    1.  **BMI:** `65 / (165 / 100)² = 65 / (1.65)² = 65 / 2.7225 ≈ 23.9` (Normal weight)
    2.  **BMR (Female):** `655.1 + (9.563 * 65) + (1.850 * 165) - (4.676 * 30)`
        `= 655.1 + 621.595 + 305.25 - 140.28 ≈ 1441.7 kcal`
    3.  **TDEE:** `1441.7 * 1.55 ≈ 2234.6 kcal`
    4.  **Target Calories (Fat Loss):** `2234.6 - 500 ≈ 1735 kcal` (Let's round to 1735 for simplicity)
    5.  **Macronutrients (Grams):**
        *   Protein: `(1735 * 0.40) / 4 = 694 / 4 ≈ 174 g`
        *   Carbs: `(1735 * 0.30) / 4 = 520.5 / 4 ≈ 130 g`
        *   Fat: `(1735 * 0.30) / 9 = 520.5 / 9 ≈ 58 g`

**Final Output for this Example:**

*   **Target Daily Intake:** 1735 kcal
*   **Protein:** 174 g
*   **Carbohydrates:** 130 g
*   **Fat:** 58 g

You can now plug in any user's inputs into these steps to calculate their estimated needs. Remember these are estimates, and individual results may vary. Adjustments might be needed based on progress and individual response.