export interface ResponseError<T = unknown> {
	data: null;
	error: {
		status: number;
		name: string;
		message: string;
		details: T;
	};
}

export interface Pagination {
	page: number;
	pageSize: number;
	pageCount: number;
	total: number;
}
