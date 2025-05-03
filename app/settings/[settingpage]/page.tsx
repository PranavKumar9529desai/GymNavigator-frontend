import GymSettings from "./_components/GymSettings";
import PaymentSettings from "./_components/PaymentSettings";
import TrainerSettings from "./_components/TrainerSettings";
import HealthProfileSettings from "./_components/HealthProfileSettings";

export default async function SettingPage({
  params,
}: {
  params: Promise<{ settingpage: string }>;
}) {
  const settingPage = (await params).settingpage as string;

  // Map route parameters to components
  const components: { [key: string]: React.ComponentType } = {
    gym: GymSettings,
    payment: PaymentSettings,
    trainer: TrainerSettings,
    healthprofile: HealthProfileSettings,
  };

  // Get the component for the current route
  const Component = components[settingPage];

  // If the component doesn't exist for the given route, show a not found message
  if (!Component) {
    return <div className="p-6 text-center">Settings page not found</div>;
  }

  // Render the selected component
  return <Component />;
}
