import PageLoader from "@/components/common/PageLoader";
import TopBar, { type TopBarMenu } from "@/components/common/TopBar";
import useAuth from "@/hooks/UseAuth";
import { Suspense } from "react";
import { Navigate, Outlet } from "react-router";

const menu: TopBarMenu[] = [
	{
		name: "Article",
		url: "/dashboard/article",
	},
];

export function DashboardLayout() {
	const auth = useAuth();
	return auth ? (
		<div className="flex min-h-screen w-full flex-col">
			<TopBar listMenu={menu} />
			<Suspense fallback={<PageLoader description="Please Wait" />}>
				<Outlet />
			</Suspense>
		</div>
	) : (
		<Navigate to="/auth/login" />
	);
}
