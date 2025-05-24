import React from "react";
import {
  MagnifyingGlassIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";

interface EmptyStatesProps {
  loading: boolean;
  indexNames: string[];
  selectedIndex: string | null;
}

export const EmptyStates: React.FC<EmptyStatesProps> = ({
  loading,
  indexNames,
  selectedIndex,
}) => {
  // Show loading state when index names are being loaded
  if (loading && indexNames.length === 0) {
    return (
      <div className="gradient-card rounded-xl p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Loading indexes...
        </h3>
        <p className="text-gray-600">
          Please wait while we load your search indexes
        </p>
      </div>
    );
  }

  // Show no indexes available state
  if (indexNames.length === 0 && !loading) {
    return (
      <div className="gradient-card rounded-xl p-12 text-center">
        <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No indexes available
        </h3>
        <p className="text-gray-600 mb-4">
          You need to create an index before you can search documents
        </p>
        <a href="/indexes" className="btn-primary">
          Create Your First Index
        </a>
      </div>
    );
  }

  // Show select index state
  if (!selectedIndex) {
    return (
      <div className="gradient-card rounded-xl p-12 text-center">
        <CircleStackIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Select an Index
        </h3>
        <p className="text-gray-600 mb-4">
          Choose an index from the dropdown in the top navigation to start
          searching
        </p>
      </div>
    );
  }

  return null;
};
