import type { Pagination } from "./response";

export interface Category {
	id: number;
	documentId: string;
	name?: Name;
	description?: null;
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date;
	locale: null;
	content?: string;
}

export interface CategoriesResBody {
	data: Category[];
	meta: {
		pagination: Pagination;
	};
}
