export interface Comments {
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
