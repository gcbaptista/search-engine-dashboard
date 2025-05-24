"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
	children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const handleMenuClick = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const handleSidebarClose = () => {
		setSidebarOpen(false);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Header
				onMenuClick={handleMenuClick}
				onNotificationsClick={() => console.log("Notifications clicked")}
				onSettingsClick={() => console.log("Settings clicked")}
			/>

			<div className="flex h-[calc(100vh-4rem)]">
				<Sidebar open={sidebarOpen} onClose={handleSidebarClose}/>

				{/* Main content */}
				<main className="flex-1 overflow-y-auto lg:ml-0">
					<div className="p-6 lg:p-8">{children}</div>
				</main>
			</div>
		</div>
	);
};
