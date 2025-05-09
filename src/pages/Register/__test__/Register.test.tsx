import { useUserStore } from "@/global/user";
import { useRegisterMutation } from "@/service/authentication";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { Register } from "..";

vi.mock("@/service/authentication", () => ({
	useRegisterMutation: vi.fn(),
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

describe("Register Component", () => {
	beforeEach(() => {
		(useUserStore as unknown as Mock).mockReturnValue(mockSetUser);
	});

	it("renders form fields", () => {
		(useRegisterMutation as Mock).mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
		});

		render(
			<MemoryRouter>
				<Register />
			</MemoryRouter>,
		);

		expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /register/i }),
		).toBeInTheDocument();
	});

	it("shows validation errors when submitting empty or invalid data", async () => {
		(useRegisterMutation as Mock).mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
		});

		render(
			<MemoryRouter>
				<Register />
			</MemoryRouter>,
		);

		fireEvent.click(screen.getByRole("button", { name: /register/i }));

		await waitFor(() => {
			expect(screen.getByText(/username can't be empty!/i)).toBeInTheDocument();
			expect(screen.getByText(/email can't be empty!/i)).toBeInTheDocument();
			expect(screen.getByText(/password can't be empty!/i)).toBeInTheDocument();
		});

		fireEvent.change(screen.getByLabelText(/username/i), {
			target: { value: "some" },
		});
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "invalidemail" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "some" },
		});

		fireEvent.click(screen.getByRole("button", { name: /register/i }));

		await waitFor(() => {
			expect(
				screen.getByText(/username must contains atleast 5 character length!/i),
			).toBeInTheDocument();
			expect(screen.getByText(/email must be valid!/i)).toBeInTheDocument();
			expect(
				screen.getByText(/password must contains atleast 5 character length!/i),
			).toBeInTheDocument();
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

		(useRegisterMutation as Mock).mockReturnValue({
			mutate: mutateMock,
			isPending: false,
		});

		render(
			<MemoryRouter>
				<Register />
			</MemoryRouter>,
		);

		fireEvent.change(screen.getByLabelText(/username/i), {
			target: { value: "testexample" },
		});
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "password123" },
		});

		fireEvent.click(screen.getByRole("button", { name: /register/i }));

		await waitFor(() => {
			expect(mutateMock).toHaveBeenCalledWith(
				{
					email: "test@example.com",
					password: "password123",
					username: "testexample",
				},
				expect.anything(),
			);
		});
	});
});
