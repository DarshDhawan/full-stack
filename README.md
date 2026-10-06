# Portfolio site

Static HTML, CSS, and JavaScript with a Vercel API function that saves terminal input to Neon Postgres.

## Deploy on Vercel with a database

1. Import `DarshDhawan/full-stack` into a Vercel Hobby project. Use the repository root and the **Other** framework preset; no build command or output directory is needed for the static site.
2. In the Vercel project, open **Storage** and add a Neon Postgres database using the free plan. Connect it to the project and make sure the `DATABASE_URL` environment variable is available to Production deployments.
3. Deploy (or redeploy) the project. The `terminal_logs` table is created automatically on the first successful terminal submission.

The `DATABASE_URL` value is a secret. Keep it in Vercel's environment-variable settings; do not commit it to this repository.

The terminal endpoint accepts `POST /api/terminal` with JSON such as `{"input":"whoami"}`. It stores the text only; it does not execute shell commands.
