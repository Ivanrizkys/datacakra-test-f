import { DataTable } from "@/components/common/DataTable";
import DataTableColumnHeader from "@/components/common/DataTableColumnHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { getInitials } from "@/lib/utils";
import { useGetArticles } from "@/service/article";
import type { Article } from "@/types/article";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { ArticleFilterAndAction } from "./FilterAndAction";
import { ArticleTableActions } from "./TableActions";

const columns: ColumnDef<Article>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "title",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Title" />
		),
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				{!!row.original.publishedAt && <Badge>PUBLISHED</Badge>}
				<span>{row.original.title}</span>
			</div>
		),
	},
	{
		id: "username",
		accessorFn: (row) => row.user.username,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Post By" />
		),
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Avatar>
					<AvatarImage src="/" />
					<AvatarFallback>
						{getInitials(row.original.user.username)}
					</AvatarFallback>
				</Avatar>
				<p>{row.original.user.username}</p>
			</div>
		),
	},
	{
		id: "category",
		accessorFn: (row) => row.category?.name,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Category" />
		),
		cell: ({ row }) => (
			<Badge
				variant={row.original.category?.name ? "outline" : "destructive"}
				className="uppercase"
			>
				{row.original.category?.name ?? "Category Not Found"}
			</Badge>
		),
	},
	{
		accessorKey: "comments",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Comments" />
		),
		cell: ({ row }) => (
			<Badge variant="secondary">{row.original.comments.length}</Badge>
		),
	},
	{
		id: "created at",
		accessorFn: (row) => row.user.createdAt,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Created At" />
		),
		cell: ({ row }) => (
			<span className="font-medium">
				{format(row.original.createdAt, "dd MMMM yyyy, HH:mm")}
			</span>
		),
	},
	{
		id: "updated at",
		accessorFn: (row) => row.user.updatedAt,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Updated At" />
		),
		cell: ({ row }) => (
			<span className="font-medium">
				{format(row.original.updatedAt, "dd MMMM yyyy, HH:mm")}
			</span>
		),
	},
	{
		id: "actions",
		cell: ({ row }) => <ArticleTableActions row={row} />,
	},
];

export default function ArticleList() {
	const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [title, setTitle] = useDebounceValue("", 500);

	const { data: articles, isPending: isPendingArticles } = useGetArticles({
		title: title,
		page: page,
		pageSize: pageSize,
	});

	return (
		<main className="p-4 md:gap-8 md:p-8">
			<DataTable
				rowSelectionKey="documentId"
				rowSelection={rowSelection}
				setRowSelection={setRowSelection}
				columns={columns}
				data={articles?.data ?? []}
				isLoadingData={isPendingArticles}
				pagination={{
					page: page,
					pageSize: pageSize,
					totalPage: articles?.meta.pagination.pageCount ?? 0,
					setPage: setPage,
					setPageSize: setPageSize,
				}}
				filterAndAction={
					<ArticleFilterAndAction
						setTitle={setTitle}
						rowSelection={rowSelection}
						setRowSelection={setRowSelection}
					/>
				}
			/>
		</main>
	);
}
