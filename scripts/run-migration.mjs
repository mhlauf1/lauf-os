import pg from 'pg'
import { readFileSync } from 'fs'
import { config } from 'dotenv'

config({ path: '.env.local' })

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
})

async function runMigration() {
  const sql = readFileSync('supabase/migrations/20250126_fix_user_trigger.sql', 'utf8')

  console.log('Running migration...')
  console.log('SQL:', sql.substring(0, 200) + '...')

  try {
    await pool.query(sql)
    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error.message)
  } finally {
    await pool.end()
  }
}

runMigration()
