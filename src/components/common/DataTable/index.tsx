import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	DoubleArrowLeftIcon,
	DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { type ReactNode, useState } from "react";

interface DataTablePagination {
	page: number;
	pageSize: number;
	totalPage: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	setPageSize: React.Dispatch<React.SetStateAction<number>>;
}

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	isLoadingData: boolean;
	rowSelectionKey?: keyof TData;
	rowSelection?: Record<number, boolean>;
	setRowSelection?: React.Dispatch<
		React.SetStateAction<Record<number, boolean>>
	>;
	filterAndAction: ReactNode;
	pagination?: DataTablePagination;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	isLoadingData,
	rowSelectionKey,
	rowSelection,
	setRowSelection,
	filterAndAction,
	pagination,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		...(rowSelectionKey
			? { getRowId: (row: TData) => String(row[rowSelectionKey]) }
			: {}),
		...(setRowSelection ? { onRowSelectionChange: setRowSelection } : {}),
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			...(rowSelection ? { rowSelection } : {}),
		},
	});

	return (
		<section className="space-y-4">
			<div className="flex items-center gap-2 justify-between">
				{filterAndAction}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							View
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{!isLoadingData ? (
							table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-[456px] text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)
						) : (
							<TableRow className="h-[456px]">
								<TableCell colSpan={columns.length}>
									<div className="flex flex-col space-y-2 items-center justify-center">
										<Loader2 className="w-8 h-8 animate-spin text-primary" />
										Loading
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			{pagination && (
				<div className="flex items-center justify-between space-x-2 py-4">
					<div className="text-sm text-muted-foreground">
						{table.getFilteredSelectedRowModel().rows.length} of{" "}
						{table.getFilteredRowModel().rows.length} row(s) selected.
					</div>
					<div className="flex items-center space-x-6">
						<div className="flex items-center space-x-2">
							<span className="text-sm font-medium">Rows per page</span>
							<select
								value={pagination.pageSize}
								onChange={(e) => {
									pagination.setPageSize(Number(e.target.value));
								}}
								className="h-8 w-16 rounded-md border border-input bg-background px-2 py-1 text-sm"
							>
								{[10, 20, 30, 40, 50].map((pageSize) => (
									<option key={pageSize} value={pageSize}>
										{pageSize}
									</option>
								))}
							</select>
						</div>
						<div className="flex items-center gap-1">
							<div className="text-sm font-medium mr-4">
								Page {pagination.page} of {pagination.totalPage}
							</div>
							<Button
								variant="outline"
								size="icon"
								onClick={() => pagination.setPage(1)}
								disabled={pagination.page === 1}
								className="h-8 w-8"
							>
								<span className="sr-only">Go to first page</span>
								<DoubleArrowLeftIcon className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => pagination.setPage((prev) => prev - 1)}
								disabled={pagination.page === 1}
								className="h-8 w-8"
							>
								<span className="sr-only">Go to previous page</span>
								<ChevronLeftIcon className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => pagination.setPage((prev) => prev + 1)}
								disabled={pagination.page === pagination.totalPage}
								className="h-8 w-8"
							>
								<span className="sr-only">Go to next page</span>
								<ChevronRightIcon className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => pagination.setPage(pagination.totalPage)}
								disabled={pagination.page === pagination.totalPage}
								className="h-8 w-8"
							>
								<span className="sr-only">Go to last page</span>
								<DoubleArrowRightIcon className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
