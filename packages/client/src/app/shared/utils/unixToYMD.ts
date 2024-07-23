export function unixToYMD(unix: number): string {
	const date = new Date(unix * 1000);
	return date.toISOString().split('T')[0];
}
