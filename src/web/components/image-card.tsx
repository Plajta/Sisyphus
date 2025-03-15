import { Edit, Volume2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

interface ImageCardProps {
	id: number;
}

export function ImageCard({ id }: ImageCardProps) {
	return (
		<Card>
			<CardHeader className="flex justify-center">
				<Image
					src="https://img.privezemenakup.cz/images/Rohl%C3%ADk%20tukov%C3%BD%2043g.jpg"
					width={250}
					height={100}
					alt="rohlik"
				/>
			</CardHeader>

			<Separator />

			<CardContent>
				<div className="flex flex-col gap-4">
					<div className="flex justify-between items-center">
						<p className="text-lg">Přidat</p>

						<div className="flex gap-1">
							<Button variant="outline">
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
