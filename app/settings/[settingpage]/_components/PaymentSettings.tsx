"use client";
export default function PaymentSettings() {
  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Settings</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Payment Methods</h3>
              <p className="text-gray-600">
                Manage your payment methods and preferences.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Billing History</h3>
              <p className="text-gray-600">
                View your past transactions and billing details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
