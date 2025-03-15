import { Prisma } from "@prisma/client";
import { Edit, Volume2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export function ImageCard({
	item: { id, text, files },
}: {
	item: Prisma.ButtonGetPayload<{ include: { files: true } }>;
}) {
	const image = files.find((file) => file.type === "IMAGE");

	const voice = files.find((file) => file.type === "VOICE");

	return (
		<Card>
			<CardHeader className="flex justify-center">
				{image && (
					<Image
						src="https://img.privezemenakup.cz/images/Rohl%C3%ADk%20tukov%C3%BD%2043g.jpg"
						width={250}
						height={100}
						alt="rohlik"
					/>
				)}
			</CardHeader>

			<Separator />

			<CardContent>
				<div className="flex flex-col gap-4">
					<div className="flex justify-between items-center">
						<p className="text-lg">{text}</p>

						<div className="flex gap-1">
							<Button variant="outline" disabled={!voice}>
								<Volume2 />
							</Button>

							<Link href={`/dashboard/configuration/dialog/button/${id}`}>
								<Button variant="outline">
									<Edit />
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
