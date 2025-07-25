"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type React from "react";

export function BackButton({
	label = "Back",
	className = "",
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label?: string }) {
	const router = useRouter();

	return (
		<Button
			type="button"
			variant="outline"
			className={`inline-flex items-center gap-2 text-blue-600  hover:bg-blue-50/50 focus-visible:ring-blue-400 border-none shadow-none bg-transparent ${className}`}
			aria-label="Go back to previous page"
			onClick={() => router.back()}
			{...props}
		>
			<ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {/* <p>Back</p> */}
			<span className="sr-only md:not-sr-only">{label}</span>
		</Button>
	);
}

export default BackButton;
