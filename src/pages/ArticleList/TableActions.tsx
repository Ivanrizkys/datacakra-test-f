import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteArticleMutation } from "@/service/article";
import type { Article } from "@/types/article";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

interface ArticleTableActionsProps {
	row: Row<Article>;
}

export function ArticleTableActions({ row }: ArticleTableActionsProps) {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const queryClient = useQueryClient();
	const { mutate: doDeleteArticle, isPending: isPendingDeleteArticle } =
		useDeleteArticleMutation();

	const handleDeleteArticle = () => {
		toast("Article Deleted In Progress", {
			description: "The selected article have been progress to deleted",
		});
		doDeleteArticle(
			{
				documentId: row.original.documentId,
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["articles"] });
					toast("Article Deleted", {
						description: "The selected article have been successfully deleted.",
					});
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
		<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
				>
					<DotsHorizontalIcon className="h-4 w-4" />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[160px]">
				<Link to={`/dashboard/article/${row.original.documentId}`}>
					<DropdownMenuItem>View</DropdownMenuItem>
				</Link>
				<Link to={`/dashboard/article/update/${row.original.documentId}`}>
					<DropdownMenuItem>Update</DropdownMenuItem>
				</Link>
				<DropdownMenuItem onClick={handleDeleteArticle}>
					Delete
					{isPendingDeleteArticle ? (
						<Loader2 className="w-4 h-4 animate-spin" />
					) : (
						<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
					)}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
