// src/app/diet-page/components/DietPlanner/DietDisplay/MealCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define a type for the meal data (consider putting this in types.ts)
export interface Meal {
    id: string | number;
    name: string;
    time: string;
    description: string;
    instructions: string[];
    protein: string; // e.g., "20% (100cal)"
    fat: string;     // e.g., "30% (120cal)"
    carbs: string;   // e.g., "50% (140cal)"
}

interface MealCardProps {
    meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
    return (
        <Card className="mb-4">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">{`${meal.name} : ${meal.time}`}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
                <p><span className="font-medium">Meal:</span> {meal.description}</p>
                <div>
                    <p className="font-medium">Instructions:</p>
                    <ul className="list-disc list-inside text-muted-foreground pl-2">
                        {meal.instructions.map((inst, index) => (
                            <li key={index as number}>{inst}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="font-medium">Macros:</p>
                    <div className="text-muted-foreground pl-2">
                        <p>Protein: {meal.protein}</p>
                        <p>Fat: {meal.fat}</p>
                        <p>Carbs: {meal.carbs}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}