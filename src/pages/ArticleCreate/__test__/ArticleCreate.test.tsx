import { useCreateArticleMutation } from "@/service/article";
import { useGetCategories } from "@/service/category";
import { useUploadMutation } from "@/service/upload";
import { useQueryClient } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ArticleCreate from "..";

// Mock the dependencies
vi.mock("react-router", () => ({
	useNavigate: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
	useQueryClient: vi.fn(),
}));

vi.mock("@/service/category", () => ({
	useGetCategories: vi.fn(),
}));

vi.mock("@/service/upload", () => ({
	useUploadMutation: vi.fn(),
}));

vi.mock("@/service/article", () => ({
	useCreateArticleMutation: vi.fn(),
}));

vi.mock("sonner", () => ({
	toast: vi.fn(),
}));

vi.mock("react-dropzone", () => ({
	useDropzone: () => ({
		getRootProps: () => ({}),
		getInputProps: () => ({}),
		isDragActive: false,
	}),
}));

global.URL.createObjectURL = vi.fn(() => "mock-image-url");

describe("ArticleCreate", () => {
	const mockNavigate = vi.fn();
	const mockQueryClient = {
		invalidateQueries: vi.fn(),
	};
	const mockCategories = {
		data: [
			{ documentId: "1", name: "Technology" },
			{ documentId: "2", name: "Health" },
		],
	};
	const mockUploadMutation = {
		mutate: vi.fn(),
		isPending: false,
	};
	const mockCreateArticleMutation = {
		mutate: vi.fn(),
		isPending: false,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		(useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
			mockNavigate,
		);
		(useQueryClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
			mockQueryClient,
		);
		(useGetCategories as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			data: mockCategories,
			isPending: false,
		});
		(useUploadMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
			mockUploadMutation,
		);
		(
			useCreateArticleMutation as unknown as ReturnType<typeof vi.fn>
		).mockReturnValue(mockCreateArticleMutation);
	});

	it("renders the form correctly", () => {
		render(<ArticleCreate />);

		expect(
			screen.getByText(/drag 'n' drop some files here/i),
		).toBeInTheDocument();
		expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
		expect(screen.getByText(/category/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
	});

	it("displays validation errors when submitting an empty form", async () => {
		render(<ArticleCreate />);

		fireEvent.click(screen.getByRole("button", { name: /save/i }));

		await waitFor(() => {
			expect(screen.getByText(/please insert an image/i)).toBeInTheDocument();
			expect(screen.getByText(/title can't be empty/i)).toBeInTheDocument();
			expect(screen.getByText(/please select a category/i)).toBeInTheDocument();
			expect(
				screen.getByText(/description can't be empty/i),
			).toBeInTheDocument();
		});
	});

	it("validates title length", async () => {
		render(<ArticleCreate />);

		fireEvent.change(screen.getByLabelText(/title/i), {
			target: { value: "Short" },
		});

		fireEvent.click(screen.getByRole("button", { name: /save/i }));

		await waitFor(() => {
			expect(
				screen.getByText(/title must contains atleast 10 character length/i),
			).toBeInTheDocument();
		});
	});

	it("validates description length", async () => {
		render(<ArticleCreate />);

		fireEvent.change(screen.getByLabelText(/description/i), {
			target: { value: "Short desc" },
		});

		fireEvent.click(screen.getByRole("button", { name: /save/i }));

		await waitFor(() => {
			expect(
				screen.getByText(
					/description must contains atleast 20 character length/i,
				),
			).toBeInTheDocument();
		});
	});

	it("navigates back when cancel button is clicked", () => {
		render(<ArticleCreate />);

		fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

		expect(mockNavigate).toHaveBeenCalledWith(-1);
	});

	it("submits the form with valid data", async () => {
		const user = userEvent.setup();

		render(<ArticleCreate />);

		await user.type(
			screen.getByLabelText(/title/i),
			"This is a valid title for testing",
		);

		const selectTrigger = screen.getByRole("combobox");
		await user.click(selectTrigger);
		const categoryOption = screen.getByText("Technology");
		await user.click(categoryOption);

		await user.type(
			screen.getByLabelText(/description/i),
			"This is a valid description that is longer than 20 characters for testing purposes",
		);

		await user.click(screen.getByRole("button", { name: /save/i }));

		expect(screen.queryByText(/title can't be empty/i)).not.toBeInTheDocument();
		expect(
			screen.queryByText(/description can't be empty/i),
		).not.toBeInTheDocument();
	});
});
