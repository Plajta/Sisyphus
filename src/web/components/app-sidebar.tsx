"use client";

import { Settings } from "lucide-react";

import { NavItem, NavMain } from "~/components/nav-main";
import { Sidebar, SidebarHeader, SidebarRail } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import { Prisma } from "@prisma/client";

export const navItems: NavItem[] = [
	{
		title: "Konfigurace",
		description: "Konfigurace Plajta komunikátoru",
		url: "/dashboard/configuration/sheet",
		icon: Settings,
		subItems: [
			{
				title: "Konfigurace",
				url: "/dashboard/configuration/sheet/3",
			},
		],
	},
];

export function AppSidebar({
	sheets,
}: {
	sheets: Prisma.SheetGetPayload<{
		select: {
			id: true;
			name: true;
		};
	}>[];
}) {
	const configurationItem = navItems[0];

	configurationItem.subItems = sheets.map((sheet) => ({
		title: sheet.name,
		url: `/dashboard/configuration/sheet/${sheet.id}`,
	}));

	return (
		<Sidebar className="border-r-0">
			<SidebarHeader className="pl-0">
				<span className="pl-2 truncate font-bold text-xl">Plajta Komunikátor</span>

				<Separator />

				<NavMain items={[configurationItem]} />
			</SidebarHeader>

			<SidebarRail />
		</Sidebar>
	);
}
