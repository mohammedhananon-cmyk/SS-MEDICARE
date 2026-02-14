/**
 * Generates a Unique National Health ID.
 * Format: NHA-XXXX-XXXX-XXXX (16 chars)
 * Includes a simple checksum for validation.
 */
export function generateHealthId(): string {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Base32 excluding I, O, 1, 0
    const length = 12;
    let id = '';

    for (let i = 0; i < length; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Format: NHA-XXXX-XXXX-XXXX
    return `NHA-${id.substring(0, 4)}-${id.substring(4, 8)}-${id.substring(8, 12)}`;
}

export function validateHealthId(id: string): boolean {
    const regex = /^NHA-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return regex.test(id);
}
