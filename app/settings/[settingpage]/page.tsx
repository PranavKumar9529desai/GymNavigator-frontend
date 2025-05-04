import GymSettings from "./_components/Gym/GymSettings";
import PaymentSettings from "./_components/Gym/Payments/PaymentSettings";
import TrainerSettings from "./_components/TrainerSettings";
import HealthProfile2 from "./_components/Healthprofile/heathprofile";

export default async function SettingPage({
  params,
  searchParams, // Add searchParams
}: {
  params: Promise<{ settingpage: string }>;
  searchParams?: { [key: string]: string | string[] | undefined }; // Define searchParams type
}) {
  const settingPage = (await params).settingpage as string;

  // Map route parameters to components
  const components: { [key: string]: React.ComponentType<any> } = { // Add <any> to allow passing props
    gym: GymSettings,
    payment: PaymentSettings,
    trainer: TrainerSettings,
    healthprofile: HealthProfile2,
  };

  // Get the component for the current route
  const Component = components[settingPage];

  // If the component doesn't exist for the given route, show a not found message
  if (!Component) {
    return <div className="p-6 text-center">Settings page not found</div>;
  }

  // Render the selected component, passing searchParams
  return <Component searchParams={searchParams} />;
}
