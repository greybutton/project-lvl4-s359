module.exports = {
  development: {
    storage: './db.development.sqlite',
    dialect: 'sqlite',
  },
  test: {
    storage: ':memory:',
    dialect: 'sqlite',
  },
  production: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    use_env_variable: 'DATABASE_URL',
  },
};
