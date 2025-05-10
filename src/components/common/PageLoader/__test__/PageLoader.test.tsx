import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PageLoader from "..";

describe("PageLoader", () => {
	it("renders loading spinner and description", () => {
		const testDescription = "Loading your dashboard...";

		render(<PageLoader description={testDescription} />);

		const loader = screen.getByRole("status", { hidden: true });
		expect(loader).toBeInTheDocument();

		expect(screen.getByText(testDescription)).toBeInTheDocument();
	});
});
