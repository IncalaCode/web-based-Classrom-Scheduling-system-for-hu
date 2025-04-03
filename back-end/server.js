const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const routes = require('./routes');
const db = require('./config/InitDatabase');
const app = express();
const PORT = process.env.PORT || 3001;
require('dotenv').config();


app.use(helmet());
app.use(cors()); 
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true })); 



app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const startServer = async () => {
  try {
    const dbInfo = await db.initialize();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📚 Database: ${dbInfo.database} (${dbInfo.tableCount} tables)`);
      console.log(`🔗 API URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1)
});


module.exports = app; 
