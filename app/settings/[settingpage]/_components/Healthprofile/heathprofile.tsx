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
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Define the structure for the fetched data and error
interface HealthDataState {
  data: UserHealthprofile | null;
  error: string | null;
  loading: boolean;
}

export default async function HealthProfile2({ searchParams }: HealthProfileProps) {
  const TopicsArray = [
    "General",
    "Activity",
    "Dietary",
    "Medical",
    "Religious",
  ];

  // Get the selected topic from URL query params, default to undefined if not present
  const topicParam = searchParams?.topic;
  const topicString = Array.isArray(topicParam) ? topicParam[0] : topicParam; // Handle string array case, take first element if array
  const selectedTopic = topicString
    ? (topicString.charAt(0).toUpperCase() + topicString.slice(1)) as keyof UserHealthprofile
    : undefined;
  // console.log("Selected Topic:", selectedTopic); // For debugging

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
  } else if (searchParams?.topic) {
      // Handle invalid topic in URL
      healthData.error = `Invalid topic: ${searchParams.topic}`;
  }


  return (
    <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Topics List - Takes 1 column on medium screens and up */}
      <div className="md:col-span-1">
        <h2 className="text-xl font-bold mb-4">Topics</h2>
        {TopicsArray.map((topic, index) => {
          const topicKey = topic as keyof UserHealthprofile;
          const isActive = selectedTopic === topicKey;
          return (
            <Link
              href={`?topic=${topic.toLowerCase()}`} // Use lowercase for URL consistency
              key={index}
              className={`block my-2 p-3 rounded-md transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-800 font-semibold"
                  : "hover:bg-gray-100 text-black"
              }`}
              scroll={false} // Prevent page scroll jump on link click
            >
              <div className="flex items-center justify-between">
                <p className="text-lg">{topic}</p>
                <ChevronRight size={20} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Data Display Area - Takes 2 columns on medium screens and up */}
      <div className="md:col-span-2">
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
          {!selectedTopic && !healthData.loading && !healthData.error && (
             <div className="p-6 text-center text-gray-500">Select a topic to view details.</div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
