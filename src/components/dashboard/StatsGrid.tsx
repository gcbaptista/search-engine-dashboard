import React from "react";
import {
  CircleStackIcon,
  MagnifyingGlassIcon,
  DocumentIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { StatCard } from "./StatCard";

export const StatsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Indexes"
        value="8"
        change="+2 this week"
        changeType="positive"
        icon={<CircleStackIcon className="h-6 w-6 text-blue-600" />}
        color="blue"
        gradient="bg-gradient-to-br from-blue-50 to-blue-100"
      />
      <StatCard
        title="Total Documents"
        value="1.2K"
        change="+156 today"
        changeType="positive"
        icon={<DocumentIcon className="h-6 w-6 text-green-600" />}
        color="green"
        gradient="bg-gradient-to-br from-green-50 to-green-100"
      />
      <StatCard
        title="Searches Today"
        value="847"
        change="+12.5%"
        changeType="positive"
        icon={<MagnifyingGlassIcon className="h-6 w-6 text-purple-600" />}
        color="purple"
        gradient="bg-gradient-to-br from-purple-50 to-purple-100"
      />
      <StatCard
        title="Avg Response"
        value="45ms"
        change="-8ms"
        changeType="positive"
        icon={<BoltIcon className="h-6 w-6 text-orange-600" />}
        color="orange"
        gradient="bg-gradient-to-br from-orange-50 to-orange-100"
      />
    </div>
  );
};
