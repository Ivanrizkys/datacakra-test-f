interface User {
	id: number;
	documentId: string;
	username: string;
	email: string;
	provider: string;
	confirmed: boolean;
	blocked: boolean;
	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date;
	locale: null;
}

export interface LoginReqBody {
	identifier: string;
	password: string;
}
export interface LoginResBody {
	jwt: string;
	user: User;
}

export interface RegisterReqBody {
	email: string;
	username: string;
	password: string;
}
export interface RegisterResBody {
	jwt: string;
	user: User;
}
