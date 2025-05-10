import type { User } from "./authentication";
import type { Category } from "./category";
import type { Comments } from "./comments";
import type { Pagination } from "./response";

export interface Article {
	id: number;
	documentId: string;
	title: string;
	description: string;
	cover_image_url: string;
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date;
	locale: null;
	user: User;
	category: Category | null;
	comments: Comments[];
	localizations: unknown[];
}

export interface ArticlesReqParams {
	title?: string;
	page?: number;
	pageSize?: number;
}
export interface ArticlesResBody {
	data: Article[];
	meta: {
		pagination: Pagination;
	};
}

export interface DeleteArticleReqParams {
	documentId: string;
}

export interface DeleteArticleBulkReqParams {
	documentId: string[];
}

export interface CreateArticleReqBody {
	data: {
		title: string;
		description: string;
		cover_image_url: string;
		category: number;
	};
}
export interface CreateArtcileResBody {
	data: Omit<Article, "user" | "category" | "comments" | "localizations">;
	meta: unknown;
}

export interface ArticleResBody {
	data: Omit<Article, "user" | "category" | "comments" | "localizations">;
	meta: unknown;
}

export interface UpdateArticleReqBody {
	data: {
		documentId: string;
		title: string;
		description: string;
		cover_image_url: string;
		category: number;
	};
}
export interface UpdateArtcileResBody {
	data: Omit<Article, "user" | "category" | "comments" | "localizations">;
	meta: unknown;
}
