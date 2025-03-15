"use client";

import { useAction } from "next-safe-action/hooks";

interface FormWrapperProps {
	action: any;
	children: React.ReactNode;
	className?: string;
}

export function FormWrapper({ action, children, className }: FormWrapperProps) {
	const { execute } = useAction(action);

	return (
		<form action={execute} className={className}>
			{children}
		</form>
	);
}
