import { createSheet } from "~/actions/sheet/create";
import { DialogWrapper } from "~/components/dialog-wrapper";
import { FormWrapper } from "~/components/form-wrapper";
import { Button } from "~/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default async function Page() {
	return (
		<DialogWrapper>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Tvorba Konfigurace</DialogTitle>
				</DialogHeader>

				<FormWrapper action={createSheet} className="flex flex-col gap-2">
					<div className="flex flex-col gap-4">
						<div className="grid w-full items-center gap-1.5">
							<Label htmlFor="picture">Název</Label>
							<Input name="name" placeholder="Název konfigurace" />
						</div>
					</div>

					<Button>Vytvořit</Button>
				</FormWrapper>
			</DialogContent>
		</DialogWrapper>
	);
}
