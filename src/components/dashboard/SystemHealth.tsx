import React from "react";

export const SystemHealth: React.FC = () => {
  const systemServices = [
    { service: "Search API", status: "operational", color: "green" },
    { service: "Document Indexing", status: "operational", color: "green" },
    { service: "Analytics Engine", status: "operational", color: "green" },
    { service: "Database", status: "operational", color: "green" },
  ];

  const performanceMetrics = [
    { metric: "Average Query Time", value: "45ms", trend: "down" },
    { metric: "Index Success Rate", value: "99.8%", trend: "stable" },
    { metric: "API Uptime", value: "99.99%", trend: "stable" },
    { metric: "Storage Used", value: "2.1GB", trend: "up" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="gradient-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          System Status
        </h3>
        <div className="space-y-3">
          {systemServices.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {item.service}
              </span>
              <span className={`chip-${item.color}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="gradient-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Metrics
        </h3>
        <div className="space-y-4">
          {performanceMetrics.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {item.metric}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-gray-900">
                  {item.value}
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.trend === "up"
                      ? "bg-orange-400"
                      : item.trend === "down"
                      ? "bg-green-400"
                      : "bg-gray-400"
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
