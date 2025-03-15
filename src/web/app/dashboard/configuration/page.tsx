import { ImageCard } from "~/components/image-card";

const items = Array.from(Array(9).keys());

export default function Page() {
	return (
		<div className="flex flex-1 flex-col gap-4 px-4 py-10 pb-0">
			<div className="grid grid-cols-3 gap-8">
				{items.map((item) => (
					<ImageCard key={item} id={item} />
				))}
			</div>
		</div>
	);
}
