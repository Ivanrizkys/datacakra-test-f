import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { AuthLayout } from "..";

vi.mock("react-router", async () => {
	const actual =
		await vi.importActual<typeof import("react-router")>("react-router");
	return {
		...actual,
		Link: ({
			to,
			className,
			children,
		}: { to: string; className: string; children: React.ReactNode }) => (
			<a href={to} className={className} data-testid="link">
				{children}
			</a>
		),
	};
});

describe("AuthLayout", () => {
	it("renders correctly with login variant", () => {
		render(
			<MemoryRouter>
				<AuthLayout
					title="Login to your account"
					description="Enter your credentials below"
					variant="login"
				>
					<div data-testid="form-content">Login Form</div>
				</AuthLayout>
			</MemoryRouter>,
		);

		// * Check title and description
		expect(screen.getByText("Login to your account")).toBeInTheDocument();
		expect(
			screen.getByText("Enter your credentials below"),
		).toBeInTheDocument();

		// * Check children are rendered
		expect(screen.getByTestId("form-content")).toBeInTheDocument();

		// * Check login-specific text
		expect(screen.getByText(/Don't have an account yet/)).toBeInTheDocument();

		// * Check link destination
		const registerLink = screen.getByTestId("link");
		expect(registerLink).toHaveAttribute("href", "/auth/register");
		expect(registerLink).toHaveTextContent("Register");
	});

	it("renders correctly with register variant", () => {
		render(
			<MemoryRouter>
				<AuthLayout
					title="Create an account"
					description="Fill in your details to register"
					variant="register"
				>
					<div data-testid="form-content">Register Form</div>
				</AuthLayout>
			</MemoryRouter>,
		);

		// * Check title and description
		expect(screen.getByText("Create an account")).toBeInTheDocument();
		expect(
			screen.getByText("Fill in your details to register"),
		).toBeInTheDocument();

		// * Check register-specific text
		expect(screen.getByText(/Already have an account yet/)).toBeInTheDocument();

		// * Check link destination
		const loginLink = screen.getByTestId("link");
		expect(loginLink).toHaveAttribute("href", "/auth/login");
		expect(loginLink).toHaveTextContent("Login");
	});

	it("renders children correctly", () => {
		render(
			<MemoryRouter>
				<AuthLayout
					title="Test Title"
					description="Test Description"
					variant="login"
				>
					<div data-testid="custom-component">Custom Component</div>
					<button type="button" data-testid="test-button">
						Test Button
					</button>
				</AuthLayout>
			</MemoryRouter>,
		);

		expect(screen.getByTestId("custom-component")).toBeInTheDocument();
		expect(screen.getByTestId("test-button")).toBeInTheDocument();
		expect(screen.getByText("Custom Component")).toBeInTheDocument();
	});

	it("applies responsive classes correctly", () => {
		const { container } = render(
			<MemoryRouter>
				<AuthLayout
					title="Test Title"
					description="Test Description"
					variant="login"
				>
					<div>Content</div>
				</AuthLayout>
			</MemoryRouter>,
		);

		// * Check main container has the correct grid classes
		const mainElement = container.querySelector("main");
		expect(mainElement).toHaveClass("grid-cols-1");
		expect(mainElement).toHaveClass("lg:grid-cols-2");

		// * Check dark section is hidden on mobile
		const sections = container.querySelectorAll("section");
		expect(sections[0]).toHaveClass("hidden");
		expect(sections[0]).toHaveClass("lg:block");
	});
});
