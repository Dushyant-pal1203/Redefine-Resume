const fs = require("fs");
const readline = require("readline");
const { exec } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("RESUME BUILDER SERVER SETUP");

// Function to execute shell commands
const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
};

const setup = async () => {
  try {
    let selectedPort = "5001"; // Default value

    // Step 1: Check if .env exists
    if (!fs.existsSync(".env")) {
      console.log("\nCreating .env file...");

      await new Promise((resolve) => {
        const answers = {};

        rl.question(
          "Enter DATABASE_URL (or press Enter for default 'postgresql://localhost:5432/resume_builder'): ",
          (dbUrl) => {
            answers.DATABASE_URL =
              dbUrl || "postgresql://localhost:5432/resume_builder";

            rl.question("Enter PORT (default: 5001): ", (port) => {
              answers.PORT = port || "5001";
              selectedPort = answers.PORT;

              rl.question(
                "Enter JWT_SECRET for authentication (any random string): ",
                (jwtSecret) => {
                  answers.JWT_SECRET =
                    jwtSecret || "your_jwt_secret_key_change_in_production";

                  const envContent = `# Database Configuration
DATABASE_URL=${answers.DATABASE_URL}

# Server Configuration
PORT=${answers.PORT}
NODE_ENV=development
JWT_SECRET=${answers.JWT_SECRET}

# Optional: For production
# NODE_ENV=production
# CORS_ORIGIN=https://your-frontend.com`;

                  fs.writeFileSync(".env", envContent);
                  console.log("✅ .env file created!");
                  resolve();
                },
              );
            });
          },
        );
      });
    } else {
      console.log("📁 .env file already exists.");
    }

    // Step 2: Install dependencies
    console.log("\n📦 Installing dependencies...");

    try {
      await runCommand("npm install");
      console.log("✅ Dependencies installed!");
    } catch (error) {
      console.log("⚠️  Trying alternative installation...");
      await runCommand("npm ci");
      console.log("✅ Dependencies installed!");
    }

    // Step 3: Test database connection
    console.log("\n🗄️  Testing database connection...");

    // Load environment variables
    require("dotenv").config();

    // Import the sequelize instance
    const sequelize = require("./db/config");

    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Database connection successful!");

    // Step 4: Create database tables
    console.log("\n📊 Creating database tables...");

    // Import models to ensure they're registered
    require("./db/models");

    // Sync database
    await sequelize.sync({ alter: true });
    console.log("✅ Database tables created!");

    console.log(`
✅ SETUP COMPLETED!

Next: npm start (runs on http://localhost:${selectedPort})`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Setup failed:", error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

// Run setup
setup();
