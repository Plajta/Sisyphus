"use server";

import { z } from "zod";
import { zfd } from "zod-form-data";
import { actionClient } from "~/modules/safe-action";

const schema = zfd.formData({
	text: zfd.text(z.string()).optional(),
	image: zfd.file().optional(),
	voice: zfd.file().optional(),
});

export const loginUser = actionClient.schema(schema).action(async ({ parsedInput: { text, image, voice } }) => {
	return { failure: "Incorrect credentials" };
});
