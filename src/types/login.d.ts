export interface IAccount {
	name: string
	password: string
}

export interface ILoginResData {
	id: number;
	name: string;
	token: string;
}

export interface ILoginRes {
	code: number;
	data: ILoginResData;
}
