import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeleteArticleBulkMutation } from "@/service/article";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import type { DebouncedState } from "usehooks-ts";

interface ArticleFilterAndActionProps {
	rowSelection: Record<number, boolean>;
	setRowSelection: React.Dispatch<
		React.SetStateAction<Record<number, boolean>>
	>;
	setTitle: DebouncedState<(value: string) => void>;
}

export function ArticleFilterAndAction({
	rowSelection,
	setTitle,
	setRowSelection,
}: ArticleFilterAndActionProps) {
	const [dialogDelete, setDialogDelete] = useState(false);

	const queryClient = useQueryClient();
	const { mutate: doDeleteArticle, isPending: isPendingDeleteArticle } =
		useDeleteArticleBulkMutation();

	const handleDeleteArticleBulk = () => {
		doDeleteArticle(
			{
				documentId: Object.keys(rowSelection),
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["articles"] });
					toast("Article Deleted", {
						description: "The selected article have been successfully deleted.",
					});
					setDialogDelete(false);
					setRowSelection({});
				},
				onError: (error) => {
					toast.error("Failed to Delete Article", {
						description: ` ${error.message}. Please try again later.`,
					});
					import.meta.env.DEV && console.error("Error occured", error);
				},
			},
		);
	};

	return (
		<div className="flex w-full items-center gap-2">
			<Input
				type="search"
				placeholder="Insert title of article"
				className="max-w-sm"
				onChange={(e) => setTitle(e.target.value)}
			/>
			<Link to="/dashboard/article/create">
				<Button type="button" variant="outline">
					Create
				</Button>
			</Link>
			{Object.keys(rowSelection).length > 0 && (
				<AlertDialog open={dialogDelete} onOpenChange={setDialogDelete}>
					<AlertDialogTrigger asChild>
						<Button variant="destructive">Delete</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								article from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<Button onClick={handleDeleteArticleBulk}>
								Continue{" "}
								{isPendingDeleteArticle && (
									<Loader2 className="w-4 h-4 animate-spin" />
								)}
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</div>
	);
}
