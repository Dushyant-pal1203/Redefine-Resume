const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false, // Disable SQL query logging
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  dialectOptions: {
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
  },
});

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    console.error("\nTIPS:");
    console.error("- Check if PostgreSQL is running");
    console.error("- Verify DATABASE_URL in .env");
    console.error("- Run: createdb resume_builder");
    process.exit(1);
  }
};

// Only test connection if not in test environment
if (process.env.NODE_ENV !== "test") {
  testConnection();
}

module.exports = sequelize;
