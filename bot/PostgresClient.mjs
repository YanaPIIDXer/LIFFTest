import pkg from 'pg'
const { Client } = pkg

export default new Client({
    connectionString: process.env.DB_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })
  