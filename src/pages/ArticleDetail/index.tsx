import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useGetArticle } from "@/service/article";
import { format } from "date-fns";
import { Facebook, Link2, Twitter } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import ArticleDetailSkeleton from "./ArticleDetailSkeleton";

export default function ArticleDetailPage() {
	const [showShareDialog, setShowShareDialog] = useState(false);

	const { documentId } = useParams();
	const { data: article, isPending: isPendingArticle } = useGetArticle(
		documentId as string,
		!!documentId,
	);

	const handleCopyLink = () => {
		try {
			navigator.clipboard.writeText(window.location.href);
			toast("Sucesfully Copy Article URL", {
				description: "Your can share URL to another platfrom.",
			});
			setShowShareDialog(false);
		} catch (error) {
			toast("Failed Copy Article URL", {
				description: "Error occured, please try again.",
			});
			import.meta.env.DEV && console.error("Error occured", error);
		}
	};

	if (isPendingArticle) return <ArticleDetailSkeleton />;

	return (
		<div className="flex flex-col min-h-scree">
			<header className="border-b py-3 px-4 flex items-center justify-between">
				<h1 className="text-xl font-medium truncate max-w-2xl">
					{article?.data.title}
				</h1>
				<Button variant="outline" onClick={() => setShowShareDialog(true)}>
					Share
				</Button>
			</header>

			{/* Main Content */}
			<main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full">
				<article className="space-y-6">
					<Card>
						<CardContent>
							<figure className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden">
								<img
									src={article?.data.cover_image_url}
									alt={`Cover for ${article?.data.title}`}
									className="object-cover w-full h-full absolute"
								/>
							</figure>
							<div className="prose prose-invert max-w-none pt-6 pb-6">
								<p className="text-lg leading-relaxed">
									{article?.data.description}
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent>
							<h2 className="text-lg font-medium mb-4">Article Details</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-gray-400">Created At</p>
									<p>
										{article?.data.createdAt
											? format(article?.data.createdAt, "dd MMMM yyyy, HH:mm")
											: "-"}
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-400">Updated At</p>
									<p>
										{article?.data.updatedAt
											? format(article?.data.updatedAt, "dd MMMM yyyy, HH:mm")
											: "-"}
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-400">Article ID</p>
									<p>{article?.data.id}</p>
								</div>
								<div>
									<p className="text-sm text-gray-400">Document ID</p>
									<p className="truncate">{article?.data.documentId}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</article>
			</main>

			{/* Share Dialog */}
			<Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Share Article</DialogTitle>
					</DialogHeader>
					<div className="grid grid-cols-3 gap-4 py-4">
						<Button
							variant="outline"
							className="flex flex-col items-center justify-center h-24 border-gray-700 hover:bg-primary-foreground"
							onClick={() => {
								window.open(
									`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
									"_blank",
								);
							}}
						>
							<Facebook className="h-8 w-8 mb-2" />
							<span>Facebook</span>
						</Button>
						<Button
							variant="outline"
							className="flex flex-col items-center justify-center h-24 border-gray-700 hover:bg-primary-foreground"
							onClick={() => {
								window.open(
									`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article?.data.title ?? "")}`,
									"_blank",
								);
							}}
						>
							<Twitter className="h-8 w-8 mb-2" />
							<span>Twitter</span>
						</Button>
						<Button
							variant="outline"
							className="flex flex-col items-center justify-center h-24 border-gray-700 hover:bg-primary-foreground"
							onClick={handleCopyLink}
						>
							<Link2 className="h-8 w-8 mb-2" />
							<span>URL</span>
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<footer className="border-t py-3 px-4">
				<div className="flex items-center justify-between">
					<Link to="/dashboard/article" className="text-sm">
						← Back to Article
					</Link>
					<div className="text-sm text-gray-400">
						Last updated:{" "}
						{article?.data.updatedAt
							? format(article?.data.updatedAt, "dd MMMM yyyy, HH:mm")
							: "-"}
					</div>
				</div>
			</footer>
		</div>
	);
}
