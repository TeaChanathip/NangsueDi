import { getCurrentUnix } from './getCurrentUnix';

export function calculateAge(unixBirthTime): number {
    // Current Unix timestamp (in seconds)
    const currentUnixTime = getCurrentUnix();

    // Convert Unix timestamp to milliseconds
    const birthDate = new Date(unixBirthTime * 1000);
    const currentDate = new Date(currentUnixTime * 1000);

    // Calculate the difference in milliseconds
    const ageInMilliseconds = currentDate.getTime() - birthDate.getTime();

    // Convert milliseconds to years
    const ageDate = new Date(ageInMilliseconds);

    // Extract the year difference
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    return age;
}
