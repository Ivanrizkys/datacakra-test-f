import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { routes } from "./routes";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 0,
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={routes} />
		</QueryClientProvider>
	);
}

export default App;
