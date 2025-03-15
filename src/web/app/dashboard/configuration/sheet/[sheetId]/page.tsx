import { notFound } from "next/navigation";
import { exportSheet } from "~/actions/sheet/export";
import { ExportSheetButton } from "~/components/export-sheet-button";
import { FormWrapper } from "~/components/form-wrapper";
import { ImageCard } from "~/components/image-card";
import { Button } from "~/components/ui/button";
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
			<div className="flex justify-between">
				<p className="text-xl font-bold">{sheet.name}</p>

				<ExportSheetButton id={sheet.id} />
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
				{sheet.buttons.map((item) => (
					<ImageCard key={item.id} item={item} sheetId={sheet.id} />
				))}
			</div>
		</div>
	);
}
