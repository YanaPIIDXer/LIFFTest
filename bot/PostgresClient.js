const { Client } = require('pg')

export default new Client({
    connectionString: process.env.DB_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })
  