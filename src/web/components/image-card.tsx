import { Volume2 } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export function ImageCard() {
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
						<p className="text-lg font-medium justify-end">Přidat</p>
						<Button variant="outline">
							<Volume2 />
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
