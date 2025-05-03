"use client";

import { ReactElement } from "react";
import { useParams } from "next/navigation";
import SettingsHeader from "../SettingsHeader";

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function SettingsSubPage(): ReactElement {
  const params = useParams();
  const raw = params?.settingpage;
  const key = Array.isArray(raw) ? raw[0] : raw || "";
  const title = key
    .split(/[-_]/)
    .map(capitalize)
    .join(" ");

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg bg-white">
      <SettingsHeader title={title} />
      <div className="mt-4 space-y-4">
        <div className="p-4 border rounded-lg text-center">Location</div>
        <p className="text-base font-medium">About {title}:</p>
        <p className="text-base font-medium">Fees:</p>
        <p className="text-base font-medium">Etc</p>
      </div>
    </div>
  );
}
