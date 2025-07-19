import React from 'react';
import { GetDashboardData } from '../../(common)/components/GetDashboardData';

export default async function GymDashboardPage() {
  const data = await GetDashboardData();

  if ('error' in data) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Dashboard Error</h2>
        <p className="text-slate-600">{data.msg || data.error}</p>
      </div>
    );
  }

  const { stats, recentActivities, gymDetails } = data;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 p-2 md:p-4">
      {/* Header */}
      <section className="space-y-2 mb-4">
        <div className="flex items-center gap-3">
          {gymDetails.gym_logo && (
            <img
              src={gymDetails.gym_logo}
              alt={gymDetails.gym_name + ' logo'}
              className="w-10 h-10 rounded-full object-cover border border-blue-100"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{gymDetails.gym_name}</h1>
            <div className="text-xs text-slate-600">
              {gymDetails.address
                ? `${gymDetails.address.street}, ${gymDetails.address.city}, ${gymDetails.address.state}`
                : 'No address set'}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        <StatCard label="Members" value={stats.totalMembers} />
        <StatCard label="Trainers" value={stats.activeTrainers} />
        <StatCard label="Today" value={stats.todayAttendance} />
        <StatCard label="Revenue" value={`₹${stats.revenue}`} />
        <StatCard label="Expiring" value={stats.expiringMemberships} />
        <StatCard label="New" value={stats.newMembers} />
        <StatCard label="Inactive" value={stats.inactiveMembers} />
      </section>

      {/* Recent Activities */}
      <section className="mb-4">
        <SectionHeader icon={<span className="material-symbols-outlined">history</span>} title="Recent Activities" />
        <div className="space-y-2 mt-2">
          <ActivityList title="Signups" items={recentActivities.recentSignups.map(u => ({
            label: u.name,
            sub: new Date(u.createdAt).toLocaleDateString(),
          }))} />
          <ActivityList title="Attendance" items={recentActivities.recentAttendance.map(a => ({
            label: a.user.name,
            sub: new Date(a.scanTime).toLocaleTimeString(),
          }))} />
          <ActivityList title="Trainer Assignments" items={recentActivities.recentTrainerAssignments.map(t => ({
            label: t.name,
            sub: t.trainer?.name ? `→ ${t.trainer.name}` : 'Unassigned',
          }))} />
        </div>
      </section>

      {/* Gym Details */}
      <section className="mb-4">
        <SectionHeader icon={<span className="material-symbols-outlined">info</span>} title="Gym Details" />
        <div className="text-sm text-slate-700 mb-2">
          <span className="font-medium">Contact:</span> {gymDetails.Email} | {gymDetails.phone_number}
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {gymDetails.amenities.map((a) => (
            <span key={a} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded uppercase tracking-wide border border-blue-100">
              {a}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {gymDetails.pricingPlans.map((plan) => (
            <div key={plan.name} className="rounded border border-blue-100 bg-white/60 p-2 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {plan.icon && <span className="material-symbols-outlined text-blue-600">{plan.icon}</span>}
                <span className="text-sm font-medium text-slate-800">{plan.name}</span>
                {plan.isFeatured && <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-1 rounded">Featured</span>}
              </div>
              <div className="text-xs text-slate-600">{plan.duration} | <span className="font-semibold text-blue-600">₹{plan.price}</span></div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded bg-white/60 border border-blue-100 p-2 flex flex-col items-center justify-center min-h-[60px]">
      <span className="text-xs text-slate-600 uppercase tracking-wide">{label}</span>
      <span className="text-lg font-semibold text-blue-600">{value}</span>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
    </div>
  );
}

function ActivityList({ title, items }: { title: string; items: { label: string; sub: string }[] }) {
  if (!items.length) return null;
  return (
    <div>
      <div className="text-xs font-medium text-slate-700 mb-1 uppercase tracking-wide">{title}</div>
      <ul className="divide-y divide-blue-50 bg-white/40 rounded">
        {items.map((item, i) => (
          <li key={item.label + item.sub + i} className="flex justify-between items-center px-2 py-1">
            <span className="text-sm text-slate-800">{item.label}</span>
            <span className="text-xs text-slate-600">{item.sub}</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 