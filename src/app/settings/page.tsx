"use client";

import React, { useState } from "react";
import {
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  BellIcon,
  UserIcon,
  ServerIcon,
  DocumentIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { MainLayout } from "../../components/Layout/MainLayout";

const SettingsCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, description, icon, children }) => {
  return (
    <div className="gradient-card rounded-xl p-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

const ToggleSwitch: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description?: string;
}> = ({ enabled, onChange, label, description }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <label className="text-sm font-medium text-gray-900">{label}</label>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    enableCaching: true,
    enableLogging: true,
    enableAnalytics: false,
    enableNotifications: true,
    autoBackup: false,
    strictMode: false,
    typoTolerance: "medium",
    maxResults: "50",
    timeout: "5000",
  });

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Configure your search engine dashboard and system preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Search Configuration */}
          <SettingsCard
            title="Search Configuration"
            description="Configure search behavior and performance"
            icon={<MagnifyingGlassIcon className="h-5 w-5 text-white" />}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Typo Tolerance
                </label>
                <select
                  value={settings.typoTolerance}
                  onChange={(e) =>
                    updateSetting("typoTolerance", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="strict">Strict (No typos)</option>
                  <option value="low">Low (1 typo)</option>
                  <option value="medium">Medium (2 typos)</option>
                  <option value="high">High (3+ typos)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Results per Query
                </label>
                <input
                  type="number"
                  value={settings.maxResults}
                  onChange={(e) => updateSetting("maxResults", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Query Timeout (ms)
                </label>
                <input
                  type="number"
                  value={settings.timeout}
                  onChange={(e) => updateSetting("timeout", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="100"
                  max="30000"
                />
              </div>

              <ToggleSwitch
                enabled={settings.strictMode}
                onChange={(value) => updateSetting("strictMode", value)}
                label="Strict Mode"
                description="Require exact matches for all queries"
              />
            </div>
          </SettingsCard>

          {/* System Settings */}
          <SettingsCard
            title="System Settings"
            description="Configure system behavior and performance"
            icon={<ServerIcon className="h-5 w-5 text-white" />}
          >
            <div className="space-y-2">
              <ToggleSwitch
                enabled={settings.enableCaching}
                onChange={(value) => updateSetting("enableCaching", value)}
                label="Enable Query Caching"
                description="Cache frequently used queries for better performance"
              />

              <ToggleSwitch
                enabled={settings.enableLogging}
                onChange={(value) => updateSetting("enableLogging", value)}
                label="Enable Request Logging"
                description="Log all search requests and responses"
              />

              <ToggleSwitch
                enabled={settings.autoBackup}
                onChange={(value) => updateSetting("autoBackup", value)}
                label="Automatic Backups"
                description="Automatically backup indexes daily"
              />

              <ToggleSwitch
                enabled={settings.enableAnalytics}
                onChange={(value) => updateSetting("enableAnalytics", value)}
                label="Analytics Collection"
                description="Collect usage analytics and metrics"
              />
            </div>
          </SettingsCard>

          {/* User Preferences */}
          <SettingsCard
            title="User Preferences"
            description="Customize your dashboard experience"
            icon={<UserIcon className="h-5 w-5 text-white" />}
          >
            <div className="space-y-2">
              <ToggleSwitch
                enabled={settings.enableNotifications}
                onChange={(value) =>
                  updateSetting("enableNotifications", value)
                }
                label="Desktop Notifications"
                description="Show notifications for system events"
              />

              <div className="py-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dashboard Theme
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="py-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Page Size
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="10">10 items</option>
                  <option value="25">25 items</option>
                  <option value="50">50 items</option>
                  <option value="100">100 items</option>
                </select>
              </div>
            </div>
          </SettingsCard>

          {/* API Configuration */}
          <SettingsCard
            title="API Configuration"
            description="Configure API endpoints and security"
            icon={<ShieldCheckIcon className="h-5 w-5 text-white" />}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Base URL
                </label>
                <input
                  type="text"
                  defaultValue="http://localhost:8080"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter API base URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key (Optional)
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter API key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Timeout (seconds)
                </label>
                <input
                  type="number"
                  defaultValue="30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="300"
                />
              </div>
            </div>
          </SettingsCard>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button className="btn-secondary">Reset to Defaults</button>
          <button className="btn-primary">Save Settings</button>
        </div>

        {/* System Information */}
        <div className="gradient-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            System Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Dashboard Version", value: "1.0.0" },
              { label: "API Version", value: "2.1.3" },
              { label: "Node.js Version", value: "18.17.0" },
              { label: "Last Updated", value: "2024-01-15" },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className="font-semibold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Documentation Links */}
        <div className="gradient-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resources & Documentation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "API Documentation",
                description: "Complete API reference and examples",
                icon: <DocumentIcon className="h-5 w-5" />,
                color: "blue",
              },
              {
                title: "User Guide",
                description: "Step-by-step tutorials and guides",
                icon: <UserIcon className="h-5 w-5" />,
                color: "green",
              },
              {
                title: "Performance Tips",
                description: "Optimization and best practices",
                icon: <ChartBarIcon className="h-5 w-5" />,
                color: "purple",
              },
            ].map((resource, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg bg-${resource.color}-100 flex items-center justify-center mr-3`}
                  >
                    <div className={`text-${resource.color}-600`}>
                      {resource.icon}
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900">
                    {resource.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
