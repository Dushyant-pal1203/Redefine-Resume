const { DataTypes } = require("sequelize");
const sequelize = require("./config");
const bcrypt = require("bcryptjs");

// User Model
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100],
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(
            parseInt(process.env.BCRYPT_ROUNDS) || 10,
          );
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(
            parseInt(process.env.BCRYPT_ROUNDS) || 10,
          );
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  },
);

// Resume Model
const Resume = sequelize.define(
  "Resume",
  {
    resume_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    resume_title: {
      type: DataTypes.STRING,
      defaultValue: "Untitled Resume",
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    job_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    headline: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    portfolio_display: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedin_display: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    github_display: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    portfolio_url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
    linkedin_url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
    github_url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
    twitter_url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
    links: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    professional_summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    experience: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    education: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    projects: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    skills: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    certifications: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    achievements: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    languages: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    keywords: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    parsed_sections: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    years_of_experience: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 100,
      },
    },
    template: {
      type: DataTypes.STRING,
      defaultValue: "modern",
      validate: {
        isIn: [["modern", "professional", "creative", "minimal", "executive"]],
      },
    },
    theme_color: {
      type: DataTypes.STRING,
      defaultValue: "#2563eb",
      validate: {
        is: /^#[0-9A-F]{6}$/i,
      },
    },
    font_family: {
      type: DataTypes.STRING,
      defaultValue: "Inter",
      validate: {
        isIn: [
          ["Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins"],
        ],
      },
    },
    layout: {
      type: DataTypes.STRING,
      defaultValue: "single-column",
      validate: {
        isIn: [["single-column", "two-column", "compact"]],
      },
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    lastGenerated: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    pdfUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["user_id"],
      },
      {
        fields: ["is_public"],
      },
      {
        fields: ["template"],
      },
    ],
  },
);

// Instance method to check password
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Relations
User.hasMany(Resume, { foreignKey: "user_id", onDelete: "CASCADE" });
Resume.belongsTo(User, { foreignKey: "user_id" });

module.exports = { User, Resume };
