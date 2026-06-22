const PASSWORD_ITERATIONS = 210000;
const PASSWORD_KEY_BYTES = 32;

const encoder = new TextEncoder();

function bytesToBase64(bytes: Uint8Array) {
	let binary = "";
	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}
	return btoa(binary);
}

function base64ToBytes(value: string) {
	const binary = atob(value);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

function timingSafeEqual(a: string, b: string) {
	const left = encoder.encode(a);
	const right = encoder.encode(b);
	const length = Math.max(left.length, right.length);
	let diff = left.length ^ right.length;

	for (let i = 0; i < length; i++) {
		diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
	}

	return diff === 0;
}

export function randomId(prefix = "") {
	return `${prefix}${crypto.randomUUID()}`;
}

export function randomToken() {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	return bytesToBase64(bytes).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export function randomSalt() {
	const bytes = new Uint8Array(16);
	crypto.getRandomValues(bytes);
	return bytesToBase64(bytes);
}

export async function hashPassword(password: string, salt: string) {
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		encoder.encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);
	const bits = await crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			hash: "SHA-256",
			salt: base64ToBytes(salt),
			iterations: PASSWORD_ITERATIONS,
		},
		keyMaterial,
		PASSWORD_KEY_BYTES * 8,
	);
	return `pbkdf2-sha256:${PASSWORD_ITERATIONS}:${bytesToBase64(new Uint8Array(bits))}`;
}

export async function verifyPassword(
	password: string,
	salt: string,
	expectedHash: string,
) {
	const actualHash = await hashPassword(password, salt);
	return timingSafeEqual(actualHash, expectedHash);
}

export async function hmacSha256Base64(secret: string, value: string) {
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
	return bytesToBase64(new Uint8Array(signature));
}

export async function sha256Base64(value: string) {
	const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
	return bytesToBase64(new Uint8Array(digest));
}
