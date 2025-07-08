import { getDashboardOverview } from './_actions/get-dashboard-overview';
import { DashboardOverview } from './_components/dashboard-overview';

export default async function DashboardPage() {
  const data = await getDashboardOverview();
  
  if (!data) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-muted-foreground">
            Unable to load dashboard data
          </h2>
          <p className="text-muted-foreground">
            Please try refreshing the page or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }
  
  return <DashboardOverview data={data} />;
}
