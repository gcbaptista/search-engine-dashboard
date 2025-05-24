import React from "react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  href,
  color,
}) => {
  return (
    <a
      href={href}
      className="gradient-card card-hover rounded-xl p-6 text-left block group"
    >
      <div
        className={`w-12 h-12 rounded-lg bg-${color}-100 flex items-center justify-center mb-4 group-hover:bg-${color}-200 transition-colors`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  );
};
