const sql = require('mssql');

const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: { encrypt: true, trustServerCertificate: false },
  connectionTimeout: 60000,
  requestTimeout: 60000
};

module.exports = async function (context, req) {
  let pool;
  try {
    pool = await sql.connect(config);
    const result = await pool.request().query(
      'SELECT Country, COUNT(*) AS StudentCount FROM Students GROUP BY Country ORDER BY StudentCount DESC'
    );
    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: result.recordset
    };
  } catch (err) {
    context.log.error(err);
    context.res = { status: 500, body: { error: err.message } };
  } finally {
    if (pool) await pool.close();
  }
};
