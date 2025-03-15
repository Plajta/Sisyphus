import { DialogWrapper } from "~/components/dialog-wrapper";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	return (
		<DialogWrapper>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{id}</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete your account and remove your data
						from our servers.
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</DialogWrapper>
	);
}
