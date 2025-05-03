import { Children } from "react";
import SettingsHeader from "../SettingsHeader";

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ settingpage: string }>;
}
export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const settingPage = (await params).settingpage as string;
  return (
    <>
      <SettingsHeader title={settingPage as string} />
      <main>{children}</main>
    </>
  );
}
