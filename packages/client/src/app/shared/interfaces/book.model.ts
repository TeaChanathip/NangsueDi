export interface Book {
	_id: string;
	title: string;
	author?: string;
	description?: string;
	publishedAt?: number;
	registeredAt: number;
	updatedAt?: number;
	total: number;
	borrowed: number;
	genres?: number[];
	coverUrl?: string;
}
