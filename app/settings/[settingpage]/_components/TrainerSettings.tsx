"use client";
export default function TrainerSettings() {
  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Trainer Settings</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Profile Information</h3>
              <p className="text-gray-600">
                Update your trainer profile and credentials.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Availability</h3>
              <p className="text-gray-600">
                Set your availability and working hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
