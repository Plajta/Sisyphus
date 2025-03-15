"use server";

import { z } from "zod";
import { zfd } from "zod-form-data";
import { actionClient } from "~/modules/safe-action";
import { writeFile } from "node:fs/promises";
import { prisma } from "~/modules/prisma";

const path = `${process.cwd()}/files`;

const schema = zfd.formData({
	id: zfd.numeric(z.number()),
	text: zfd.text(z.string()).optional(),
	image: zfd.file().optional(),
	voice: zfd.file().optional(),
});

export const editButton = actionClient.schema(schema).action(async ({ parsedInput: { id, text, image, voice } }) => {
	if (text) {
		await prisma.button.update({
			where: {
				id,
			},
			data: {
				text,
			},
		});
	}

	if (image) {
		const fileRecord = await prisma.file.create({
			data: {
				type: "IMAGE",
				buttonId: id,
			},
		});

		try {
			await writeFile(`${path}/${fileRecord.id}.png`, Buffer.from(await image.arrayBuffer()));
		} catch (e) {
			console.log(e);
		}
	}

	if (voice) {
		const fileRecord = await prisma.file.create({
			data: {
				type: "VOICE",
				buttonId: id,
			},
		});

		try {
			await writeFile(`${path}/${fileRecord.id}.waw`, Buffer.from(await voice.arrayBuffer()));
		} catch (e) {
			console.log(e);
		}
	}

	return { success: true, message: "Tlačítko úspěšně upraveno" };
});
