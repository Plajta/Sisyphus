"use client";

import { usePathname } from "next/navigation";
import { navItems } from "~/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "~/components/ui/breadcrumb";

export function PageBreadcrumb() {
	const pathname = usePathname();

	const navItem = navItems.find((item) => item.url === pathname);

	return (
		navItem && (
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbPage className="line-clamp-1">{navItem.description}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		)
	);
}
