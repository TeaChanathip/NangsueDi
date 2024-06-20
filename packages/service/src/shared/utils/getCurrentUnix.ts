export function getCurrentUnix(): number {
    return Math.floor(new Date().getTime() / 1000);
}
