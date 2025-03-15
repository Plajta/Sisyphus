"use server";

import { z } from "zod";
import { actionClient } from "~/modules/safe-action";
import { prisma } from "~/modules/prisma";

import { PageSizes, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { writeFile } from "node:fs/promises";

const path = `${process.cwd()}/files`;

const schema = z.object({
	id: z.coerce.number(),
});

function mmsToPoints(mms: number) {
	return mms * 2.83465;
}

function create2DArrayFromArray<T>(arr: T[]): T[][] {
	if (arr.length !== 9) {
		throw new Error("Input array must contain exactly 9 elements.");
	}

	const result: T[][] = [];
	const size = 3;

	for (let i = 0; i < size; i++) {
		result.push(arr.slice(i * size, (i + 1) * size));
	}

	return result;
}

const sheetDimensions = {
	width: mmsToPoints(138),
	height: mmsToPoints(150),
	buttonGridHeight: mmsToPoints(140),
	sectionDimensions: mmsToPoints(42),
	colorSectionHeight: mmsToPoints(10),
	buttonGridGap: mmsToPoints(3),
};

export const exportSheet = actionClient.schema(schema).action(async ({ parsedInput: { id } }) => {
	const sheet = await prisma.sheet.findFirst({
		where: {
			id,
		},
		include: {
			buttons: true,
		},
	});

	if (!sheet) {
		return { success: false, message: "sheet neni" };
	}

	const pdfDoc = await PDFDocument.create();

	const page = pdfDoc.addPage(PageSizes.A4);

	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

	const text = "© Plajtakom 2025";
	const fontSize = 15;

	page.drawText(text, {
		x: mmsToPoints(2),
		y: mmsToPoints(143),
		size: fontSize,
		font: font,
		color: rgb(0, 0, 0),
	});

	page.drawLine({
		start: { x: 0, y: sheetDimensions.buttonGridHeight },
		end: { x: sheetDimensions.width, y: sheetDimensions.buttonGridHeight },
		thickness: 1,
		color: rgb(0, 0, 0),
	});

	page.drawRectangle({
		x: 0,
		y: 0,
		width: sheetDimensions.width,
		height: sheetDimensions.height,
		borderWidth: 1,
		borderColor: rgb(0, 0, 0),
	});

	page.drawRectangle({
		x: sheetDimensions.sectionDimensions + sheetDimensions.buttonGridGap * 2,
		y: sheetDimensions.buttonGridHeight,
		height: sheetDimensions.colorSectionHeight,
		width: sheetDimensions.sectionDimensions,
		color: rgb(1, 0, 0),
	});

	const button2DArray = create2DArrayFromArray(sheet.buttons);

	for (const [rowIndex, row] of button2DArray.entries()) {
		for (const [buttonIndex, button] of row.entries()) {
			page.drawRectangle({
				x:
					sheetDimensions.buttonGridGap +
					buttonIndex * (sheetDimensions.buttonGridGap + sheetDimensions.sectionDimensions),
				y:
					sheetDimensions.buttonGridGap +
					rowIndex * (sheetDimensions.buttonGridGap + sheetDimensions.sectionDimensions),
				height: sheetDimensions.sectionDimensions,
				width: sheetDimensions.sectionDimensions,
				color: rgb(0, 0, 1),
			});
		}
	}

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
