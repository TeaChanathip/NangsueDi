export function numToBool(num: number | undefined): boolean | undefined {
    if (num === undefined) return undefined;
    return num !== 0;
}
