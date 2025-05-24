"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ChartBarIcon,
  CircleStackIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  ChartBarIcon as ChartBarIconSolid,
  CircleStackIcon as CircleStackIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
} from "@heroicons/react/24/solid";

const navigationItems = [
  {
    path: "/",
    label: "Dashboard",
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
    color: "text-blue-600",
  },
  {
    path: "/indexes",
    label: "Indexes",
    icon: CircleStackIcon,
    iconSolid: CircleStackIconSolid,
    color: "text-green-600",
  },
  {
    path: "/documents",
    label: "Documents",
    icon: DocumentTextIcon,
    iconSolid: DocumentTextIconSolid,
    color: "text-orange-600",
  },
  {
    path: "/search",
    label: "Search",
    icon: MagnifyingGlassIcon,
    iconSolid: MagnifyingGlassIconSolid,
    color: "text-purple-600",
  },
  {
    path: "/analytics",
    label: "Analytics",
    icon: ChartBarIcon,
    iconSolid: ChartBarIconSolid,
    color: "text-red-600",
  },
];

const settingsItems = [
  {
    path: "/settings",
    label: "Settings",
    icon: Cog6ToothIcon,
    iconSolid: Cog6ToothIconSolid,
    color: "text-gray-600",
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const pathname = usePathname();

  const renderNavigationItem = (item: any) => {
    const isActive = pathname === item.path;
    const Icon = isActive ? item.iconSolid : item.icon;

    return (
      <li key={item.path}>
        <Link
          href={item.path}
          onClick={onClose}
          className={`
            flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 mx-3 mb-1
            ${
              isActive
                ? `${item.color} bg-gray-100 shadow-sm`
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }
          `}
        >
          <Icon
            className={`h-5 w-5 mr-3 ${
              isActive ? item.color : "text-gray-400"
            }`}
          />
          {item.label}
          {isActive && (
            <div
              className={`ml-auto w-1 h-6 rounded-full ${item.color.replace(
                "text-",
                "bg-"
              )}`}
            />
          )}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo area - spacer for header */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <MagnifyingGlassIcon className="h-5 w-5 text-white" />
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-900">
              Dashboard
            </span>
          </div>

          {/* Navigation */}
          <div className="flex-1 py-6 overflow-y-auto">
            <div className="px-3 mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Navigation
              </p>
              <ul className="space-y-1">
                {navigationItems.map((item) => renderNavigationItem(item))}
              </ul>
            </div>

            <div className="px-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                System
              </p>
              <ul className="space-y-1">
                {settingsItems.map((item) => renderNavigationItem(item))}
              </ul>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
