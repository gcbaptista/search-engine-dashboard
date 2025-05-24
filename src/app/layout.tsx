import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SearchEngineProvider } from "../context/SearchEngineContext";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Search Engine Dashboard",
	description:
		"A beautiful dashboard for managing your search engine indexes, documents, and searches",
	icons: {
		icon: "/favicon.ico",
	},
};

export default function RootLayout({
																		 children,
																	 }: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={inter.className}>
		<body className="min-h-screen bg-gray-50">
		<SearchEngineProvider>{children}</SearchEngineProvider>
		</body>
		</html>
	);
}
