import React from "react";
import { ActivityItem } from "./ActivityItem";

export const RecentActivity: React.FC = () => {
  return (
    <div className="gradient-card rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Recent Activity
      </h2>
      <div className="space-y-2">
        <ActivityItem
          action="Index created"
          item="movies"
          time="2 minutes ago"
          color="green"
        />
        <ActivityItem
          action="Search performed"
          item="action movies"
          time="5 minutes ago"
          color="purple"
        />
        <ActivityItem
          action="Documents added"
          item="15 documents"
          time="10 minutes ago"
          color="blue"
        />
        <ActivityItem
          action="Index updated"
          item="products"
          time="1 hour ago"
          color="orange"
        />
        <ActivityItem
          action="Search API called"
          item="1,247 requests"
          time="2 hours ago"
          color="indigo"
        />
      </div>
    </div>
  );
};
