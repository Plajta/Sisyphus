"use client";

import { Settings } from "lucide-react";

import { NavMain } from "~/components/nav-main";
import { Sidebar, SidebarHeader, SidebarRail } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";

const data = {
	navMain: [
		{
			title: "Konfigurace",
			url: "/dashboard/configuration",
			icon: Settings,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar className="border-r-0" {...props}>
			<SidebarHeader className="pl-0">
				<span className="pl-2 truncate font-bold text-xl">Plajstick Komunikátor</span>

				<Separator />

				<NavMain items={data.navMain} />
			</SidebarHeader>

			<SidebarRail />
		</Sidebar>
	);
}
