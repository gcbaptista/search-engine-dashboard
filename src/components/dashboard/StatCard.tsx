import React from "react";
import {
  EllipsisVerticalIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  color,
  gradient,
}) => {
  const changeColor =
    changeType === "positive"
      ? "text-green-600"
      : changeType === "negative"
      ? "text-red-600"
      : "text-gray-600";

  return (
    <div
      className={`gradient-card rounded-xl p-6 h-full relative overflow-hidden ${gradient}`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-lg bg-${color}-100 flex items-center justify-center`}
          >
            {icon}
          </div>
          <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-600 mb-2">{title}</p>
        <div className="flex items-center">
          <ArrowTrendingUpIcon className={`h-4 w-4 mr-1 ${changeColor}`} />
          <span className={`text-sm font-medium ${changeColor}`}>{change}</span>
        </div>
      </div>
    </div>
  );
};
