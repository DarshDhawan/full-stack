import { neon } from '@neondatabase/serverless';

const MAX_INPUT_LENGTH = 300;

export default async function handler(request, response) {
    response.setHeader('Cache-Control', 'no-store');

    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        return response.status(503).json({ error: 'Database is not configured yet' });
    }

    let body = request.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch {
            return response.status(400).json({ error: 'Request body must be valid JSON' });
        }
    }

    const input = typeof body?.input === 'string' ? body.input.trim() : '';
    if (!input) {
        return response.status(400).json({ error: 'Input is required' });
    }
    if (input.length > MAX_INPUT_LENGTH) {
        return response.status(400).json({ error: `Input must be ${MAX_INPUT_LENGTH} characters or fewer` });
    }

    try {
        const sql = neon(connectionString);

        // Create the table on first use so no manual SQL setup is needed.
        await sql`CREATE TABLE IF NOT EXISTS terminal_logs (
            id BIGSERIAL PRIMARY KEY,
            input TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`;

        const [record] = await sql`
            INSERT INTO terminal_logs (input)
            VALUES (${input})
            RETURNING id
        `;

        return response.status(200).json({ success: true, id: record.id });
    } catch {
        console.error('Terminal database write failed');
        return response.status(500).json({ error: 'Could not save command to the database' });
    }
}
