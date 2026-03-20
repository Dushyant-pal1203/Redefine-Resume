const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");

// Simple function to create a default avatar if you don't have one
async function createDefaultAvatar() {
  const uploadDir = path.join(__dirname, "../uploads/avatars");
  const defaultAvatarPath = path.join(uploadDir, "default-avatar.png");

  // Check if default avatar already exists
  if (fs.existsSync(defaultAvatarPath)) {
    console.log("Default avatar already exists at:", defaultAvatarPath);
    return;
  }

  // Create a simple default avatar using canvas (you'll need to install canvas first)
  // Alternatively, you can just copy a default image file to this location

  console.log("Please place a default-avatar.png file at:", defaultAvatarPath);
  console.log(
    "You can download a default avatar from: https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
  );
}

createDefaultAvatar();
