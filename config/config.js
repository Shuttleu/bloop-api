module.exports = {
  development: {
    storage: "database_dev.sqlite",
    dialect: "sqlite"
  },
  test: {
    storage: "database_test.sqlite",
    dialect: "sqlite"
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB,
    host: process.env.DB_ADDRESS,
    port: process.env.DB_PORT,
    dialect: "postgres"
  }
}
