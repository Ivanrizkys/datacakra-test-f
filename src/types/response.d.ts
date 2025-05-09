export interface ResponseError<T = unknown> {
	data: null;
	error: {
		status: number;
		name: string;
		message: string;
		details: T;
	};
}
