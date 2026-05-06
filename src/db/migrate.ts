import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { pool } from "./pool.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const migrate = async () => {
  const client = await pool.connect()

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `)

    const migrationsDir = path.join(__dirname, "migrations")
    const files = fs.readdirSync(migrationsDir).sort()

    const { rows } = await client.query("SELECT name FROM _migrations")
    const executed = rows.map((r) => r.name)

    for (const file of files) {
      if (!executed.includes(file) && file.endsWith(".sql")) {
        console.log(`Migrating: ${file}`)
        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8")

        await client.query("BEGIN")
        try {
          await client.query(sql)
          await client.query("INSERT INTO _migrations (name) VALUES ($1)", [
            file,
          ])
          await client.query("COMMIT")
          console.log(`Finished: ${file}`)
        } catch (err) {
          await client.query("ROLLBACK")
          throw err
        }
      }
    }
    console.log("Database is up to date.")
  } catch (err) {
    console.error("Migration failed:", err)
    process.exit(1)
  } finally {
    client.release()
  }
}

// We check if the current file was the one executed by Node
if (process.argv[1] === __filename) {
  migrate()
}

export default migrate
