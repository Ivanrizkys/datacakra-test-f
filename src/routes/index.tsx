import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { createBrowserRouter } from "react-router";

export const routes = createBrowserRouter([
	{
		path: "/",
		element: <div className="text-center">Landing Page Route</div>,
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
