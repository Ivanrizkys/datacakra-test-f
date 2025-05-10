import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Returns the uppercase initials of a full name to be used on a badge.
 *
 * @param fullName - The full name (e.g., "Ivan Rizky Saputra").
 * @returns A string of uppercase initials (e.g., "IRS").
 */
export function getInitials(fullName: string): string {
	return fullName
		.trim()
		.split(/\s+/) // Split by one or more spaces
		.map((word) => word[0])
		.join("")
		.toUpperCase();
}

/**
 * Converts an image URL into a File object.
 * @param {string} imageUrl - The URL of the image to convert.
 * @returns {Promise<File>} A Promise that resolves to a File object.
 */
export async function imageURLToFile(imageUrl: string): Promise<File> {
	const response = await fetch(imageUrl);
	const blob = await response.blob();

	const url = new URL(imageUrl);
	const pathname = url.pathname;
	const fileName =
		pathname.substring(pathname.lastIndexOf("/") + 1) || "image.jpg";

	const contentType = blob.type || "image/jpeg";

	return new File([blob], fileName, { type: contentType });
}
