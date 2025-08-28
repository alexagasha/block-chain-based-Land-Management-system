const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres"
  }
);

// Import models
const User = require("./User")(sequelize, DataTypes);
const LandMetadata = require("./LandMetadata")(sequelize, DataTypes);

// Sync database
sequelize.sync()
  .then(() => console.log("✅ Database synced"))
  .catch(err => console.error("❌ Error syncing DB:", err));

module.exports = { sequelize, User, LandMetadata };
