import type { ColumnDef } from "@tanstack/react-table";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DataTable } from "..";

interface TestData {
	id: number;
	name: string;
	age: number;
}

const mockData: TestData[] = [
	{ id: 1, name: "John Doe", age: 30 },
	{ id: 2, name: "Jane Smith", age: 25 },
	{ id: 3, name: "Bob Johnson", age: 40 },
];

const createMockColumns = (): ColumnDef<TestData, unknown>[] => [
	{
		id: "id",
		accessorKey: "id",
		header: "ID",
		cell: ({ row }) => row.getValue("id"),
		enableHiding: false,
	},
	{
		id: "name",
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => row.getValue("name"),
	},
	{
		id: "age",
		accessorKey: "age",
		header: "Age",
		cell: ({ row }) => row.getValue("age"),
	},
];

const MockFilterAndAction = () => (
	<div data-testid="filter-action">Filter and Action</div>
);

describe("DataTable", () => {
	let mockColumns: ColumnDef<TestData, unknown>[];
	let mockSetRowSelection: ReturnType<typeof vi.fn>;
	let mockPagination: {
		page: number;
		pageSize: number;
		totalPage: number;
		setPage: ReturnType<typeof vi.fn>;
		setPageSize: ReturnType<typeof vi.fn>;
	};

	beforeEach(() => {
		mockColumns = createMockColumns();
		mockSetRowSelection = vi.fn();
		mockPagination = {
			page: 1,
			pageSize: 10,
			totalPage: 3,
			setPage: vi.fn(),
			setPageSize: vi.fn(),
		};
	});

	it("renders the table with data correctly", () => {
		render(
			<DataTable
				columns={mockColumns}
				data={mockData}
				isLoadingData={false}
				filterAndAction={<MockFilterAndAction />}
			/>,
		);

		// * Check if table headers are rendered
		expect(screen.getByText("ID")).toBeInTheDocument();
		expect(screen.getByText("Name")).toBeInTheDocument();
		expect(screen.getByText("Age")).toBeInTheDocument();

		// * Check if data is rendered
		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("Jane Smith")).toBeInTheDocument();
		expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
		expect(screen.getByText("30")).toBeInTheDocument();
		expect(screen.getByText("25")).toBeInTheDocument();
		expect(screen.getByText("40")).toBeInTheDocument();
	});

	it("displays loading state correctly", () => {
		render(
			<DataTable
				columns={mockColumns}
				data={[]}
				isLoadingData={true}
				filterAndAction={<MockFilterAndAction />}
			/>,
		);

		expect(screen.getByText("Loading")).toBeInTheDocument();
	});

	it('displays "No results" when data is empty', () => {
		render(
			<DataTable
				columns={mockColumns}
				data={[]}
				isLoadingData={false}
				filterAndAction={<MockFilterAndAction />}
			/>,
		);

		expect(screen.getByText("No results.")).toBeInTheDocument();
	});

	it("renders the filter and action component", () => {
		render(
			<DataTable
				columns={mockColumns}
				data={mockData}
				isLoadingData={false}
				filterAndAction={<MockFilterAndAction />}
			/>,
		);

		expect(screen.getByTestId("filter-action")).toBeInTheDocument();
	});

	it("renders pagination controls when pagination is provided", () => {
		render(
			<DataTable
				columns={mockColumns}
				data={mockData}
				isLoadingData={false}
				filterAndAction={<MockFilterAndAction />}
				pagination={mockPagination}
			/>,
		);

		expect(screen.getByText("Rows per page")).toBeInTheDocument();
		expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
		expect(screen.getByText("10")).toBeInTheDocument();
	});

	it("calls setPage when pagination buttons are clicked", () => {
		render(
			<DataTable
				columns={mockColumns}
				data={mockData}
				isLoadingData={false}
				filterAndAction={<MockFilterAndAction />}
				pagination={mockPagination}
			/>,
		);

		// * Get pagination buttons
		const nextPageButton = screen.getByRole("button", {
			name: /Go to next page/i,
		});
		const lastPageButton = screen.getByRole("button", {
			name: /Go to last page/i,
		});

		// * Click next page button
		fireEvent.click(nextPageButton);
		expect(mockPagination.setPage).toHaveBeenCalledWith(expect.any(Function));

		// * Click last page button
		fireEvent.click(lastPageButton);
		expect(mockPagination.setPage).toHaveBeenCalledWith(3);
	});

	it("calls setPageSize when rows per page select is changed", () => {
		render(
			<DataTable
				columns={mockColumns}
				data={mockData}
				isLoadingData={false}
				filterAndAction={<MockFilterAndAction />}
				pagination={mockPagination}
			/>,
		);

		// * Get rows per page select
		const select = screen.getByRole("combobox");

		// * Change value to 20
		fireEvent.change(select, { target: { value: "20" } });

		expect(mockPagination.setPageSize).toHaveBeenCalledWith(20);
	});

	it("disables previous page buttons when on first page", () => {
		render(
			<DataTable
				columns={mockColumns}
				data={mockData}
				isLoadingData={false}
				filterAndAction={<MockFilterAndAction />}
				pagination={mockPagination}
			/>,
		);

		const firstPageButton = screen.getByRole("button", {
			name: /Go to first page/i,
		});
		const prevPageButton = screen.getByRole("button", {
			name: /Go to previous page/i,
		});

		expect(firstPageButton).toBeDisabled();
		expect(prevPageButton).toBeDisabled();
	});

	it("disables next page buttons when on last page", () => {
		const lastPagePagination = {
			...mockPagination,
			page: 3,
		};

		render(
			<DataTable
				columns={mockColumns}
				data={mockData}
				isLoadingData={false}
				filterAndAction={<MockFilterAndAction />}
				pagination={lastPagePagination}
			/>,
		);

		const nextPageButton = screen.getByRole("button", {
			name: /Go to next page/i,
		});
		const lastPageButton = screen.getByRole("button", {
			name: /Go to last page/i,
		});

		expect(nextPageButton).toBeDisabled();
		expect(lastPageButton).toBeDisabled();
	});

	it("handles row selection correctly", () => {
		const rowSelection = { 1: true };

		render(
			<DataTable
				columns={mockColumns}
				data={mockData}
				isLoadingData={false}
				filterAndAction={<MockFilterAndAction />}
				rowSelectionKey="id"
				rowSelection={rowSelection}
				setRowSelection={mockSetRowSelection}
			/>,
		);

		// * With pagination, check if selected row count is displayed
		render(
			<DataTable
				columns={mockColumns}
				data={mockData}
				isLoadingData={false}
				filterAndAction={<MockFilterAndAction />}
				rowSelectionKey="id"
				rowSelection={rowSelection}
				setRowSelection={mockSetRowSelection}
				pagination={mockPagination}
			/>,
		);

		expect(screen.getByText("1 of 3 row(s) selected.")).toBeInTheDocument();
	});
});
