import React from "react";

interface ActivityItemProps {
  action: string;
  item: string;
  time: string;
  color: string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  action,
  item,
  time,
  color,
}) => {
  return (
    <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`w-3 h-3 bg-${color}-500 rounded-full`}></div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">
          <span className="font-medium">{action}:</span>{" "}
          <span className={`text-${color}-600 font-medium`}>{item}</span>
        </p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
};
