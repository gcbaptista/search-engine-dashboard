"use client";

import React from "react";
import {
  ChartBarIcon,
  MagnifyingGlassIcon,
  DocumentIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { MainLayout } from "../../components/Layout/MainLayout";

const StatCard: React.FC<{
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  color: "blue" | "green" | "orange" | "red" | "purple";
}> = ({ title, value, change, trend, color }) => {
  const TrendIcon =
    trend === "up" ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;

  return (
    <div className="gradient-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${color}-500 to-${color}-600 flex items-center justify-center`}
        >
          <ChartBarIcon className="h-6 w-6 text-white" />
        </div>
        <div
          className={`flex items-center space-x-1 text-sm ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          <TrendIcon className="h-4 w-4" />
          <span>{change}</span>
        </div>
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
};

const PopularSearches: React.FC = () => {
  const searches = [
    { query: "matrix", count: 1247, trend: "up" },
    { query: "batman", count: 892, trend: "up" },
    { query: "star wars", count: 756, trend: "down" },
    { query: "inception", count: 623, trend: "up" },
    { query: "marvel", count: 445, trend: "up" },
  ];

  return (
    <div className="gradient-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Popular Searches
      </h3>
      <div className="space-y-3">
        {searches.map((search, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">{search.query}</p>
                <p className="text-sm text-gray-500">{search.count} searches</p>
              </div>
            </div>
            <div
              className={`flex items-center space-x-1 ${
                search.trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {search.trend === "up" ? (
                <ArrowTrendingUpIcon className="h-4 w-4" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SearchPerformance: React.FC = () => {
  const metrics = [
    { time: "00:00", searches: 45, avgTime: 42 },
    { time: "04:00", searches: 23, avgTime: 38 },
    { time: "08:00", searches: 156, avgTime: 45 },
    { time: "12:00", searches: 289, avgTime: 52 },
    { time: "16:00", searches: 234, avgTime: 48 },
    { time: "20:00", searches: 167, avgTime: 44 },
  ];

  return (
    <div className="gradient-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Search Performance (24h)
      </h3>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 w-12">
              {metric.time}
            </span>
            <div className="flex-1 mx-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">
                  {metric.searches} searches
                </span>
                <span className="text-sm text-gray-500">
                  {metric.avgTime}ms avg
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${(metric.searches / 300) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const IndexUsage: React.FC = () => {
  const indexes = [
    { name: "movies", documents: 1247, searches: 2341, size: "12.4 MB" },
    { name: "books", documents: 892, searches: 1567, size: "8.7 MB" },
    { name: "products", documents: 756, searches: 934, size: "15.2 MB" },
    { name: "articles", documents: 623, searches: 723, size: "6.8 MB" },
  ];

  return (
    <div className="gradient-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Index Usage</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                Index
              </th>
              <th className="text-right py-3 px-2 text-sm font-medium text-gray-700">
                Documents
              </th>
              <th className="text-right py-3 px-2 text-sm font-medium text-gray-700">
                Searches
              </th>
              <th className="text-right py-3 px-2 text-sm font-medium text-gray-700">
                Size
              </th>
            </tr>
          </thead>
          <tbody>
            {indexes.map((index, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0">
                <td className="py-3 px-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <DocumentIcon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900">
                      {index.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2 text-right text-sm text-gray-600">
                  {index.documents.toLocaleString()}
                </td>
                <td className="py-3 px-2 text-right text-sm text-gray-600">
                  {index.searches.toLocaleString()}
                </td>
                <td className="py-3 px-2 text-right text-sm text-gray-600">
                  {index.size}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your search engine performance and usage statistics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Searches"
            value="12,847"
            change="+12.5%"
            trend="up"
            color="blue"
          />
          <StatCard
            title="Avg Response Time"
            value="45ms"
            change="-8ms"
            trend="up"
            color="green"
          />
          <StatCard
            title="Total Documents"
            value="1,234"
            change="+156"
            trend="up"
            color="orange"
          />
          <StatCard
            title="Active Indexes"
            value="8"
            change="+2"
            trend="up"
            color="purple"
          />
        </div>

        {/* Charts and detailed analytics sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SearchPerformance />
          <PopularSearches />
        </div>

        {/* Index Usage Table */}
        <IndexUsage />

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="gradient-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Response Time Distribution
            </h3>
            <div className="space-y-3">
              {[
                { range: "0-25ms", percentage: 45, color: "green" },
                { range: "25-50ms", percentage: 35, color: "blue" },
                { range: "50-100ms", percentage: 15, color: "orange" },
                { range: "100ms+", percentage: 5, color: "red" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.range}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-${item.color}-500 h-2 rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="gradient-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Search Types
            </h3>
            <div className="space-y-3">
              {[
                { type: "Exact Match", count: 567, color: "blue" },
                { type: "Fuzzy Search", count: 423, color: "purple" },
                { type: "Filtered", count: 234, color: "green" },
                { type: "Wildcard", count: 156, color: "orange" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full bg-${item.color}-500`}
                    ></div>
                    <span className="text-sm text-gray-700">{item.type}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="gradient-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              System Health
            </h3>
            <div className="space-y-4">
              {[
                { metric: "Memory Usage", value: "68%", status: "good" },
                { metric: "CPU Usage", value: "23%", status: "good" },
                { metric: "Disk Space", value: "45%", status: "warning" },
                { metric: "Index Health", value: "100%", status: "good" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.metric}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {item.value}
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.status === "good"
                          ? "bg-green-500"
                          : item.status === "warning"
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
