"use client";
export default function GymSettings() {
  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Gym Settings</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">General Information</h3>
              <p className="text-gray-600">Configure your gym's basic settings and information here.</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Operating Hours</h3>
              <p className="text-gray-600">Set your gym's operating hours and schedule.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}