import type { Column } from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DataTableColumnHeader from "..";

// Mock the Column type from @tanstack/react-table
const createMockColumn = (options: {
	canSort?: boolean;
	isSorted?: false | "asc" | "desc";
}): Column<unknown, unknown> => {
	return {
		getCanSort: () => options.canSort ?? true,
		getIsSorted: () => options.isSorted ?? false,
		toggleSorting: vi.fn(),
		toggleVisibility: vi.fn(),
	} as unknown as Column<unknown, unknown>;
};

describe("DataTableColumnHeader", () => {
	let mockColumn: Column<unknown, unknown>;

	beforeEach(() => {
		mockColumn = createMockColumn({});
	});

	it("renders the title correctly", () => {
		render(<DataTableColumnHeader column={mockColumn} title="Test Column" />);
		expect(screen.getByText("Test Column")).toBeInTheDocument();
	});

	it("renders without dropdown when sorting is disabled via props", () => {
		render(
			<DataTableColumnHeader
				column={mockColumn}
				title="Test Column"
				sorting={false}
			/>,
		);

		expect(screen.getByText("Test Column")).toBeInTheDocument();
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	it("renders without dropdown when column cannot be sorted", () => {
		const nonSortableColumn = createMockColumn({ canSort: false });

		render(
			<DataTableColumnHeader column={nonSortableColumn} title="Test Column" />,
		);

		expect(screen.getByText("Test Column")).toBeInTheDocument();
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	it("applies custom className when provided", () => {
		const { container } = render(
			<DataTableColumnHeader
				column={mockColumn}
				title="Test Column"
				className="custom-class"
			/>,
		);

		expect(container.firstChild).toHaveClass("custom-class");
	});
});
