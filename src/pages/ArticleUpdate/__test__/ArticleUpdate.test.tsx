import { imageURLToFile } from "@/lib/utils";
import { useGetArticle, useUpdateArticleMutation } from "@/service/article";
import { useGetCategories } from "@/service/category";
import { useUploadMutation } from "@/service/upload";
import { useQueryClient } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useNavigate, useParams } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ArticleUpdate from "..";

vi.mock("react-router", () => ({
	useNavigate: vi.fn(),
	useParams: vi.fn(),
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
	useGetArticle: vi.fn(),
	useUpdateArticleMutation: vi.fn(),
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

vi.mock("@/lib/utils", () => ({
	cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
	imageURLToFile: vi.fn(),
}));

vi.mock("./ArticleUpdateSkeleton", () => ({
	ArticleUpdateSkeleton: () => (
		<div data-testid="article-update-skeleton">Loading Skeleton</div>
	),
}));

global.URL.createObjectURL = vi.fn(() => "mock-image-url");

describe("ArticleUpdate", () => {
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
	const mockArticle = {
		data: {
			documentId: "article-123",
			title: "Original Article Title",
			description:
				"Original article description that is long enough for validation",
			cover_image_url: "https://example.com/original-image.jpg",
			category: 1,
		},
	};
	const mockUploadMutation = {
		mutate: vi.fn(),
		isPending: false,
	};
	const mockUpdateArticleMutation = {
		mutate: vi.fn(),
		isPending: false,
	};
	const mockFile = new File(["dummy content"], "test-image.png", {
		type: "image/png",
	});

	beforeEach(() => {
		vi.clearAllMocks();

		// Setup mocks
		(useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
			mockNavigate,
		);
		(useParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			documentId: "article-123",
		});
		(useQueryClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
			mockQueryClient,
		);
		(useGetCategories as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			data: mockCategories,
			isPending: false,
		});
		(useGetArticle as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			data: mockArticle,
			isPending: false,
		});
		(useUploadMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
			mockUploadMutation,
		);
		(
			useUpdateArticleMutation as unknown as ReturnType<typeof vi.fn>
		).mockReturnValue(mockUpdateArticleMutation);
		(imageURLToFile as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockFile,
		);
	});

	it("validates form fields", async () => {
		render(<ArticleUpdate />);

		fireEvent.change(screen.getByLabelText(/title/i), {
			target: { value: "" },
		});
		fireEvent.change(screen.getByLabelText(/description/i), {
			target: { value: "" },
		});

		fireEvent.click(screen.getByRole("button", { name: /save/i }));

		await waitFor(() => {
			expect(screen.getByText(/title can't be empty/i)).toBeInTheDocument();
			expect(
				screen.getByText(/description can't be empty/i),
			).toBeInTheDocument();
		});
	});

	it("renders the form correctly", () => {
		render(<ArticleUpdate />);

		expect(
			screen.getByText(/drag 'n' drop some files here/i),
		).toBeInTheDocument();
		expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
		expect(screen.getByText(/category/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
	});

	it("validates title length", async () => {
		render(<ArticleUpdate />);

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
		render(<ArticleUpdate />);

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

	it("shows loading state during form submission", async () => {
		(
			useUpdateArticleMutation as unknown as ReturnType<typeof vi.fn>
		).mockReturnValue({
			...mockUpdateArticleMutation,
			isPending: true,
		});

		render(<ArticleUpdate />);

		expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
		expect(
			screen
				.getByRole("button", { name: /save/i })
				.querySelector(".animate-spin"),
		).toBeInTheDocument();
	});

	it("navigates back when cancel button is clicked", () => {
		render(<ArticleUpdate />);

		fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

		expect(mockNavigate).toHaveBeenCalledWith(-1);
	});
});
