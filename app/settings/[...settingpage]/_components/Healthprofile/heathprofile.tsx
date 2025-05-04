import { ChevronRight } from "lucide-react";
import { gethealthprofileById, UserHealthprofile } from "./_actions/get-client-healthprofie"; // Import UserHealthprofile type
import Link from "next/link"; // Import Link
import { Suspense } from "react"; // Import Suspense for cleaner loading states (optional but good practice)
import GeneralDisplay from "./display/GeneralDisplay";
import ActivityDisplay from "./display/ActivityDisplay";
import DietaryDisplay from "./display/DietaryDisplay";
import MedicalDisplay from "./display/MedicalDisplay";
import ReligiousDisplay from "./display/ReligiousDisplay";


// Define props interface to accept searchParams
interface HealthProfileProps {
  selectedTopic?: string; // Changed from searchParams to selectedTopic prop
}

// Define the structure for the fetched data and error
interface HealthDataState {
  data: UserHealthprofile | null;
  error: string | null;
  loading: boolean;
}

export default async function HealthProfile2({ selectedTopic: rawSelectedTopic }: HealthProfileProps) { // Destructure and rename prop
  const TopicsArray = [
    "General",
    "Activity",
    "Dietary",
    "Medical",
    "Religious",
  ];

  // Capitalize the selected topic from the prop to match keys/array values
  const selectedTopic = rawSelectedTopic
    ? (rawSelectedTopic.charAt(0).toUpperCase() + rawSelectedTopic.slice(1)) as keyof UserHealthprofile
    : undefined;
  // console.log("Selected Topic from prop:", selectedTopic); // For debugging

  let healthData: HealthDataState = { data: null, error: null, loading: false };

  // Fetch data only if a topic is selected
  if (selectedTopic && TopicsArray.includes(selectedTopic)) { // Ensure topic is valid
    healthData.loading = true; // Set loading state
    try {
      const result = await gethealthprofileById();
      // console.log("Fetched Data Result:", result); // For debugging
      if (result.success && result.data) {
        healthData.data = result.data;
      } else {
        healthData.error = result.error || "Failed to fetch health profile data.";
      }
    } catch (err) {
      console.error("Error fetching health profile:", err);
      healthData.error = "An unexpected error occurred while fetching data.";
    } finally {
      healthData.loading = false; // Reset loading state
    }
  } else if (rawSelectedTopic) {
      // Handle invalid topic from URL prop
      healthData.error = `Invalid topic: ${rawSelectedTopic}`;
  }


  return (
    <div className={`p-10 grid grid-cols-1 ${selectedTopic ? '' : 'md:grid-cols-3'} gap-10`}>
      {/* Adjust grid layout based on whether a topic is selected */}

      {/* Topics List - Only show if no topic is selected */}
      {!selectedTopic && (
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold mb-4">Topics</h2>
          {TopicsArray.map((topic: string, index: number) => { // Added types for topic and index
            // No need for isActive check here since the list is hidden when a topic is active
            return (
              <Link
                href={`/settings/healthprofile/${topic.toLowerCase()}`} // Use path segments for navigation
                key={index}
                className="block my-2 p-3 rounded-md transition-colors hover:bg-gray-100 text-black" // Simplified style
                scroll={false} // Prevent page scroll jump
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg">{topic}</p>
                  <ChevronRight size={20} />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Data Display Area - Spans appropriately based on topic selection */}
      {/* If a topic is selected, parent grid is grid-cols-1, so this takes full width */}
      {/* If no topic is selected, parent grid is md:grid-cols-3, this takes 2 columns */}
      {/* If no topic is selected, parent grid is md:grid-cols-3, this takes 2 columns */}
      <div className={selectedTopic ? 'col-span-1' : 'md:col-span-2'}> {/* Ensure full width when topic selected */}
        <Suspense fallback={<div className="p-6 text-center">Loading topic data...</div>}>
          {healthData.loading && <div className="p-6 text-center">Loading...</div>}
          {healthData.error && <div className="p-6 text-center text-red-600">Error: {healthData.error}</div>}
          {selectedTopic && healthData.data && !healthData.loading && !healthData.error && (
            <div className="p-6 border rounded-md shadow-sm bg-white">
              <h2 className="text-2xl font-bold mb-4 capitalize">{selectedTopic} Details</h2>
              {/* Render the appropriate display component based on selectedTopic */}
              {selectedTopic === "General" && <GeneralDisplay data={healthData.data.General} />}
              {selectedTopic === "Activity" && <ActivityDisplay data={healthData.data.Activity} />}
              {selectedTopic === "Dietary" && <DietaryDisplay data={healthData.data.Dietary} />}
              {selectedTopic === "Medical" && <MedicalDisplay data={healthData.data.Medical} />}
              {selectedTopic === "Religious" && <ReligiousDisplay data={healthData.data.Religious} />}
            </div>
          )}
          {/* Show data or prompt to select a topic */}
          {!selectedTopic && !healthData.loading && !healthData.error && (
             <div className="p-6 text-center text-gray-500">Select a topic from the list to view details.</div>
          )}
        </Suspense>
      </div>
    </div>
  );
}

