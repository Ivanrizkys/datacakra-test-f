import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/UseAuth";
import { useTheme } from "@/providers/ThemeProviders";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { Link } from "react-router";

export default function LandingPage() {
	const auth = useAuth();
	const { theme, setTheme } = useTheme();

	return (
		<div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
			<header className="border-b border-border">
				<div className="containe mx-auto r flex items-center justify-between h-16 px-4 md:px-6">
					<Link
						to="/"
						className="flex items-center gap-2"
						aria-label="Article home"
					>
						<span
							className="text-xl font-bold bg-primary text-primary-foreground px-2 py-1 rounded"
							aria-hidden="true"
						>
							A
						</span>
						<span className="font-semibold">Article</span>
					</Link>

					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							aria-label={
								theme === "dark"
									? "Switch to light theme"
									: "Switch to dark theme"
							}
						>
							<Sun
								className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
								aria-hidden="true"
							/>
							<Moon
								className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
								aria-hidden="true"
							/>
						</Button>

						<Button asChild className="hidden md:flex">
							<Link to={auth ? "/dashboard/article" : "/auth/login"}>
								{auth ? "Dashboard" : "Login"}
							</Link>
						</Button>
					</div>
				</div>
			</header>

			<main
				id="main-content"
				className="flex-1 grid md:grid-cols-2 container mx-auto px-4 md:px-6 overflow-hidden"
			>
				<section
					className="flex flex-col justify-center py-12 md:py-0"
					aria-labelledby="hero-heading"
				>
					<div className="space-y-6 max-w-[600px]">
						<h1
							id="hero-heading"
							className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter"
						>
							Manage Your Articles with Ease
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground">
							A powerful dashboard for creating, reading, updating, and deleting
							your articles. Created to participate in the recruitment process
							at Datacakra.
						</p>
						<Button size="lg" asChild>
							<Link to="/auth/login">
								Get Started
								<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
							</Link>
						</Button>
					</div>
				</section>
				<aside
					className="hidden md:flex items-center justify-center relative"
					aria-label="Dashboard preview"
				>
					<div className="relative w-full max-w-[600px] aspect-[4/3] rounded-lg overflow-hidden shadow-2xl border border-border transform rotate-1 hover:rotate-0 transition-transform duration-300">
						<div className="absolute inset-0 bg-card rounded-lg">
							<div className="h-10 bg-primary/10 border-b border-border flex items-center px-4">
								<div className="flex gap-2" aria-hidden="true">
									<div className="w-3 h-3 rounded-full bg-destructive" />
									<div className="w-3 h-3 rounded-full bg-chart-4" />
									<div className="w-3 h-3 rounded-full bg-chart-1" />
								</div>
							</div>
							<div className="grid grid-cols-4 gap-4 p-4" aria-hidden="true">
								<div className="col-span-1 space-y-2">
									<div className="h-8 bg-accent rounded" />
									<div className="h-8 bg-accent rounded" />
									<div className="h-8 bg-accent rounded" />
									<div className="h-8 bg-accent rounded" />
									<div className="h-8 bg-accent rounded" />
								</div>
								<div className="col-span-3 space-y-4">
									<div className="h-10 bg-accent rounded flex items-center justify-between px-4">
										<div className="w-24 h-4 bg-muted-foreground/20 rounded" />
										<div className="w-20 h-6 bg-primary rounded" />
									</div>
									<div className="grid grid-cols-3 gap-4">
										{[1, 2, 3, 4, 5, 6].map((i) => (
											<div
												key={i}
												className="aspect-video bg-accent rounded p-2"
											>
												<div className="w-full h-4 bg-muted-foreground/20 rounded mb-2" />
												<div className="w-2/3 h-3 bg-muted-foreground/20 rounded" />
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div
						className="absolute -bottom-10 left-10 w-50 h-50 bg-primary/10 rounded-full blur-3xl"
						aria-hidden="true"
					/>
					<div
						className="absolute -top-10 right-10 w-50 h-50 bg-primary/10 rounded-full blur-3xl"
						aria-hidden="true"
					/>
				</aside>
			</main>
			<footer className="border-t border-border py-4">
				<div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4 md:px-6 text-sm text-muted-foreground">
					<p>© {new Date().getFullYear()} Article. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}
