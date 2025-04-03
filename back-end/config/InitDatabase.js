const { Sequelize } = require('sequelize');
const { sequelize } = require('../models');
require('dotenv').config();

const db = {
  initialize: async () => {
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully.');

      const dbInfo = sequelize.config;
      console.log(`ℹ️  Connected to ${dbInfo.database} on ${dbInfo.host} as ${dbInfo.username}`);

      await db.checkTables();

      return {
        database: dbInfo.database,
        host: dbInfo.host,
        username: dbInfo.username,
      };
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError.message);
      throw new Error('Database connection failed');
    }
  },

  checkTables: async () => {
    try {
      const [results] = await sequelize.query("SHOW TABLES");
      const tableCount = results.length;
      const forceMigration = process.env.FORCE_MIGRATION === 'true';

      if (forceMigration) {
        console.log('⚠️ FORCE_MIGRATION enabled. Dropping and recreating all tables...');
        
        // Disable foreign key checks to allow dropping tables with dependencies
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        
        // Get all table names
        const [tables] = await sequelize.query('SHOW TABLES');
        const tableNames = tables.map(result => Object.values(result)[0]);
        
        // Drop all tables individually
        for (const table of tableNames) {
          await sequelize.query(`DROP TABLE IF EXISTS \`${table}\``);
          console.log(`🗑️  Dropped table: ${table}`);
        }
        
        // Re-enable foreign key checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        
        // Now sync all models to create tables
        await sequelize.sync();
        console.log('✅ Database schema recreated successfully.');
      } else if (tableCount === 0) {
        console.log('🔄 No tables found. Initializing database schema...');
        await sequelize.sync();
        console.log('✅ Database schema created successfully.');
      } else {
        console.log(`✅ Database already contains ${tableCount} tables. No migration needed.`);
      }
    } catch (error) {
      console.error('❌ Failed to manage database schema:', error.message);
      throw new Error('Database schema management failed');
    }
  },

  getSequelize: () => sequelize
};

module.exports = db;
