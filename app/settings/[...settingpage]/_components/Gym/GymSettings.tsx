"use client";

import SettingsEditButton from "@/app/settings/_components/SettingsEditButton";
import SettingsSection from "@/app/settings/_components/SettingsSection";

export default function GymSettings() {
  return (
    <section className="px-4 py-6 pb-20 md:pb-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Gym Settings</h2>
        <div className="space-y-6">
          <SettingsSection 
            title="General Information"
            description="Configure your gym's basic settings and information here."
          >
            <SettingsEditButton 
              className="mt-4"
              label="Edit Information"
              aria-label="Edit general information"
            />
          </SettingsSection>
          
          <SettingsSection 
            title="Operating Hours"
            description="Set your gym's operating hours and schedule."
          >
            <SettingsEditButton 
              className="mt-4"
              label="Edit Hours"
              aria-label="Edit operating hours"
            />
          </SettingsSection>
          
          <SettingsSection 
            title="Gym Location"
            description="Update your gym's address and location information."
            noBorder
          >
            <SettingsEditButton 
              className="mt-4"
              label="Edit Location"
              aria-label="Edit gym location"
            />
          </SettingsSection>
        </div>
      </div>
    </section>
  );
}