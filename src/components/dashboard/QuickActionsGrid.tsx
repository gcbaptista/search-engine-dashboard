import React from "react";
import {
  CircleStackIcon,
  MagnifyingGlassIcon,
  DocumentIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { QuickActionCard } from "./QuickActionCard";

export const QuickActionsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <QuickActionCard
        title="Create Index"
        description="Set up a new search index with custom configuration"
        icon={<CircleStackIcon className="h-6 w-6 text-blue-600" />}
        href="/indexes"
        color="blue"
      />
      <QuickActionCard
        title="Add Documents"
        description="Upload and index new documents to your collection"
        icon={<DocumentIcon className="h-6 w-6 text-green-600" />}
        href="/documents"
        color="green"
      />
      <QuickActionCard
        title="Search Documents"
        description="Perform advanced searches across your indexed data"
        icon={<MagnifyingGlassIcon className="h-6 w-6 text-purple-600" />}
        href="/search"
        color="purple"
      />
      <QuickActionCard
        title="View Analytics"
        description="Monitor search performance and usage statistics"
        icon={<BoltIcon className="h-6 w-6 text-orange-600" />}
        href="/analytics"
        color="orange"
      />
    </div>
  );
};
