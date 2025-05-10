import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleDetailSkeleton() {
	return (
		<div className="flex flex-col min-h-screen">
			<header className="border-b py-3 px-4 flex items-center justify-between">
				<Skeleton className="h-7 w-64" />
				<Skeleton className="h-9 w-20" />
			</header>

			<main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full">
				<div className="space-y-6">
					<Card>
						<CardContent>
							<Skeleton className="relative w-full h-[300px] md:h-[400px]" />
							<div className="space-y-2 pt-6 pb-6">
								<Skeleton className="h-5 w-full" />
								<Skeleton className="h-5 w-full" />
								<Skeleton className="h-5 w-full" />
								<Skeleton className="h-5 w-3/4" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent>
							<Skeleton className="h-7 w-40 mb-4" />
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Skeleton className="h-4 w-20 mb-2" />
									<Skeleton className="h-5 w-40" />
								</div>
								<div>
									<Skeleton className="h-4 w-20 mb-2" />
									<Skeleton className="h-5 w-40" />
								</div>
								<div>
									<Skeleton className="h-4 w-20 mb-2" />
									<Skeleton className="h-5 w-12" />
								</div>
								<div>
									<Skeleton className="h-4 w-24 mb-2" />
									<Skeleton className="h-5 w-48" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>

			{/* Footer Skeleton */}
			<footer className="border-t py-3 px-4">
				<div className="flex items-center justify-between">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-4 w-48" />
				</div>
			</footer>
		</div>
	);
}
