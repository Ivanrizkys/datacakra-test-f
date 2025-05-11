import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUserStore } from "@/global/user";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProviders";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import {
	CircleUser,
	Laptop,
	Menu,
	Moon,
	Newspaper,
	Package2,
	Sun,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

export interface TopBarMenu {
	name: string;
	url: string;
}

interface TopBarProps {
	listMenu: TopBarMenu[];
}

export default function TopBar({ listMenu }: TopBarProps) {
	const { setUser } = useUserStore((state) => state);

	const navigate = useNavigate();
	const { pathname } = useLocation();
	const queryClient = useQueryClient();
	const { setTheme } = useTheme();

	const handleLogOut = () => {
		queryClient.removeQueries();
		toast("Logged Out Successfully", {
			description: "You have been logged out. See you next time!",
		});
		navigate("/auth/login");
		setTimeout(() => {
			Cookies.remove("token");
			setUser(null);
		}, 300);
	};

	return (
		<header className="sticky z-10 top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
			<nav className="hidden flex-col text-lg font-medium md:flex md:flex-row md:items-center md:text-sm gap-3">
				<Link
					to="/dashboard/article"
					className="flex items-center gap-2 text-lg font-semibold md:text-base"
				>
					<span
						className="text-xl font-bold bg-primary text-primary-foreground w-7 h-7 flex items-center justify-center rounded"
						aria-hidden="true"
					>
						A
					</span>
					<span className="sr-only">Article</span>
				</Link>
				{listMenu.map((menu) => (
					<Link
						key={menu.url}
						to={menu.url}
						className={cn(
							"transition-colors hover:text-foreground text-nowrap",
							pathname === menu.url
								? "text-foreground"
								: "text-muted-foreground",
						)}
					>
						{menu.name}
					</Link>
				))}
			</nav>
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="outline" size="icon" className="shrink-0 md:hidden">
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left">
					<nav className="grid gap-6 text-lg font-medium p-4">
						<Link
							to="/dashboard/article"
							className="flex items-center gap-2 text-lg font-semibold"
						>
							<Package2 className="h-6 w-6" />
							<span className="sr-only">Article</span>
						</Link>
						{listMenu.map((menu) => (
							<Link
								key={menu.url}
								to={menu.url}
								className={cn(
									"transition-colors hover:text-foreground text-nowrap",
									pathname === menu.url
										? "text-foreground"
										: "text-muted-foreground",
								)}
							>
								{menu.name}
							</Link>
						))}
					</nav>
				</SheetContent>
			</Sheet>
			<div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="secondary"
							size="icon"
							className="rounded-full ml-auto"
						>
							<CircleUser className="h-5 w-5" />
							<span className="sr-only">Toggle user menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<span>Theme</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent sideOffset={8}>
									<DropdownMenuItem onClick={() => setTheme("light")}>
										<Sun className="mr-2 h-4 w-4" />
										<span>Light</span>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setTheme("dark")}>
										<Moon className="mr-2 h-4 w-4" />
										<span>Dark</span>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setTheme("system")}>
										<Laptop className="mr-2 h-4 w-4" />
										<span>System</span>
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogOut}>Logout</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
