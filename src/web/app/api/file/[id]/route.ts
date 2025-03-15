import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import { prisma } from "~/modules/prisma";

const path = `${process.cwd()}/files`;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const file = await prisma.file.findFirst({
		where: {
			id,
		},
	});

	if (!file) {
		return notFound();
	}

	try {
		const fileBuffer = await readFile(`${path}/${file.id}`);

		return new Response(fileBuffer, {
			headers: {
				"Content-Type": file.type === "IMAGE" ? "image/png" : "audio/waw",
				"Content-Disposition": `inline; filename="${file.id}"`,
			},
		});
	} catch (error) {
		return new Response("File not found", { status: 404 });
	}
}
