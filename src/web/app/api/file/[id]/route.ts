import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import { prisma } from "~/modules/prisma";

const path = `${process.cwd()}/files`;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const idWithoutExtension = id.split(".")[0];

	const file = await prisma.file.findFirst({
		where: {
			id: idWithoutExtension,
		},
	});

	if (!file) {
		return notFound();
	}

	try {
		const fileBuffer = await readFile(`${path}/${id}${file.type === "IMAGE" ? ".png" : ".wav"}`);

		return new Response(fileBuffer, {
			headers: {
				"Content-Type": file.type === "IMAGE" ? "image/png" : "audio/wav",
				"Content-Disposition": `inline; filename="${file.id}"`,
			},
		});
	} catch (error) {
		return new Response("File not found", { status: 404 });
	}
}
