"use server";

import { z } from "zod";
import { actionClient } from "~/modules/safe-action";
import { prisma } from "~/modules/prisma";

import { PDFDocument, rgb } from "pdf-lib";
import { writeFile } from "node:fs/promises";

const path = `${process.cwd()}/files`;

const schema = z.object({
	id: z.coerce.number(),
});

export const exportSheet = actionClient.schema(schema).action(async ({ parsedInput: { id } }) => {
	const sheet = await prisma.sheet.findFirst({
		where: {
			id,
		},
	});

	if (!sheet) {
		return { success: false, message: "sheet neni" };
	}

	const pdfDoc = await PDFDocument.create();

	const page = pdfDoc.addPage([595.28, 841.89]);

	const { width, height } = page.getSize();

	page.drawLine({
		start: { x: 0, y: height / 2 },
		end: { x: width, y: height / 2 },
		thickness: 1,
		color: rgb(0, 0, 0),
	});

	const pdfBytes = await pdfDoc.save();

	const file = await prisma.file.create({
		data: {
			type: "PDF",
		},
	});

	try {
		await writeFile(`${path}/${file.id}.pdf`, Buffer.from(pdfBytes));
	} catch (e) {
		return { success: true, message: e };
	}

	return { success: true, redirect: `/api/file/${file.id}` };
});
