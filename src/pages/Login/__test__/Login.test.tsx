import { useUserStore } from "@/global/user";
import { useLoginMutation } from "@/service/authentication";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { Login } from "..";

vi.mock("@/service/authentication", () => ({
	useLoginMutation: vi.fn(),
}));

vi.mock("@/global/user", () => ({
	useUserStore: vi.fn(),
}));

vi.mock("js-cookie", () => ({
	default: {
		set: vi.fn(),
	},
}));

vi.mock("sonner", () => ({
	toast: vi.fn(),
}));

const mockSetUser = vi.fn();

describe("Login Component", () => {
	beforeEach(() => {
		(useUserStore as unknown as Mock).mockReturnValue(mockSetUser);
	});

	it("renders form fields", () => {
		(useLoginMutation as Mock).mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
		});

		render(
			<MemoryRouter>
				<Login />
			</MemoryRouter>,
		);

		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
	});

	it("shows validation errors when submitting empty or invalid data", async () => {
		(useLoginMutation as Mock).mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
		});

		render(
			<MemoryRouter>
				<Login />
			</MemoryRouter>,
		);

		fireEvent.click(screen.getByRole("button", { name: /login/i }));

		await waitFor(() => {
			expect(screen.getByText(/email can't be empty!/i)).toBeInTheDocument();
			expect(screen.getByText(/password can't be empty!/i)).toBeInTheDocument();
		});

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "invalidemail" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "somepassword" },
		});

		fireEvent.click(screen.getByRole("button", { name: /login/i }));

		await waitFor(() => {
			expect(screen.getByText(/email must be valid!/i)).toBeInTheDocument();
		});
	});

	it("submits form with correct data", async () => {
		const mutateMock = vi.fn((data, { onSuccess }) =>
			onSuccess({
				jwt: "mock-token",
				user: {
					id: 1,
					blocked: false,
					confirmed: true,
					documentId: "doc123",
					email: data.identifier,
					provider: "local",
					username: "mockuser",
				},
			}),
		);

		(useLoginMutation as Mock).mockReturnValue({
			mutate: mutateMock,
			isPending: false,
		});

		render(
			<MemoryRouter>
				<Login />
			</MemoryRouter>,
		);

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "password123" },
		});

		fireEvent.click(screen.getByRole("button", { name: /login/i }));

		await waitFor(() => {
			expect(mutateMock).toHaveBeenCalledWith(
				{
					identifier: "test@example.com",
					password: "password123",
				},
				expect.anything(),
			);
		});
	});
});
