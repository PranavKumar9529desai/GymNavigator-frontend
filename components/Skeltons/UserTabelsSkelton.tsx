import React from 'react';
import { Users, UserCheck, UserX, ChevronDown } from 'lucide-react';

export default function UserTrainerTableSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        User-Trainer Assignment
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
              {index === 0 && <Users className="h-10 w-10 text-gray-300" />}
              {index === 1 && <UserCheck className="h-10 w-10 text-gray-300" />}
              {index === 2 && <UserX className="h-10 w-10 text-gray-300" />}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">User Name</th>
              <th className="px-4 py-2 text-left text-gray-600">Gender</th>
              <th className="px-4 py-2 text-left text-gray-600">Goal</th>
              <th className="px-4 py-2 text-left text-gray-600">
                Assign Trainer
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="relative">
                    <div className="h-10 w-full bg-gray-200 rounded"></div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-300">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* mobile view   */}
      </div>
    </div>
  );
}
