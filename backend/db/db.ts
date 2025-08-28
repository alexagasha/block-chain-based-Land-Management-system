import { Sequelize } from 'sequelize';

// Replace with your actual PostgreSQL password
const sequelize: Sequelize = new Sequelize('postgres://postgres:Nexus@localhost:5432/landdb', {
  dialect: 'postgres',
  logging: false, // Disable SQL logging, you can turn it on for debugging
});

const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
    await sequelize.sync({ force: false }); // Don't drop tables, just sync models
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    process.exit(1);
  }
};

export { sequelize, connectDB };
