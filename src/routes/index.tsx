import { DashboardLayout } from "@/components/layout/Dashboard";
import LandingPage from "@/pages/LandingPage";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const ArticleList = lazy(() => import("@/pages/ArticleList"));
const ArticleCreate = lazy(() => import("@/pages/ArticleCreate"));
const ArticleUpdate = lazy(() => import("@/pages/ArticleUpdate"));
const ArticleDetail = lazy(() => import("@/pages/ArticleDetail"));

export const routes = createBrowserRouter([
	{
		path: "/",
		element: <LandingPage />,
	},
	{
		path: "/dashboard",
		element: <DashboardLayout />,
		children: [
			{
				path: "article",
				element: <ArticleList />,
			},
			{
				path: "article/create",
				element: <ArticleCreate />,
			},
			{
				path: "article/update/:documentId",
				element: <ArticleUpdate />,
			},
			{
				path: "article/:documentId",
				element: <ArticleDetail />,
			},
		],
	},
	{
		path: "/auth",
		children: [
			{
				path: "login",
				element: <Login />,
			},
			{
				path: "register",
				element: <Register />,
			},
		],
	},
]);
