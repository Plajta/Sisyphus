import { ImageCard } from "~/components/image-card";
import { prisma } from "~/modules/prisma";

export default async function Page() {
	const buttons = await prisma.button.findMany({
		include: {
			files: true,
		},
		orderBy: {
			createdAt: "asc",
		},
	});

	return (
		<div className="flex flex-1 flex-col gap-4 px-4 py-10 pb-0">
			<div className="grid grid-cols-3 gap-8">
				{buttons.map((item) => (
					<ImageCard key={item.id} item={item} />
				))}
			</div>
		</div>
	);
}
