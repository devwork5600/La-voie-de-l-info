import AdminOverviewStats from "./components/AdminOverviewStats";
import NewUsersChart from "./components/NewUsersChart";
import SubscriptionChart from "./components/SubscriptionChart";
import VisitorChart from "./components/VisitorChart";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 sm:p-8">
      <div>
        <h1 className="font-playfair text-3xl font-bold tracking-tight">
          Statistiques
        </h1>
        <p className="text-muted-foreground mt-1">
          Vue d&rsquo;ensemble de l&rsquo;activité du site.
        </p>
      </div>

      <AdminOverviewStats />

      <VisitorChart />

      <div className="grid gap-6 lg:grid-cols-2">
        <SubscriptionChart />
        <NewUsersChart />
      </div>
    </div>
  );
}
