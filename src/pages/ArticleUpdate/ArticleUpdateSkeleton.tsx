import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUp } from "lucide-react";

export function ArticleUpdateSkeleton() {
	return (
		<main className="p-4 md:gap-8 md:p-8">
			<div className="grid grid-cols-1 gap-5">
				{/* Image upload skeleton */}
				<div className="w-full max-w-[500px] lg:w-2/5 lg:max-w-none mx-auto aspect-video border-dashed border-border border-2 flex items-center justify-center text-center text-sm bg-muted/30 animate-pulse">
					<div className="flex flex-col space-y-2 items-center text-muted-foreground">
						<ImageUp className="w-10 h-10" />
						<p>Image upload area</p>
					</div>
				</div>

				{/* Title and Category fields skeleton */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
					<fieldset className="grid gap-2 auto-rows-min">
						<Label>Title</Label>
						<Skeleton className="h-8 w-full" />
					</fieldset>
					<fieldset className="grid gap-2 auto-rows-min">
						<Label>Category</Label>
						<Skeleton className="h-8 w-full" />
					</fieldset>
				</div>

				{/* Description field skeleton */}
				<fieldset className="grid gap-2">
					<Label>Description</Label>
					<Skeleton className="h-32 w-full" />
				</fieldset>

				{/* Buttons skeleton */}
				<div className="flex justify-end gap-2 mt-5">
					<Skeleton className="h-8 w-20" />
					<Skeleton className="h-8 w-20" />
				</div>
			</div>
		</main>
	);
}
