# GymNavigator Admin  

[![GymNavigator](https://img.shields.io/badge/version-1.0.0-brightgreen)]()  
[![Next.js](https://img.shields.io/badge/Framework-Next.js-000?logo=nextdotjs)](https://nextjs.org/)  
[![Hono](https://img.shields.io/badge/Backend-Hono-yellow)](https://hono.dev/)  
[![Cloudflare Workers](https://img.shields.io/badge/Deployment-Cloudflare%20Workers-orange)](https://workers.cloudflare.com/)  
[![Prisma](https://img.shields.io/badge/Database-Prisma-blue)](https://www.prisma.io/)  

GymNavigator Admin is a professional and robust web application designed to transform the way gym owners manage their business operations. This platform simplifies gym management by offering a feature-rich dashboard for administrators and trainers. It allows gym owners to oversee trainers, users, and sales operations while also providing trainers with tools to manage their assigned clients effectively.  

---
I want that change the gemnavigator admin to just gemnavigator as we have merged the admin with the original gemnavigator.
## **Features**  

### **For Gym Owners**  
- **Comprehensive Dashboard:**  
  Manage trainers, members, and sales activities with an intuitive and user-friendly interface.  

- **Trainer Management:**  
  Assign trainers to gym members and track their performance.  

- **User Management:**  
  View and manage gym member profiles, including attendance, personalized plans, and progress reports.  

- **Sales Tracking:**  
  Monitor subscription packages, membership renewals, and revenue generated.  

---

### **For Trainers**  
- **Client Management:**  
  View assigned gym members and their personalized workout and diet plans.  

- **Attendance Management:**  
  Generate unique QR codes for gym members to scan, ensuring valid entry and attendance tracking.  

- **Workout Planner:**  
  Create and assign workout routines with detailed descriptions and video guides.  

---

## **Technology Stack**  

- **Frontend:**  
  - Next.js 14 (Modern App Router)  
  - NextAuth v5 for authentication  
  - ShadCN for UI components  
  - Tailwind CSS for styling  
  - Framer Motion for animations  

- **Backend:**  
  - Built with Hono  
  - Deployed on Cloudflare Workers  

- **Database:**  
  - Cloudflare's D1 serverless database integrated with Prisma ORM  

- **Images:**  
  - Managed via Cloudinary  

---

## **Screenshots**  

### **Owner Dashboard**  
_Manage your gym with ease using the owner dashboard._  
[{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/diet/assigndietplan/assigndietplanwithai/_actions/generate-ai-diet.ts",
	"owner": "typescript",
	"code": "2345",
	"severity": 8,
	"message": "Argument of type '{ targetCalories: number; dietPreference: string; medicalConditions: string[]; location: string; country: string; specialInstructions?: string | undefined; }' is not assignable to parameter of type 'DietGenerationParams'.\n  Type '{ targetCalories: number; dietPreference: string; medicalConditions: string[]; location: string; country: string; specialInstructions?: string | undefined; }' is missing the following properties from type 'DietGenerationParams': healthProfile, state",
	"source": "ts",
	"startLineNumber": 70,
	"startColumn": 37,
	"endLineNumber": 70,
	"endColumn": 52
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_actions/assign-workout.ts",
	"owner": "_generated_diagnostic_collection_name_#4",
	"code": {
		"value": "lint/suspicious/noExplicitAny",
		"target": {
			"$mid": 1,
			"path": "/linter/rules/no-explicit-any",
			"scheme": "https",
			"authority": "biomejs.dev"
		}
	},
	"severity": 8,
	"message": "Unexpected any. Specify a different type.",
	"source": "biome",
	"startLineNumber": 38,
	"startColumn": 19,
	"endLineNumber": 38,
	"endColumn": 22
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_components/UserWorkoutAssignmentDetails.tsx",
	"owner": "typescript",
	"code": "2339",
	"severity": 8,
	"message": "Property 'HealthProfile' does not exist on type 'AssignedUser'.",
	"source": "ts",
	"startLineNumber": 90,
	"startColumn": 13,
	"endLineNumber": 90,
	"endColumn": 26
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_components/UserWorkoutAssignmentDetails.tsx",
	"owner": "typescript",
	"code": "2339",
	"severity": 8,
	"message": "Property 'HealthProfile' does not exist on type 'AssignedUser'.",
	"source": "ts",
	"startLineNumber": 95,
	"startColumn": 17,
	"endLineNumber": 95,
	"endColumn": 30
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_components/UserWorkoutAssignmentDetails.tsx",
	"owner": "typescript",
	"code": "2339",
	"severity": 8,
	"message": "Property 'HealthProfile' does not exist on type 'AssignedUser'.",
	"source": "ts",
	"startLineNumber": 101,
	"startColumn": 17,
	"endLineNumber": 101,
	"endColumn": 30
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_components/UserWorkoutAssignmentDetails.tsx",
	"owner": "typescript",
	"code": "2339",
	"severity": 8,
	"message": "Property 'HealthProfile' does not exist on type 'AssignedUser'.",
	"source": "ts",
	"startLineNumber": 107,
	"startColumn": 17,
	"endLineNumber": 107,
	"endColumn": 30
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_components/UserWorkoutAssignmentDetails.tsx",
	"owner": "typescript",
	"code": "2339",
	"severity": 8,
	"message": "Property 'HealthProfile' does not exist on type 'AssignedUser'.",
	"source": "ts",
	"startLineNumber": 113,
	"startColumn": 17,
	"endLineNumber": 113,
	"endColumn": 30
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_components/UserWorkoutAssignmentDetails.tsx",
	"owner": "typescript",
	"code": "2339",
	"severity": 8,
	"message": "Property 'schedules' does not exist on type 'WorkoutPlan'.",
	"source": "ts",
	"startLineNumber": 176,
	"startColumn": 20,
	"endLineNumber": 176,
	"endColumn": 29
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_components/UserWorkoutAssignmentDetails.tsx",
	"owner": "typescript",
	"code": "2339",
	"severity": 8,
	"message": "Property 'schedules' does not exist on type 'WorkoutPlan'.",
	"source": "ts",
	"startLineNumber": 189,
	"startColumn": 18,
	"endLineNumber": 189,
	"endColumn": 27
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_components/UserWorkoutAssignmentDetails.tsx",
	"owner": "typescript",
	"code": "2339",
	"severity": 8,
	"message": "Property 'schedules' does not exist on type 'WorkoutPlan'.",
	"source": "ts",
	"startLineNumber": 195,
	"startColumn": 16,
	"endLineNumber": 195,
	"endColumn": 25
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_components/UserWorkoutAssignmentDetails.tsx",
	"owner": "typescript",
	"code": "7006",
	"severity": 8,
	"message": "Parameter 'schedule' implicitly has an 'any' type.",
	"source": "ts",
	"startLineNumber": 195,
	"startColumn": 31,
	"endLineNumber": 195,
	"endColumn": 39
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_components/workout-search-filters.tsx",
	"owner": "typescript",
	"code": "2339",
	"severity": 8,
	"message": "Property 'schedules' does not exist on type 'WorkoutPlan'.",
	"source": "ts",
	"startLineNumber": 25,
	"startColumn": 10,
	"endLineNumber": 25,
	"endColumn": 19
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_components/workout-search-filters.tsx",
	"owner": "typescript",
	"code": "7006",
	"severity": 8,
	"message": "Parameter 'schedule' implicitly has an 'any' type.",
	"source": "ts",
	"startLineNumber": 25,
	"startColumn": 25,
	"endLineNumber": 25,
	"endColumn": 33
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_components/workout-search-filters.tsx",
	"owner": "typescript",
	"code": "2339",
	"severity": 8,
	"message": "Property 'schedules' does not exist on type 'WorkoutPlan'.",
	"source": "ts",
	"startLineNumber": 32,
	"startColumn": 40,
	"endLineNumber": 32,
	"endColumn": 49
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_components/workout-search-filters.tsx",
	"owner": "typescript",
	"code": "7006",
	"severity": 8,
	"message": "Parameter 's' implicitly has an 'any' type.",
	"source": "ts",
	"startLineNumber": 32,
	"startColumn": 55,
	"endLineNumber": 32,
	"endColumn": 56
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_components/workout-search-filters.tsx",
	"owner": "typescript",
	"code": "2339",
	"severity": 8,
	"message": "Property 'schedules' does not exist on type 'WorkoutPlan'.",
	"source": "ts",
	"startLineNumber": 73,
	"startColumn": 10,
	"endLineNumber": 73,
	"endColumn": 19
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_components/workout-search-filters.tsx",
	"owner": "typescript",
	"code": "7006",
	"severity": 8,
	"message": "Parameter 'schedule' implicitly has an 'any' type.",
	"source": "ts",
	"startLineNumber": 73,
	"startColumn": 26,
	"endLineNumber": 73,
	"endColumn": 34
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_components/workout-search-filters.tsx",
	"owner": "typescript",
	"code": "2339",
	"severity": 8,
	"message": "Property 'schedules' does not exist on type 'WorkoutPlan'.",
	"source": "ts",
	"startLineNumber": 80,
	"startColumn": 10,
	"endLineNumber": 80,
	"endColumn": 19
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_components/workout-search-filters.tsx",
	"owner": "typescript",
	"code": "7006",
	"severity": 8,
	"message": "Parameter 'schedule' implicitly has an 'any' type.",
	"source": "ts",
	"startLineNumber": 80,
	"startColumn": 26,
	"endLineNumber": 80,
	"endColumn": 34
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/page.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type 'never[] | WorkoutPlan[]' is not assignable to type 'WorkoutPlan[]'.\n  Type 'import(\"/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_actions/Getworkout\").WorkoutPlan[]' is not assignable to type 'import(\"/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/_actions/get-workout-plans\").WorkoutPlan[]'.\n    Type 'WorkoutPlan' is missing the following properties from type 'WorkoutPlan': createdAt, updatedAt",
	"source": "ts",
	"startLineNumber": 33,
	"startColumn": 46,
	"endLineNumber": 33,
	"endColumn": 58,
	"relatedInformation": [
		{
			"startLineNumber": 14,
			"startColumn": 2,
			"endLineNumber": 14,
			"endColumn": 14,
			"message": "The expected type comes from property 'workoutPlans' which is declared here on type 'IntrinsicAttributes & Props'",
			"resource": "/home/pranav/Desktop/GymNavigator/admin/app/dashboard/trainer/workouts/assignworkout/[userid]/_components/UserWorkoutAssignmentDetails.tsx"
		}
	]
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/lib/AI/prompts/diet-prompts.ts",
	"owner": "typescript",
	"code": "2307",
	"severity": 8,
	"message": "Cannot find module '@/app/dashboard/trainer/workouts/assignworkout/_actions/GetuserassignedTotrainers' or its corresponding type declarations.",
	"source": "ts",
	"startLineNumber": 2,
	"startColumn": 35,
	"endLineNumber": 2,
	"endColumn": 118
},{
	"resource": "/home/pranav/Desktop/GymNavigator/admin/lib/AI/prompts/diet-prompts.ts",
	"owner": "_generated_diagnostic_collection_name_#4",
	"code": {
		"value": "lint/suspicious/noExplicitAny",
		"target": {
			"$mid": 1,
			"path": "/linter/rules/no-explicit-any",
			"scheme": "https",
			"authority": "biomejs.dev"
		}
	},
	"severity": 8,
	"message": "Unexpected any. Specify a different type.",
	"source": "biome",
	"startLineNumber": 34,
	"startColumn": 55,
	"endLineNumber": 34,
	"endColumn": 58
}]
**Owner Side Image 1**  
<div>
     <img src="/app/assests/owner-1.png" alt="Owner Side Screenshot 1" width="600" height="300" style="object-fit: cover;"/>
</div>

**Owner Side Image 2**  
<div>
    <img src="/app/assests/owner-2.png" alt="Owner Side Screenshot 2" width="300" height="500" style="object-fit: cover;"/>
</div>

---

### **Trainer Dashboard**  
_Empower trainers with the tools they need to manage clients effectively._  

**Trainer Side Image 1**  
<div>
    <img src="/app/assests/trainer-1.png" alt="Trainer Side Screenshot 1" width="600" height="300" style="object-fit: cover;"/>
</div>

**Trainer Side Image 2**  
<div>
    <img src="/app/assests/trainer-2.png" alt="Trainer Side Screenshot 2" width="300" height="500" style="object-fit: cover;"/>
</div>

---

## **How to Run Locally**  

1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/GymNavigator-admin.git
   cd GymNavigator-admin
