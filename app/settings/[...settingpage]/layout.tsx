import { Children } from "react";
import SettingsHeader from "../SettingsHeader";

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ settingpage: string[] }>; // Update params type to string[]
}
export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const settingParams = (await params).settingpage;
  const mainPage = settingParams[0] as string; // Use the first segment for the title
  return (
    <>
      <SettingsHeader title={mainPage} /> {/* Use mainPage for the title */}
      <main>{children}</main>
    </>
  );
}
