import { KyInstance } from "@/config/ky";
import type {
	ArticleResBody,
	ArticlesReqParams,
	ArticlesResBody,
	CreateArtcileResBody,
	CreateArticleReqBody,
	DeleteArticleBulkReqParams,
	DeleteArticleReqParams,
	UpdateArtcileResBody,
	UpdateArticleReqBody,
} from "@/types/article";
import type { ResponseError } from "@/types/response";
import {
	type DefaultError,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import { HTTPError } from "ky";

export const useGetArticles = ({
	page,
	pageSize,
	title,
}: ArticlesReqParams) => {
	const params: Record<string, string | number | boolean> = {
		populate: "*",
		"pagination[page]": page ? page : 1,
		"pagination[pageSize]": pageSize ? pageSize : 10,
		...(title ? { "filters[title][$eqi]": title } : {}),
	};

	return useQuery({
		queryKey: ["articles", { ...params }],
		queryFn: () =>
			KyInstance()("api/articles", {
				searchParams: params,
			}).json<ArticlesResBody>(),
	});
};

export const useGetArticle = (documentId: string, enabled = true) => {
	return useQuery({
		queryKey: ["article", documentId],
		queryFn: () =>
			KyInstance()(`api/articles/${documentId}`).json<ArticleResBody>(),
		enabled,
	});
};

export const useDeleteArticleMutation = () => {
	return useMutation<null, DefaultError, DeleteArticleReqParams>({
		mutationFn: async (data) => {
			try {
				return await KyInstance()
					.delete(`api/articles/${data.documentId}`)
					.json();
			} catch (error) {
				if (error instanceof HTTPError) {
					try {
						const jsonError = await error.response.json<ResponseError>();
						throw new Error(jsonError.error.message);
					} catch (error) {
						throw new Error(
							(error as string | undefined) ??
								"Delete article failed, please try again",
						);
					}
				}
				throw new Error("Delete article failed");
			}
		},
	});
};

export const useDeleteArticleBulkMutation = () => {
	return useMutation<null, DefaultError, DeleteArticleBulkReqParams>({
		mutationFn: async (data) => {
			for (const documentId of data.documentId) {
				try {
					await KyInstance().delete(`api/articles/${documentId}`).json();
				} catch (error) {
					if (error instanceof HTTPError) {
						try {
							const jsonError = await error.response.json<ResponseError>();
							throw new Error(jsonError.error.message);
						} catch (error) {
							throw new Error(
								(error as string | undefined) ??
									"Delete article failed, please try again",
							);
						}
					}
					throw new Error("Delete article failed");
				}
			}
			return null;
		},
	});
};

export const useCreateArticleMutation = () => {
	return useMutation<CreateArtcileResBody, DefaultError, CreateArticleReqBody>({
		mutationFn: async (data) => {
			try {
				return await KyInstance()
					.post("api/articles", {
						json: data,
					})
					.json<CreateArtcileResBody>();
			} catch (error) {
				if (error instanceof HTTPError) {
					try {
						const jsonError = await error.response.json<ResponseError>();
						throw new Error(jsonError.error.message);
					} catch (error) {
						throw new Error(
							(error as string | undefined) ??
								"Create new article failed, please try again",
						);
					}
				}
				throw new Error("Create new article failed");
			}
		},
	});
};

export const useUpdateArticleMutation = () => {
	return useMutation<UpdateArtcileResBody, DefaultError, UpdateArticleReqBody>({
		mutationFn: async (data) => {
			try {
				return await KyInstance()
					.put(`api/articles/${data.data.documentId}`, {
						json: {
							data: {
								title: data.data.title,
								description: data.data.description,
								cover_image_url: data.data.cover_image_url,
								category: data.data.category,
							},
						},
					})
					.json<UpdateArtcileResBody>();
			} catch (error) {
				if (error instanceof HTTPError) {
					try {
						const jsonError = await error.response.json<ResponseError>();
						throw new Error(jsonError.error.message);
					} catch (error) {
						throw new Error(
							(error as string | undefined) ??
								"Create new article failed, please try again",
						);
					}
				}
				throw new Error("Create new article failed");
			}
		},
	});
};
