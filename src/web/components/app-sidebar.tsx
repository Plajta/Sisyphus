"use client";

import { Settings } from "lucide-react";

import { NavMain } from "~/components/nav-main";
import { Sidebar, SidebarHeader, SidebarRail } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";

export const navItems = [
	{
		title: "Konfigurace",
		description: "Konfigurace Plajta komunikátoru",
		url: "/dashboard/configuration/sheet",
		icon: Settings,
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar className="border-r-0" {...props}>
			<SidebarHeader className="pl-0">
				<span className="pl-2 truncate font-bold text-xl">Plajta Komunikátor</span>

				<Separator />

				<NavMain items={navItems} />
			</SidebarHeader>

			<SidebarRail />
		</Sidebar>
	);
}
