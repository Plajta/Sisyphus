import { notFound } from "next/navigation";
import { ImageCard } from "~/components/image-card";
import { prisma } from "~/modules/prisma";

export default async function Page({ params }: { params: Promise<{ sheetId: string }> }) {
	const { sheetId } = await params;

	const sheet = await prisma.sheet.findFirst({
		where: {
			id: +sheetId,
		},
		include: {
			buttons: {
				orderBy: {
					createdAt: "asc",
				},
				include: {
					files: true,
				},
			},
		},
	});

	if (!sheet) {
		return notFound();
	}

	return (
		<div className="flex flex-1 flex-col gap-4 px-4 py-8 pb-0">
			<p className="text-xl font-bold">{sheet.name}</p>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
				{sheet.buttons.map((item) => (
					<ImageCard key={item.id} item={item} />
				))}
			</div>
		</div>
	);
}
