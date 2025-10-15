export type PublicUser = {
	id: string;
	email: string;
	name: string;
	createdAt: string;
};

export type AuthTokenPayload = {
	userId: string;
	email: string;
	name: string;
};

export type Credentials = {
	email: string;
	password: string;
};

