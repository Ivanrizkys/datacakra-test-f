import type { ReactNode } from "react";
import { Link } from "react-router";

interface AuthLayoutProps {
	title: string;
	description: string;
	children: ReactNode;
	variant: "login" | "register";
}

export function AuthLayout({
	title,
	description,
	children,
	variant,
}: AuthLayoutProps) {
	return (
		<main className="min-h-dvh grid grid-cols-1 lg:grid-cols-2 overflow-y-hidden">
			<section className="bg-zinc-900 hidden lg:block" />
			<section className="flex flex-col items-center justify-center px-6 relative">
				<div className="max-w-[25rem] w-full">
					<h1 className="text-foreground text-3xl sm:text-4xl font-bold text-center">
						{title}
					</h1>
					<p className="text-muted-foreground text-sm mt-2 mb-6 text-center">
						{description}
					</p>
					{children}
					{variant === "login" && (
						<p className="text-muted-foreground text-sm text-center mt-4">
							Don't have an account yet ?{" "}
							<Link
								className="underline underline-offset-4 hover:text-primary"
								to="/auth/register"
							>
								Register
							</Link>
						</p>
					)}
					{variant === "register" && (
						<p className="text-muted-foreground text-sm text-center mt-4">
							Already have an account yet ?{" "}
							<Link
								className="underline underline-offset-4 hover:text-primary"
								to="/auth/login"
							>
								Login
							</Link>
						</p>
					)}
				</div>
			</section>
		</main>
	);
}
