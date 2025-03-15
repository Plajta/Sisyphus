"use server";

import { z } from "zod";
import { zfd } from "zod-form-data";
import { actionClient } from "~/modules/safe-action";
import { prisma } from "~/modules/prisma";
import { revalidatePath } from "next/cache";

const schema = zfd.formData({
	name: zfd.text(z.string()),
});

export const createSheet = actionClient.schema(schema).action(async ({ parsedInput: { name } }) => {
	const sheet = await prisma.sheet.create({
		data: {
			name,
			colorCode: "#FFFFFF",
			buttons: {
				createMany: {
					data: Array.from(Array(9).keys()).map(() => ({ text: "Zvol text" })),
				},
			},
		},
	});

	revalidatePath(`/dashboard/configuration/sheet/${sheet.id}`);

	return { success: true, redirect: `/dashboard/configuration/sheet/${sheet.id}` };
});
