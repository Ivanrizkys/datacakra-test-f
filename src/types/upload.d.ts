export interface UploadReqBody {
	files: File;
}
export interface UploadResBody {
	id: number;
	documentId: string;
	name: string;
	alternativeText: null;
	caption: null;
	width: null;
	height: null;
	formats: null;
	hash: string;
	ext: string;
	mime: string;
	size: number;
	url: string;
	previewUrl: null;
	provider: string;
	provider_metadata: {
		public_id: string;
		resource_type: string;
	};
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date;
	locale: null;
}
