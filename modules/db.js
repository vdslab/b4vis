const { Client } = require("pg");

export async function selectRows(sql, search) {
  const client = new Client({
    host: process.env.PGHOST,
    port: 5432,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  });
  await client.connect();
  const result = await client.query(sql, search);
  await client.end();
  return result.rows;
}
