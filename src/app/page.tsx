"use client";

import React from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import {
  StatsGrid,
  QuickActionsGrid,
  RecentActivity,
  SystemHealth,
} from "../components/dashboard";

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Search Engine Dashboard 🚀
          </h1>
          <p className="text-lg text-gray-600">
            Manage your search engine indexes, documents, and analytics with
            ease
          </p>
        </div>

        {/* Stats Grid */}
        <StatsGrid />

        {/* Quick Actions */}
        <QuickActionsGrid />

        {/* Recent Activity */}
        <RecentActivity />

        {/* System Health */}
        <SystemHealth />
      </div>
    </MainLayout>
  );
}
