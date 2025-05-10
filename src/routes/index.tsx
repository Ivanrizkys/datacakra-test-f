import { DashboardLayout } from "@/components/layout/Dashboard";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router";

const ArticleList = lazy(() => import("@/pages/ArticleList"));
const ArticleCreate = lazy(() => import("@/pages/ArticleCreate"));
const ArticleUpdate = lazy(() => import("@/pages/ArticleUpdate"));
const ArticleDetail = lazy(() => import("@/pages/ArticleDetail"));

export const routes = createBrowserRouter([
	{
		path: "/",
		element: <Navigate to="/dashboard/article" />,
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
