require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || "Classroom",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    logging: console.log,
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      timestamps: true,
      underscored: false
    },
    dialectOptions: {
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  },
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME_TEST || "Classroom",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    logging: false,
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      timestamps: true,
      underscored: false
    }
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      timestamps: true,
      underscored: false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  }
};
