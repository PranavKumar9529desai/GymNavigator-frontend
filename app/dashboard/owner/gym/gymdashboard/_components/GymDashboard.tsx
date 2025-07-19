"use client";
import React from 'react';
import type { GymDashboardData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

interface GymDashboardProps {
  data: GymDashboardData;
}

const palette = ['#2563eb', '#6366f1', '#a5b4fc', '#3b82f6', '#f472b6', '#60a5fa', '#818cf8'];

export default function GymDashboard({ data }: GymDashboardProps) {
  const { stats, trends, breakdowns, recentActivities, gymDetails } = data;

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6 max-w-7xl mx-auto bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <img
          src={gymDetails.gym_logo}
          alt={gymDetails.gym_name + ' logo'}
          className="w-12 h-12 rounded-full border border-blue-100 bg-white object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{gymDetails.gym_name}</h1>
          <p className="text-slate-600 text-sm">{gymDetails.address?.city}, {gymDetails.address?.state}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SubtleStatCard
          label="Members"
          value={stats.totalMembers}
          icon={<svg aria-label="Members" className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><title>Members</title><path d="M17 20h5v-2a4 4 0 0 0-3-3.87" /><path d="M9 20H4v-2a4 4 0 0 1 3-3.87" /><circle cx="12" cy="7" r="4" /></svg>}
        />
        <SubtleStatCard
          label="Trainers"
          value={stats.activeTrainers}
          icon={<svg aria-label="Trainers" className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><title>Trainers</title><path d="M12 20v-6" /><path d="M9 20v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" /><circle cx="12" cy="7" r="4" /></svg>}
        />
        <SubtleStatCard
          label="Attendance"
          value={stats.todayAttendance}
          icon={<svg aria-label="Attendance" className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><title>Attendance</title><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>}
        />
        <SubtleStatCard
          label="Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          icon={<svg aria-label="Revenue" className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><title>Revenue</title><path d="M12 8v8" /><path d="M8 12h8" /><circle cx="12" cy="12" r="10" /></svg>}
        />
      </div>

      {/* Trends Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardSection title="Attendance Trend">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trends.attendance} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={10} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardSection>
        <CardSection title="Member Growth">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={trends.memberGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={10} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardSection>
      </div>

      {/* Breakdowns Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardSection title="Membership Types">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={breakdowns.membershipTypes}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              >
                {breakdowns.membershipTypes.map((entry, idx) => (
                  <Cell key={entry.label} fill={entry.color || palette[idx % palette.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardSection>
        <CardSection title="Gender Split">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={breakdowns.gender}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
              >
                {breakdowns.gender.map((entry, idx) => (
                  <Cell key={entry.label} fill={entry.color || palette[idx % palette.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardSection>
        <CardSection title="Plan Popularity">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={breakdowns.planPopularity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" fontSize={10} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {breakdowns.planPopularity.map((entry, idx) => (
                  <Cell key={entry.label} fill={entry.color || palette[idx % palette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardSection>
      </div>

      {/* Recent Activity Section */}
      <CardSection title="Recent Activities">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Signups</h3>
            <ul className="space-y-1">
              {recentActivities.recentSignups.map((signup) => (
                <li key={signup.id} className="text-xs text-slate-600">
                  <span className="font-medium text-blue-600">{signup.name}</span> joined on {new Date(signup.createdAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Attendance</h3>
            <ul className="space-y-1">
              {recentActivities.recentAttendance.map((att) => (
                <li key={att.id} className="text-xs text-slate-600">
                  <span className="font-medium text-indigo-600">{att.user.name}</span> checked in at {new Date(att.scanTime).toLocaleTimeString()}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Trainer Assignments</h3>
            <ul className="space-y-1">
              {recentActivities.recentTrainerAssignments.map((assign) => (
                <li key={assign.id} className="text-xs text-slate-600">
                  <span className="font-medium text-green-600">{assign.name}</span> assigned to <span className="font-medium text-blue-600">{assign.trainer?.name || 'N/A'}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardSection>

      {/* Gym Details Section */}
      <CardSection title="Gym Details">
        <div className="flex flex-wrap gap-4 items-center text-xs text-slate-700">
          <div className="flex flex-col">
            <span className="font-semibold">Address:</span>
            <span>{gymDetails.address?.street}, {gymDetails.address?.city}, {gymDetails.address?.state}, {gymDetails.address?.postalCode}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Phone:</span>
            <span>{gymDetails.phone_number}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Email:</span>
            <span>{gymDetails.Email}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Amenities:</span>
            <span>{gymDetails.amenities.join(', ')}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Plans:</span>
            <span>{gymDetails.pricingPlans.map((plan) => plan.name).join(', ')}</span>
          </div>
        </div>
      </CardSection>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: React.ReactNode; color: string }) {
  return (
    <div
      className={`rounded-lg bg-gradient-to-r ${color} p-3 flex flex-col items-center justify-center shadow-sm min-h-[80px]`}
      role="status"
      tabIndex={0}
      aria-label={label + ': ' + value}
    >
      <span className="text-xs font-medium text-slate-100 uppercase tracking-wide">{label}</span>
      <span className="text-xl font-bold text-white">{value}</span>
    </div>
  );
}

function CardSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white/80 rounded-lg p-4 shadow-sm border border-blue-100">
      <h2 className="text-lg font-semibold text-slate-800 mb-2">{title}</h2>
      {children}
    </section>
  );
}

function SubtleStatCard({ label, value, icon }: { label: string; value: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-3 bg-white/70 border border-blue-100 rounded-lg px-3 py-3 shadow-sm hover:shadow-md transition-shadow min-h-[70px] focus-within:ring-2 focus-within:ring-blue-200"
      tabIndex={0}
      role="status"
      aria-label={label + ': ' + value}
    >
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">{label}</span>
        <span className="text-lg font-semibold text-slate-800">{value}</span>
      </div>
    </div>
  );
} 