"use server";

import { z } from "zod";
import { actionClient } from "~/modules/safe-action";
import { prisma } from "~/modules/prisma";

import { PageSizes, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { readFile, writeFile } from "node:fs/promises";

const path = `${process.cwd()}/files`;

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	hex = hex.replace(/^#/, "");

	if (hex.length === 3) {
		hex = hex
			.split("")
			.map((char) => char + char)
			.join("");
	}

	if (hex.length !== 6) {
		return null;
	}

	const num = parseInt(hex, 16);

	return {
		r: (num >> 16) & 255,
		g: (num >> 8) & 255,
		b: num & 255,
	};
}

function mmsToPoints(mms: number) {
	return mms * 2.83465;
}

function offsetPoints(points: number) {
	return points + mmsToPoints(10);
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

	return result.reverse();
}

const sheetDimensions = {
	plajta: {
		sheetNameText: {
			x: offsetPoints(mmsToPoints(2)),
			y: offsetPoints(mmsToPoints(143)),
		},
		authorNameText: {
			x: offsetPoints(mmsToPoints(90)),
			y: offsetPoints(mmsToPoints(143)),
		},
		foldText: {
			x: offsetPoints(mmsToPoints(3)),
			y: offsetPoints(mmsToPoints(153)),
		},
		container: {
			x: offsetPoints(0),
			y: offsetPoints(0),
			width: mmsToPoints(138),
			height: mmsToPoints(160),
		},
		headerDivider: {
			gap: mmsToPoints(10),
		},
		button: {
			width: mmsToPoints(42),
			height: mmsToPoints(42),
		},
		buttonGrid: {
			width: mmsToPoints(138),
			height: mmsToPoints(140),
			gap: mmsToPoints(3),
		},
		buttonGridHeight: mmsToPoints(140),
		sectionDimensions: mmsToPoints(42),
		colorSectionHeight: mmsToPoints(10),
		buttonGridGap: mmsToPoints(3),
		gridPadding: mmsToPoints(10),
	},
};

const schema = z.object({
	id: z.coerce.number(),
	type: z.enum(["plajta", "ft12"]),
});

export const exportSheet = actionClient.schema(schema).action(async ({ parsedInput: { id, type } }) => {
	const sheet = await prisma.sheet.findFirst({
		where: {
			id,
		},
		include: {
			buttons: {
				include: {
					files: true,
				},
				orderBy: {
					id: "asc",
				},
			},
		},
	});

	if (!sheet) {
		return { success: false, message: "sheet neni" };
	}

	const pdfDoc = await PDFDocument.create();

	const page = pdfDoc.addPage(PageSizes.A4);

	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

	const authorText = "Sisyphus-gen 2025";
	const fontSize = 15;

	const foldText = "-- Tudle vohnout --";

	const dimensions = sheetDimensions["plajta"];

	page.drawText(sheet.name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), {
		...dimensions.sheetNameText,
		size: fontSize,
		font: font,
		color: rgb(0, 0, 0),
	});

	page.drawText(authorText, {
		...dimensions.authorNameText,
		size: fontSize,
		font: font,
		color: rgb(0, 0, 0),
	});

	if (dimensions.foldText) {
		page.drawText(foldText, {
			...dimensions.foldText,
			size: fontSize,
			font: font,
			color: rgb(0, 0, 0),
		});

		page.drawText(foldText, {
			x: dimensions.foldText.x + 2 * dimensions.sectionDimensions + 15,
			y: dimensions.foldText.y,
			size: fontSize,
			font: font,
			color: rgb(0, 0, 0),
		});
	}

	if (dimensions.headerDivider) {
		page.drawLine({
			start: { x: offsetPoints(0), y: offsetPoints(dimensions.buttonGrid.height) },
			end: { x: offsetPoints(dimensions.buttonGrid.width), y: offsetPoints(dimensions.buttonGrid.height) },
			thickness: 1,
			color: rgb(0, 0, 0),
		});

		page.drawLine({
			start: { x: offsetPoints(0), y: offsetPoints(dimensions.buttonGrid.height + dimensions.headerDivider.gap) },
			end: {
				x: offsetPoints(dimensions.buttonGrid.width),
				y: offsetPoints(dimensions.buttonGrid.height + dimensions.headerDivider.gap),
			},
			thickness: 1,
			color: rgb(0, 0, 0),
		});

		const sheetColor = hexToRgb(sheet.colorCode)!;

		page.drawRectangle({
			x: offsetPoints(dimensions.button.width + dimensions.buttonGrid.gap * 2),
			y: offsetPoints(dimensions.buttonGrid.height + mmsToPoints(10)),
			height: dimensions.headerDivider.gap,
			width: dimensions.button.width,
			color: rgb(sheetColor.r / 255, sheetColor.g / 255, sheetColor.b / 255),
		});
	}

	page.drawRectangle({
		...dimensions.container,
		borderWidth: 1,
		borderColor: rgb(0, 0, 0),
	});

	const button2DArray = create2DArrayFromArray(sheet.buttons);

	for (const [rowIndex, row] of button2DArray.entries()) {
		for (const [buttonIndex, button] of row.entries()) {
			const imageFile = button.files.find((file) => file.type === "IMAGE");

			if (!imageFile) {
				continue;
			}

			const fileBuffer = await readFile(`${path}/${imageFile.id}.png`);

			const image = await pdfDoc.embedPng(fileBuffer);

			page.drawImage(image, {
				x: offsetPoints(
					dimensions.buttonGrid.gap + buttonIndex * (dimensions.buttonGrid.gap + dimensions.button.width)
				),
				y: offsetPoints(mmsToPoints(20) + rowIndex * (dimensions.buttonGrid.gap + dimensions.button.width)),
				height: dimensions.button.height - 50,
				width: dimensions.button.width,
			});

			page.drawText(button.text.toUpperCase(), {
				x: offsetPoints(mmsToPoints(10) + buttonIndex * (dimensions.buttonGrid.gap + dimensions.button.width)),
				y: offsetPoints(mmsToPoints(10) + rowIndex * (dimensions.buttonGrid.gap + dimensions.button.height)),
				size: 15,
				font: font,
				color: rgb(0, 0, 0),
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

	return { success: true, redirect: `/api/file/${file.id}.pdf` };
});
