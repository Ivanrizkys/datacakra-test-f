import { KyInstance } from "@/config/ky";
import type { CategoriesResBody } from "@/types/category";
import { useQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
	const params: Record<string, string | number | boolean> = {
		populate: "*",
	};

	return useQuery({
		queryKey: ["categories", { ...params }],
		queryFn: () =>
			KyInstance()("api/categories", {
				searchParams: params,
			}).json<CategoriesResBody>(),
	});
};
