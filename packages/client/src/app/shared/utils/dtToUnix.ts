export function dtToUnix(dt: string | Date) {
	dt = new Date(dt);
	return Math.floor(dt.getTime() / 1000);
}
