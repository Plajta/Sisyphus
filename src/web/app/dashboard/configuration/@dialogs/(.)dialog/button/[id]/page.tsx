import { DialogWrapper } from "~/components/dialog-wrapper";
import { Button } from "~/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { VoiceRecorder } from "~/components/voice-recorder";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	return (
		<DialogWrapper>
			<DialogContent className="">
				<DialogHeader>
					<DialogTitle>Úprava tlačítka {id}</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-4">
					<div className="grid w-full items-center gap-1.5">
						<Label htmlFor="picture">Text</Label>
						<Input name="text" placeholder="Text tlačítka" />
					</div>

					<div className="grid w-full items-center gap-1.5">
						<Label htmlFor="picture">Obrázek</Label>
						<Input id="picture" type="file" />
					</div>

					<div className="grid w-full items-center gap-1.5">
						<Label htmlFor="picture">Zvuk</Label>
						<VoiceRecorder />
					</div>
				</div>

				<Button>Uložit</Button>
			</DialogContent>
		</DialogWrapper>
	);
}
