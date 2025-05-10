import { Loader2 } from "lucide-react";

interface PageLoaderProps {
	description: string;
}

export default function PageLoader({ description }: PageLoaderProps) {
	return (
		<main className="h-[calc(100dvh-64px)] w-full flex items-center justify-center">
			<div className="flex flex-col items-center space-y-1">
				<Loader2
					role="status"
					className="w-12 h-12 animate-spin text-primary"
				/>
				<p className="text-card-foreground font-semibold">{description}</p>
			</div>
		</main>
	);
}
